import axios from 'axios'
import { prisma } from '../db'
import { encrypt, decrypt } from '../encryption'
import { TokenRefreshService } from '../token-refresh'

export class TwitchService {
  private baseUrl = 'https://api.twitch.tv/helix'
  private authUrl = 'https://id.twitch.tv/oauth2'

  // 獲取影片詳細信息
  async getVideoInfo(videoId: string, platformConnectionId: string) {
    try {
      // 使用 token 刷新機制來確保有效的 access token
      const result = await TokenRefreshService.handleApiCallWithTokenRefresh(
        platformConnectionId,
        async (accessToken: string) => {
          const response = await axios.get(`${this.baseUrl}/videos`, {
            params: {
              id: videoId
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Client-Id': process.env.TWITCH_CLIENT_ID
            }
          })

          const video = response.data.data[0]
          if (!video) return null

          return {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnail_url: video.thumbnail_url,
            view_count: video.view_count,
            created_at: video.created_at,
            duration: video.duration,
            url: video.url,
            user_id: video.user_id,
            user_name: video.user_name
          }
        }
      )

      return result
    } catch (error) {
      console.error('Error fetching video info from Twitch:', error)
      return null
    }
  }

  // 獲取用戶信息（用於獲取頻道信息）
  async getUserInfo(userId: string, accessToken: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/users`, {
        params: {
          id: userId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
      })

      const user = response.data.data[0]
      if (!user) return null

      return {
        id: user.id,
        login: user.login,
        display_name: user.display_name,
        profile_image_url: user.profile_image_url,
        view_count: user.view_count,
        created_at: user.created_at
      }
    } catch (error) {
      console.error('Error fetching user info from Twitch:', error)
      return null
    }
  }


  // 獲取 OAuth 授權 URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      redirect_uri: process.env.TWITCH_REDIRECT_URI!,
      response_type: 'code',
      scope: 'user:read:email channel:read:subscriptions analytics:read:games analytics:read:extensions'
    })

    return `${this.authUrl}/authorize?${params.toString()}`
  }

  // 處理 OAuth 回調
  async handleCallback(code: string, creatorId: string) {
    // 交換訪問令牌
    const tokenResponse = await axios.post(`${this.authUrl}/token`, {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_REDIRECT_URI
    })

    const { access_token, refresh_token } = tokenResponse.data

    // 獲取用戶信息
    const userResponse = await axios.get(`${this.baseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID
      }
    })

    const user = userResponse.data.data[0]

    // 保存平台連接
    await prisma.platformConnection.upsert({
      where: {
        creatorId_platform: {
          creatorId,
          platform: 'TWITCH'
        }
      },
      create: {
        creatorId,
        platform: 'TWITCH',
        platformId: user.id,
        username: user.display_name,
        accessToken: encrypt(access_token),
        refreshToken: encrypt(refresh_token),
        lastSync: new Date()
      },
      update: {
        accessToken: encrypt(access_token),
        refreshToken: encrypt(refresh_token),
        lastSync: new Date(),
        isActive: true
      }
    })

    return user
  }

  // 同步頻道數據
  async syncChannelData(platformConnectionId: string) {
    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId },
      include: { creator: true }
    })

    if (!connection) throw new Error('Platform connection not found')

    const accessToken = decrypt(connection.accessToken!)

    // 獲取最新影片 (VODs)
    const videosResponse = await axios.get(`${this.baseUrl}/videos`, {
      params: {
        user_id: connection.platformId,
        type: 'archive',
        first: 20
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID
      }
    })

    const videos = videosResponse.data.data || []

    // 處理每個影片
    for (const video of videos) {
      await this.syncVideoData(video, connection.id, connection.creatorId, accessToken)
    }

    // 獲取直播數據
    await this.syncStreamData(connection.platformId, connection.id, connection.creatorId, accessToken)

    // 更新最後同步時間
    await prisma.platformConnection.update({
      where: { id: platformConnectionId },
      data: { lastSync: new Date() }
    })
  }

  // 同步影片數據 (VODs)
  async syncVideoData(video: any, platformConnectionId: string, creatorId: string, accessToken: string) {
    // 保存或更新影片記錄
    const content = await prisma.content.upsert({
      where: {
        platform_platformVideoId: {
          platform: 'TWITCH',
          platformVideoId: video.id
        }
      },
      create: {
        creatorId,
        platformId: platformConnectionId,
        platform: 'TWITCH',
        platformVideoId: video.id,
        contentType: 'VIDEO',
        title: video.title,
        description: video.description || '',
        thumbnailUrl: video.thumbnail_url,
        duration: this.parseDuration(video.duration),
        publishedAt: new Date(video.created_at)
      },
      update: {
        title: video.title,
        description: video.description || '',
        thumbnailUrl: video.thumbnail_url
      }
    })

    // 保存基本指標
    await prisma.contentMetrics.create({
      data: {
        contentId: content.id,
        views: video.view_count || 0
      }
    })
  }

  // 同步直播數據
  async syncStreamData(userId: string, platformConnectionId: string, creatorId: string, accessToken: string) {
    try {
      // 獲取當前直播
      const streamResponse = await axios.get(`${this.baseUrl}/streams`, {
        params: {
          user_id: userId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
      })

      const streams = streamResponse.data.data || []

      for (const stream of streams) {
        // 保存或更新直播記錄
        const content = await prisma.content.upsert({
          where: {
            platform_platformVideoId: {
              platform: 'TWITCH',
              platformVideoId: `stream_${stream.id}`
            }
          },
          create: {
            creatorId,
            platformId: platformConnectionId,
            platform: 'TWITCH',
            platformVideoId: `stream_${stream.id}`,
            contentType: 'LIVE_STREAM',
            title: stream.title,
            description: '',
            thumbnailUrl: stream.thumbnail_url?.replace('{width}', '1280').replace('{height}', '720'),
            publishedAt: new Date(stream.started_at),
            isLive: true,
            liveStatus: 'live'
          },
          update: {
            title: stream.title,
            isLive: true,
            liveStatus: 'live'
          }
        })

        // 保存直播指標
        await prisma.contentMetrics.create({
          data: {
            contentId: content.id,
            views: stream.viewer_count || 0,
            peakViewers: stream.viewer_count || 0,
            averageViewers: stream.viewer_count || 0
          }
        })
      }
    } catch (error) {
      console.error('Error syncing stream data:', error)
    }
  }

  // 獲取頻道分析數據
  async syncChannelAnalytics(platformConnectionId: string) {
    const connection = await prisma.platformConnection.findUnique({
      where: { id: platformConnectionId }
    })

    if (!connection) return

    const accessToken = decrypt(connection.accessToken!)

    try {
      // 獲取關注者數據
      const followersResponse = await axios.get(`${this.baseUrl}/users/follows`, {
        params: {
          to_id: connection.platformId
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID
        }
      })

      const totalFollowers = followersResponse.data.total || 0

      // 保存創作者指標
      await prisma.creatorMetrics.create({
        data: {
          creatorId: connection.creatorId,
          platform: 'TWITCH',
          subscriberCount: totalFollowers,
          totalViews: 0, // 需要累計計算
          totalVideos: 0, // 需要累計計算
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          periodEnd: new Date()
        }
      })
    } catch (error) {
      console.error('Error syncing channel analytics:', error)
    }
  }

  // 解析 Twitch 時長格式 (1h2m3s -> 3723 seconds)
  parseDuration(duration: string): number {
    if (!duration) return 0
    
    const parts = duration.match(/(\d+)h|(\d+)m|(\d+)s/g) || []
    let totalSeconds = 0

    parts.forEach(part => {
      if (part.includes('h')) {
        totalSeconds += parseInt(part) * 3600
      } else if (part.includes('m')) {
        totalSeconds += parseInt(part) * 60
      } else if (part.includes('s')) {
        totalSeconds += parseInt(part)
      }
    })

    return totalSeconds
  }
}
