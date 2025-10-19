import { google } from 'googleapis'
import { prisma } from '../db'
import { encrypt, decrypt } from '../encryption'
import { TokenRefreshService } from '../token-refresh'

const youtube = google.youtube('v3')
const youtubeAnalytics = google.youtubeAnalytics('v2')

export class YouTubeService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    )
  }

  // 獲取 OAuth 授權 URL
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly'
      ]
    })
  }

  // 處理 OAuth 回調
  async handleCallback(code: string, creatorId: string) {
    const { tokens } = await this.oauth2Client.getAccessToken(code)
    this.oauth2Client.setCredentials(tokens)

    // 獲取頻道信息
    const channelResponse = await youtube.channels.list({
      auth: this.oauth2Client,
      part: ['snippet', 'statistics'],
      mine: true
    })

    const channel = channelResponse.data.items?.[0]
    if (!channel) throw new Error('No channel found')

    // 保存平台連接
    await prisma.platformConnection.upsert({
      where: {
        creatorId_platform: {
          creatorId,
          platform: 'YOUTUBE'
        }
      },
      create: {
        creatorId,
        platform: 'YOUTUBE',
        platformId: channel.id!,
        username: channel.snippet?.title || '',
        accessToken: encrypt(tokens.access_token!),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        lastSync: new Date()
      },
      update: {
        accessToken: encrypt(tokens.access_token!),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        lastSync: new Date(),
        isActive: true
      }
    })

    return channel
  }

  // 同步頻道數據
  async syncChannelData(platformConnectionId: string) {
    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId },
      include: { creator: true }
    })

    if (!connection) throw new Error('Platform connection not found')

    // 設置認證
    this.oauth2Client.setCredentials({
      access_token: decrypt(connection.accessToken!),
      refresh_token: connection.refreshToken ? decrypt(connection.refreshToken) : undefined
    })

    // 獲取最新影片
    const videosResponse = await youtube.search.list({
      auth: this.oauth2Client,
      part: ['snippet'],
      channelId: connection.platformId,
      type: ['video'],
      order: 'date',
      maxResults: 50
    })

    const videos = videosResponse.data.items || []

    // 處理每個影片
    for (const video of videos) {
      await this.syncVideoData(video.id?.videoId!, connection.id, connection.creatorId)
    }

    // 更新最後同步時間
    await prisma.platformConnection.update({
      where: { id: platformConnectionId },
      data: { lastSync: new Date() }
    })
  }

  // 同步單個影片數據
  async syncVideoData(videoId: string, platformConnectionId: string, creatorId: string) {
    // 獲取影片詳細信息
    const videoResponse = await youtube.videos.list({
      auth: this.oauth2Client,
      part: ['snippet', 'statistics', 'contentDetails', 'liveStreamingDetails'],
      id: [videoId]
    })

    const video = videoResponse.data.items?.[0]
    if (!video) return

    // 保存或更新影片記錄
    const content = await prisma.content.upsert({
      where: {
        platform_platformVideoId: {
          platform: 'YOUTUBE',
          platformVideoId: videoId
        }
      },
      create: {
        creatorId,
        platformId: platformConnectionId,
        platform: 'YOUTUBE',
        platformVideoId: videoId,
        contentType: video.snippet?.liveBroadcastContent === 'live' ? 'LIVE_STREAM' : 'VIDEO',
        title: video.snippet?.title || '',
        description: video.snippet?.description || '',
        thumbnailUrl: video.snippet?.thumbnails?.high?.url,
        duration: this.parseDuration(video.contentDetails?.duration),
        publishedAt: new Date(video.snippet?.publishedAt!),
        isLive: video.snippet?.liveBroadcastContent === 'live'
      },
      update: {
        title: video.snippet?.title || '',
        description: video.snippet?.description || '',
        thumbnailUrl: video.snippet?.thumbnails?.high?.url,
        isLive: video.snippet?.liveBroadcastContent === 'live'
      }
    })

    // 保存指標數據
    const stats = video.statistics
    if (stats) {
      await prisma.contentMetrics.create({
        data: {
          contentId: content.id,
          views: parseInt(stats.viewCount || '0'),
          likes: parseInt(stats.likeCount || '0'),
          comments: parseInt(stats.commentCount || '0'),
          subscribersGained: 0 // 需要從 Analytics API 獲取
        }
      })
    }

    // 獲取分析數據 (需要 Analytics API)
    await this.syncVideoAnalytics(videoId, content.id)
  }

  // 同步影片分析數據
  async syncVideoAnalytics(videoId: string, contentId: string) {
    try {
      const analyticsResponse = await youtubeAnalytics.reports.query({
        auth: this.oauth2Client,
        ids: 'channel==MINE',
        startDate: '2023-01-01',
        endDate: '2024-12-31',
        metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained',
        dimensions: 'video',
        filters: `video==${videoId}`
      })

      const data = analyticsResponse.data.rows?.[0]
      if (data) {
        await prisma.contentAnalytics.create({
          data: {
            contentId,
            watchTimeMinutes: parseFloat(data[1] as string) || 0,
            averageWatchTime: parseFloat(data[2] as string) || 0,
            // 更多分析數據...
          }
        })
      }
    } catch (error) {
      console.error('Error syncing video analytics:', error)
    }
  }

  // 獲取單個影片信息 (類似 Twitch 的 getVideoInfo)
  async getVideoInfo(videoId: string, platformConnectionId: string) {
    try {
      // 使用 token 刷新機制來確保有效的 access token
      const result = await TokenRefreshService.handleApiCallWithTokenRefresh(
        platformConnectionId,
        async (accessToken: string) => {
          // 設置認證
          this.oauth2Client.setCredentials({
            access_token: accessToken
          })

          const response = await youtube.videos.list({
            auth: this.oauth2Client,
            part: ['snippet', 'statistics', 'contentDetails'],
            id: [videoId]
          })

          const video = response.data.items?.[0]
          if (!video) return null

          return {
            id: video.id!,
            title: video.snippet?.title || '',
            description: video.snippet?.description || '',
            thumbnail_url: video.snippet?.thumbnails?.maxres?.url || 
                          video.snippet?.thumbnails?.high?.url || 
                          video.snippet?.thumbnails?.medium?.url,
            view_count: parseInt(video.statistics?.viewCount || '0'),
            like_count: parseInt(video.statistics?.likeCount || '0'),
            comment_count: parseInt(video.statistics?.commentCount || '0'),
            created_at: video.snippet?.publishedAt!,
            duration: video.contentDetails?.duration || '',
            url: `https://www.youtube.com/watch?v=${videoId}`,
            channel_id: video.snippet?.channelId,
            channel_title: video.snippet?.channelTitle
          }
        }
      )

      return result
    } catch (error) {
      console.error('Error fetching YouTube video info:', error)
      return null
    }
  }

  // 從 YouTube URL 提取影片 ID
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  // 解析 YouTube 影片時長格式 (PT1M30S -> 90 seconds)
  parseDuration(duration?: string | null): number | null {
    if (!duration) return null
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return null

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    return hours * 3600 + minutes * 60 + seconds
  }
}
