import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { prisma } from '../../../lib/db'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    const { q } = req.query
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' })
    }

    // 搜索創作者 (按 ID 或 name)
    const creators = await prisma.creator.findMany({
      where: {
        OR: [
          {
            id: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            name: {
              contains: q,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        region: true,
        tier: true,
        isSuperAdmin: true,
        totalPoints: true,
        contentPoints: true,
        referralPoints: true,
        referralLink: true,
        uidHEX: true,
        referralCount: true,
        purchaseAmountTotal: true,
        lastReferralSync: true,
        createdAt: true,
        platforms: {
          where: { isActive: true },
          select: {
            platform: true,
            username: true,
            platformId: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: 20 // 限制結果數量
    })

    res.status(200).json({
      success: true,
      creators: creators.map(creator => ({
        ...creator,
        platforms: creator.platforms.map(p => ({
          platform: p.platform,
          username: p.username,
          platformId: p.platformId
        }))
      }))
    })

  } catch (error) {
    console.error('Search creators error:', error)
    res.status(500).json({ 
      error: 'Failed to search creators',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
