import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 獲取所有 Twitch 相關數據
    const twitchCreators = await prisma.creator.findMany({
      where: {
        platforms: {
          some: {
            platform: 'TWITCH',
            isActive: true
          }
        }
      },
      include: {
        platforms: {
          where: {
            platform: 'TWITCH'
          },
          select: {
            id: true,
            platform: true,
            platformId: true,
            username: true,
            isActive: true,
            lastSync: true,
            createdAt: true,
            updatedAt: true
          }
        },
        contents: {
          where: {
            platform: 'TWITCH'
          },
          include: {
            metrics: true
          },
          orderBy: {
            publishedAt: 'desc'
          },
          take: 5 // 只取最近 5 個內容
        },
        metrics: {
          where: {
            platform: 'TWITCH'
          },
          orderBy: {
            retrievedAt: 'desc'
          },
          take: 1 // 最新的創作者指標
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 統計數據
    const stats = {
      totalTwitchCreators: twitchCreators.length,
      totalTwitchContent: await prisma.content.count({
        where: { platform: 'TWITCH' }
      }),
      totalTwitchMetrics: await prisma.contentMetrics.count({
        where: {
          content: {
            platform: 'TWITCH'
          }
        }
      })
    }

    return res.status(200).json({
      message: 'Twitch data analysis',
      stats,
      creators: twitchCreators.map(creator => ({
        id: creator.id,
        name: creator.name,
        email: creator.email,
        avatar: creator.avatar,
        createdAt: creator.createdAt,
        platforms: creator.platforms,
        contentCount: creator.contents.length,
        contents: creator.contents.map(content => ({
          id: content.id,
          title: content.title,
          contentType: content.contentType,
          publishedAt: content.publishedAt,
          isLive: content.isLive,
          liveStatus: content.liveStatus,
          duration: content.duration,
          metricsCount: content.metrics.length,
          latestMetrics: content.metrics[0] || null
        })),
        latestMetrics: creator.metrics[0] || null
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Twitch data analysis error:', error)
    return res.status(500).json({ 
      error: 'Failed to analyze Twitch data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

export default withCors(handler)
