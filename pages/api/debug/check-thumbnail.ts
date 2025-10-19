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

    // 獲取用戶的 content 數據
    const contents = await prisma.content.findMany({
      where: {
        creatorId: user.id
      },
      include: {
        metrics: {
          orderBy: {
            retrievedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // 檢查縮圖 URL 和數據
    const thumbnailCheck = contents.map(content => ({
      id: content.id,
      title: content.title,
      platform: content.platform,
      thumbnailUrl: content.thumbnailUrl,
      hasThumbnail: !!content.thumbnailUrl,
      thumbnailLength: content.thumbnailUrl?.length || 0,
      thumbnailDomain: content.thumbnailUrl ? 
        new URL(content.thumbnailUrl).hostname : null,
      isValidUrl: content.thumbnailUrl ? 
        /^https?:\/\/.+/.test(content.thumbnailUrl) : false,
      contentType: content.contentType,
      createdAt: content.createdAt,
      hasMetrics: content.metrics.length > 0,
      views: content.metrics[0]?.views || 0
    }))

    return res.status(200).json({
      message: 'Thumbnail check complete',
      user: {
        id: user.id,
        name: user.name
      },
      totalContents: contents.length,
      thumbnailStats: {
        withThumbnail: thumbnailCheck.filter(c => c.hasThumbnail).length,
        withoutThumbnail: thumbnailCheck.filter(c => !c.hasThumbnail).length,
        validUrls: thumbnailCheck.filter(c => c.isValidUrl).length
      },
      contents: thumbnailCheck,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Thumbnail check error:', error)
    return res.status(500).json({
      error: 'Failed to check thumbnails',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

export default withCors(handler)
