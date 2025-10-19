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

    const { id } = req.query
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Creator ID is required' })
    }

    // 獲取創作者完整資料
    const creator = await prisma.creator.findUnique({
      where: { id },
      include: {
        platforms: {
          where: { isActive: true },
          select: {
            platform: true,
            username: true,
            platformId: true
          }
        },
        contents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            platform: true,
            createdAt: true,
            validationStatus: true
          }
        }
      }
    })

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' })
    }

    res.status(200).json({
      success: true,
      creator: {
        id: creator.id,
        name: creator.name,
        email: creator.email,
        avatar: creator.avatar,
        region: creator.region,
        tier: creator.tier,
        isSuperAdmin: creator.isSuperAdmin,
        totalPoints: creator.totalPoints,
        contentPoints: creator.contentPoints,
        referralPoints: creator.referralPoints,
        referralLink: creator.referralLink,
        uidHEX: creator.uidHEX,
        referralCount: creator.referralCount,
        purchaseAmountTotal: creator.purchaseAmountTotal,
        lastReferralSync: creator.lastReferralSync,
        createdAt: creator.createdAt,
        platforms: creator.platforms,
        recentContents: creator.contents
      }
    })

  } catch (error) {
    console.error('Get creator error:', error)
    res.status(500).json({ 
      error: 'Failed to get creator',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
