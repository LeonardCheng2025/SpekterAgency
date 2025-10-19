import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'
import { TwitchService } from '../../../lib/api/twitch'
import { YouTubeService } from '../../../lib/api/youtube'

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

// 轉換 YouTube ISO 8601 duration 格式為秒數
function parseDuration(duration: string): number | null {
  if (!duration) return null
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return null
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  return hours * 3600 + minutes * 60 + seconds
}

interface SubmitContentRequest {
  url: string
  creatorId: string // Super admin specifies which creator this content belongs to
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 驗證用戶身份和 super admin 權限
    const user = await getCurrentUser(req)
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!user.isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' })
    }

    const { url, creatorId }: SubmitContentRequest = req.body

    if (!url || !creatorId) {
      return res.status(400).json({ error: 'URL and Creator ID are required' })
    }

    // 驗證目標創作者存在
    const targetCreator = await prisma.creator.findUnique({
      where: { id: creatorId },
      select: { id: true, name: true }
    })

    if (!targetCreator) {
      return res.status(404).json({ error: 'Target creator not found' })
    }

    // URL 驗證和解析邏輯
    let platform: 'YOUTUBE' | 'TWITCH' | null = null
    let videoId: string | null = null
    let contentType: 'VIDEO' | 'LIVE_STREAM' = 'VIDEO'

    // YouTube URL 解析
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YOUTUBE'
      
      if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?&]+)/)
        videoId = match ? match[1] : null
      } else if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url)
        videoId = urlObj.searchParams.get('v')
      } else if (url.includes('youtube.com/live/')) {
        const match = url.match(/youtube\.com\/live\/([^?&]+)/)
        videoId = match ? match[1] : null
        contentType = 'LIVE_STREAM'
      }
    }
    // Twitch URL 解析
    else if (url.includes('twitch.tv')) {
      platform = 'TWITCH'
      
      if (url.includes('/videos/')) {
        const match = url.match(/\/videos\/(\d+)/)
        videoId = match ? match[1] : null
        contentType = 'VIDEO'
      } else if (url.includes('/clip/')) {
        return res.status(400).json({ error: 'Twitch clips are not supported yet' })
      } else {
        return res.status(400).json({ error: 'Only Twitch VODs are supported' })
      }
    }
    else {
      return res.status(400).json({ error: 'Unsupported platform. Only YouTube and Twitch are supported.' })
    }

    if (!videoId) {
      return res.status(400).json({ error: 'Could not extract video ID from URL' })
    }

    // 檢查是否已經提交過相同內容
    const existingContent = await prisma.content.findFirst({
      where: {
        creatorId: creatorId,
        originalUrl: url
      }
    })

    if (existingContent) {
      return res.status(409).json({ error: 'This content has already been submitted' })
    }

    // 獲取目標創作者的平台連接（用於 platformId 字段）
    const platformConnection = await prisma.platformConnection.findFirst({
      where: {
        creatorId: creatorId,
        platform: platform,
        isActive: true
      }
    })

    if (!platformConnection) {
      return res.status(400).json({ 
        error: `Target creator has no active ${platform} connection` 
      })
    }

    // 使用與原本 submit API 相同的邏輯
    let videoData: any = {
      title: `${platform} Content`,
      description: '',
      thumbnailUrl: null,
      duration: null,
      publishedAt: new Date(),
      views: 0
    }

    // 獲取 Super Admin (Charles Cheng) 的平台連接用於 API 調用
    const superAdminConnection = await prisma.platformConnection.findFirst({
      where: {
        creatorId: user.id, // Charles Cheng 的 ID
        platform: platform,
        isActive: true
      }
    })

    // 根據平台獲取內容詳細信息 (使用 Super Admin 的 API 連接獲取影片信息)
    if (platform === 'TWITCH') {
      try {
        const twitchService = new TwitchService()
        
        if ((contentType === 'VIDEO' || contentType === 'LIVE_STREAM') && videoId) {
          // 優先使用 Super Admin 的 Twitch 連接來獲取影片信息
          const connectionToUse = superAdminConnection || platformConnection
          
          console.log(`🔧 Super Admin using ${superAdminConnection ? 'own' : 'target creator'} Twitch connection for video info`)
          
          // 獲取 VOD 詳細信息
          const twitchVideo = await twitchService.getVideoInfo(videoId, connectionToUse.id)
          
          if (twitchVideo) {
            videoData = {
              title: twitchVideo.title,
              description: twitchVideo.description,
              thumbnailUrl: cleanUrl(twitchVideo.thumbnail_url || ''),
              duration: twitchVideo.duration,
              publishedAt: new Date(twitchVideo.created_at),
              views: twitchVideo.view_count || 0
            }
          } else {
            return res.status(400).json({ error: 'Could not fetch Twitch video information' })
          }
        }
      } catch (error) {
        console.error('Twitch API error:', error)
        return res.status(500).json({ error: 'Failed to fetch Twitch video information' })
      }
    } else if (platform === 'YOUTUBE') {
      try {
        const youtubeService = new YouTubeService()
        
        if ((contentType === 'VIDEO' || contentType === 'LIVE_STREAM') && videoId) {
          // 優先使用 Super Admin 的 YouTube 連接來獲取影片信息
          const connectionToUse = superAdminConnection || platformConnection
          
          console.log(`🔧 Super Admin using ${superAdminConnection ? 'own' : 'target creator'} YouTube connection for video info`)
          
          // 獲取 YouTube 影片詳細信息
          const youtubeVideo = await youtubeService.getVideoInfo(videoId, connectionToUse.id)
          
          if (youtubeVideo) {
            videoData = {
              title: youtubeVideo.title,
              description: youtubeVideo.description,
              thumbnailUrl: cleanUrl(youtubeVideo.thumbnail_url || ''),
              duration: parseDuration(youtubeVideo.duration || ''),
              publishedAt: new Date(youtubeVideo.created_at),
              views: youtubeVideo.view_count || 0,
              likes: youtubeVideo.like_count || 0,
              comments: youtubeVideo.comment_count || 0
            }
          } else {
            return res.status(400).json({ error: 'Could not fetch YouTube video information' })
          }
        }
      } catch (error) {
        console.error('YouTube API error:', error)
        return res.status(500).json({ error: 'Failed to fetch YouTube video information' })
      }
    }

    // 使用與原本相同的 upsert 邏輯
    const newContent = await prisma.content.upsert({
      where: {
        platform_platformVideoId: {
          platform: platform,
          platformVideoId: videoId!
        }
      },
      create: {
        creatorId: creatorId,
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
        validationStatus: 'APPROVED', // Super admin 提交的內容默認批准
        originalUrl: url // 設置原始 URL
      },
      update: {
        title: videoData.title || undefined,
        description: videoData.description || undefined,
        thumbnailUrl: videoData.thumbnailUrl || undefined,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: {
            name: true,
            avatar: true
          }
        },
        metrics: true
      }
    })

    // 總是創建 content metrics 記錄，即使觀看數為 0
    await prisma.contentMetrics.create({
      data: {
        contentId: newContent.id,
        views: videoData.views || 0,
        likes: videoData.likes || 0,
        dislikes: videoData.dislikes || 0,
        comments: videoData.comments || 0,
        shares: 0,
        retrievedAt: new Date()
      }
    })

    console.log(`✅ Super admin ${user.name} submitted content for creator ${targetCreator.name}:`, newContent.title)

    return res.status(200).json({
      message: `Content submitted successfully for ${targetCreator.name}`,
      content: {
        id: newContent.id,
        title: newContent.title,
        platform: newContent.platform,
        platformVideoId: newContent.platformVideoId,
        contentType: newContent.contentType,
        thumbnailUrl: newContent.thumbnailUrl,
        url: url,
        embedUrl: platform === 'TWITCH' ? 
          `https://player.twitch.tv/?video=${videoId}&parent=${process.env.FRONTEND_DOMAIN || 'localhost'}` :
          null,
        submittedBy: user.name,
        submittedFor: targetCreator.name
      }
    })

  } catch (error) {
    console.error('Super admin content submission error:', error)
    res.status(500).json({ 
      error: 'Failed to submit content',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
