import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { getCurrentUser } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 驗證用戶身份
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 獲取用戶提交的所有內容
    const contents = await prisma.content.findMany({
      where: {
        creatorId: user.id,
        validationStatus: 'APPROVED' // 只顯示已批准的內容
      },
      include: {
        metrics: {
          orderBy: {
            retrievedAt: 'desc'
          },
          take: 1 // 只取最新的指標
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化內容數據，包含 embed URL
    const formattedContents = contents.map(content => {
      let embedUrl = null
      
      // 優先使用數據庫中的 originalUrl，如果沒有則生成
      let originalUrl = content.originalUrl

      if (content.platform === 'TWITCH') {
        const domain = process.env.FRONTEND_DOMAIN || 'localhost'
        
        if (content.contentType === 'VIDEO') {
          // VOD embed
          embedUrl = `https://player.twitch.tv/?video=${content.platformVideoId}&parent=${domain}`
          // 如果數據庫沒有 originalUrl，則生成一個
          if (!originalUrl) {
            originalUrl = `https://www.twitch.tv/videos/${content.platformVideoId}`
          }
        } else if (content.contentType === 'LIVE_STREAM') {
          // Channel embed (for live streams)
          embedUrl = `https://player.twitch.tv/?channel=${content.platformVideoId}&parent=${domain}`
          if (!originalUrl) {
            originalUrl = `https://www.twitch.tv/${content.platformVideoId}`
          }
        }
      } else if (content.platform === 'YOUTUBE') {
        // YouTube 不需要 embedUrl（因為 CSP 限制），但需要 originalUrl
        if (!originalUrl) {
          originalUrl = `https://www.youtube.com/watch?v=${content.platformVideoId}`
        }
      }

      return {
        id: content.id,
        title: content.title,
        description: content.description,
        platform: content.platform,
        platformVideoId: content.platformVideoId,
        contentType: content.contentType,
        thumbnailUrl: content.thumbnailUrl,
        duration: content.duration,
        publishedAt: content.publishedAt,
        isLive: content.isLive,
        liveStatus: content.liveStatus,
        createdAt: content.createdAt,
        embedUrl,
        originalUrl,
        latestMetrics: content.metrics[0] || null
      }
    })

    return res.status(200).json({
      message: 'Content retrieved successfully',
      contents: formattedContents,
      total: formattedContents.length
    })

  } catch (error) {
    console.error('Get content error:', error)
    return res.status(500).json({ 
      error: 'Failed to retrieve content',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
