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

    // 獲取用戶最近提交的內容及其 metrics
    const userContents = await prisma.content.findMany({
      where: {
        creatorId: user.id
      },
      include: {
        metrics: {
          orderBy: {
            retrievedAt: 'desc'
          },
          take: 1 // 只取最新的 metrics
        },
        platformConnection: {
          select: {
            platform: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // 最近 10 個內容
    })

    // 統計數據
    const stats = {
      totalContents: userContents.length,
      contentsWithMetrics: userContents.filter(c => c.metrics.length > 0).length,
      contentsMissingMetrics: userContents.filter(c => c.metrics.length === 0).length,
      platformBreakdown: {
        TWITCH: userContents.filter(c => c.platform === 'TWITCH').length,
        YOUTUBE: userContents.filter(c => c.platform === 'YOUTUBE').length,
        FACEBOOK: userContents.filter(c => c.platform === 'FACEBOOK').length
      }
    }

    // 詳細內容信息
    const contentDetails = userContents.map(content => ({
      id: content.id,
      title: content.title,
      platform: content.platform,
      platformVideoId: content.platformVideoId,
      contentType: content.contentType,
      thumbnailUrl: content.thumbnailUrl,
      duration: content.duration,
      publishedAt: content.publishedAt,
      createdAt: content.createdAt,
      hasMetrics: content.metrics.length > 0,
      latestMetrics: content.metrics[0] || null,
      platformConnection: content.platformConnection
    }))

    return res.status(200).json({
      message: 'Content storage verification complete',
      user: {
        id: user.id,
        name: user.name
      },
      stats,
      contentDetails,
      verification: {
        allContentsHaveMetrics: stats.contentsMissingMetrics === 0,
        dataIntegrity: stats.totalContents > 0 ? 
          `${Math.round((stats.contentsWithMetrics / stats.totalContents) * 100)}% of contents have metrics` :
          'No contents found'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Content storage verification error:', error)
    return res.status(500).json({
      error: 'Failed to verify content storage',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

export default withCors(handler)
