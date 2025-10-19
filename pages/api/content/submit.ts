import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'
import { TwitchService } from '../../../lib/api/twitch'
import { YouTubeService } from '../../../lib/api/youtube'
import { decrypt } from '../../../lib/encryption'

// 清理和修正 URL
function cleanUrl(url: string): string {
  if (!url) return url
  
  // 先處理模板變量
  let cleanedUrl = url
    .replace('%{width}', '1280')
    .replace('%{height}', '720')
  
  // 修正路徑中的多個斜杠，但保留協議部分的雙斜杠和 Twitch 的 /thumb/thumb 結構
  const protocolMatch = cleanedUrl.match(/^(https?:\/\/)/)
  if (protocolMatch) {
    const protocol = protocolMatch[1]
    const rest = cleanedUrl.substring(protocol.length)
    // 只修正連續的多個斜杠（3個或以上），保留 /thumb/thumb 這種正常結構
    cleanedUrl = protocol + rest.replace(/\/\/\/+/g, '//')
  }
  
  return cleanedUrl
}

interface SubmitContentRequest {
  url: string
  platform: 'TWITCH' | 'YOUTUBE' | 'FACEBOOK'
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 驗證用戶身份
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { url, platform }: SubmitContentRequest = req.body

    if (!url || !platform) {
      return res.status(400).json({ error: 'URL and platform are required' })
    }

    // 解析 URL 獲取影片 ID
    let videoId: string | null = null
    const contentType = 'VIDEO' // 現在只支援影片類型

    if (platform === 'TWITCH') {
      // 只支援 VOD 格式
      const twitchPattern = /twitch\.tv\/videos\/(\d+)/
      const match = url.match(twitchPattern)
      
      if (match) {
        videoId = match[1]
      } else {
        return res.status(400).json({ error: 'Invalid Twitch URL format. Only twitch.tv/videos/XXXXX is supported.' })
      }
    } else if (platform === 'YOUTUBE') {
      // 使用 YouTube 服務提取影片 ID
      videoId = YouTubeService.extractVideoId(url)
      
      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL format. Only youtube.com/watch?v=VIDEO_ID is supported.' })
      }
    }

    // 獲取用戶的平台連接
    const platformConnection = await prisma.platformConnection.findFirst({
      where: {
        creatorId: user.id,
        platform: platform,
        isActive: true
      }
    })

    if (!platformConnection) {
      return res.status(400).json({ error: `No active ${platform} connection found` })
    }

    // 如果是 Twitch，嘗試從 API 獲取影片詳細信息
    let videoData: any = {}
    
    if (platform === 'TWITCH') {
      try {
        const twitchService = new TwitchService()
        const decryptedToken = decrypt(platformConnection.accessToken!)
        
        if (contentType === 'VIDEO' && videoId) {
          // 獲取 VOD 詳細信息 - 使用新的 token 刷新機制
          const twitchVideo = await twitchService.getVideoInfo(videoId, platformConnection.id)
          
          if (twitchVideo) {
            videoData = {
              title: twitchVideo.title,
              description: twitchVideo.description || '',
              thumbnailUrl: twitchVideo.thumbnail_url ? cleanUrl(twitchVideo.thumbnail_url) : null,
              duration: twitchService.parseDuration(twitchVideo.duration),
              publishedAt: new Date(twitchVideo.created_at),
              views: twitchVideo.view_count || 0,
              // 從 Twitch API 可能獲取的其他數據
              likes: 0, // Twitch 不提供按讚數，但保留欄位
              comments: 0, // 可能的留言數
              peakViewers: null, // 直播時的峰值觀眾數
              averageViewers: null, // 平均觀眾數
              chatMessages: null, // 聊天訊息數
              followers: null // 關注者增長數
            }
          } else {
            videoData = {
              title: `Twitch Video ${videoId}`,
              description: '',
              thumbnailUrl: null,
              duration: null,
              publishedAt: new Date(),
              views: 0
            }
          }
        } else {
          // 對於直播或其他類型，使用基本信息
          videoData = {
            title: `Twitch Stream`,
            description: '',
            thumbnailUrl: null,
            duration: null,
            publishedAt: new Date(),
            views: 0
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch video info from Twitch API:', error)
        // 使用基本信息作為後備
        videoData = {
          title: `Twitch Content ${videoId}`,
          description: '',
          thumbnailUrl: null,
          duration: null,
          publishedAt: new Date(),
          views: 0
        }
      }
    } else if (platform === 'YOUTUBE') {
      try {
        const youtubeService = new YouTubeService()
        const decryptedToken = decrypt(platformConnection.accessToken!)
        
        if (contentType === 'VIDEO' && videoId) {
          // 獲取 YouTube 影片詳細信息 - 使用新的 token 刷新機制
          const youtubeVideo = await youtubeService.getVideoInfo(videoId, platformConnection.id)
          
          if (youtubeVideo) {
            videoData = {
              title: youtubeVideo.title,
              description: youtubeVideo.description || '',
              thumbnailUrl: youtubeVideo.thumbnail_url || null,
              duration: youtubeService.parseDuration(youtubeVideo.duration),
              publishedAt: new Date(youtubeVideo.created_at),
              views: youtubeVideo.view_count || 0,
              likes: youtubeVideo.like_count || 0,
              comments: youtubeVideo.comment_count || 0,
              // YouTube 特有數據
              channelId: youtubeVideo.channel_id,
              channelTitle: youtubeVideo.channel_title
            }
          } else {
            videoData = {
              title: `YouTube Video ${videoId}`,
              description: '',
              thumbnailUrl: null,
              duration: null,
              publishedAt: new Date(),
              views: 0
            }
          }
        } else {
          videoData = {
            title: `YouTube Content`,
            description: '',
            thumbnailUrl: null,
            duration: null,
            publishedAt: new Date(),
            views: 0
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch video info from YouTube API:', error)
        videoData = {
          title: `YouTube Content ${videoId}`,
          description: '',
          thumbnailUrl: null,
          duration: null,
          publishedAt: new Date(),
          views: 0
        }
      }
    } else {
      // 其他平台使用基本信息
      videoData = {
        title: `${platform} Content`,
        description: '',
        thumbnailUrl: null,
        duration: null,
        publishedAt: new Date(),
        views: 0
      }
    }

    // 保存 content 到數據庫
    const content = await prisma.content.upsert({
      where: {
        platform_platformVideoId: {
          platform: platform,
          platformVideoId: videoId!
        }
      },
      create: {
        creatorId: user.id,
        platformId: platformConnection.id,
        platform: platform,
        platformVideoId: videoId!,
        contentType: contentType,
        title: videoData.title || `${platform} Content`,
        description: videoData.description || '',
        thumbnailUrl: videoData.thumbnailUrl || null,
        duration: videoData.duration || null,
        publishedAt: videoData.publishedAt || new Date(),
        isLive: false,
        liveStatus: 'ended',
        validationStatus: 'APPROVED', // 用戶提交的內容默認批准
        originalUrl: url // 設置原始 URL
      },
      update: {
        title: videoData.title || undefined,
        description: videoData.description || undefined,
        thumbnailUrl: videoData.thumbnailUrl || undefined,
        updatedAt: new Date()
      },
      include: {
        metrics: true
      }
    })

    // 總是創建 content metrics 記錄，即使觀看數為 0
    await prisma.contentMetrics.create({
      data: {
        contentId: content.id,
        views: videoData.views || 0,
        likes: videoData.likes || 0,
        dislikes: videoData.dislikes || 0,
        comments: videoData.comments || 0,
        shares: 0,
        // Twitch 特定數據（如果有的話）
        peakViewers: videoData.peakViewers || null,
        averageViewers: videoData.averageViewers || null,
        chatMessages: videoData.chatMessages || null,
        followers: videoData.followers || null,
        retrievedAt: new Date()
      }
    })
    

    return res.status(200).json({
      message: 'Content submitted successfully',
      content: {
        id: content.id,
        title: content.title,
        platform: content.platform,
        platformVideoId: content.platformVideoId,
        contentType: content.contentType,
        thumbnailUrl: content.thumbnailUrl,
        url: url,
        embedUrl: platform === 'TWITCH' ? 
          `https://player.twitch.tv/?video=${videoId}&parent=${process.env.FRONTEND_DOMAIN || 'localhost'}` :
          null
      }
    })

  } catch (error) {
    console.error('Content submission error:', error)
    return res.status(500).json({ 
      error: 'Failed to submit content',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
