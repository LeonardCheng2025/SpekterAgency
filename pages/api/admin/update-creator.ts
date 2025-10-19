import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { prisma } from '../../../lib/db'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
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

    const { 
      id, 
      name, 
      email, 
      region, 
      tier, 
      referralLink, 
      uidHEX, 
      referralCount, 
      purchaseAmountTotal 
    } = req.body
    
    if (!id) {
      return res.status(400).json({ error: 'Creator ID is required' })
    }

    // 驗證 referral link 格式 (如果提供)
    if (referralLink) {
      const pattern = /^https:\/\/liff\.line\.me\/\d+-\w+\?startapp=U_[A-Fa-f0-9]+$/
      if (!pattern.test(referralLink)) {
        return res.status(400).json({ error: 'Invalid referral link format' })
      }

      // 驗證 UID HEX 匹配
      const match = referralLink.match(/startapp=U_([A-Fa-f0-9]+)/)
      const extractedUidHEX = match ? match[1] : null
      
      if (!extractedUidHEX || extractedUidHEX !== uidHEX) {
        return res.status(400).json({ error: 'UID HEX does not match referral link' })
      }
    }

    // 更新創作者資料
    const updatedCreator = await prisma.creator.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email: email || null }),
        ...(region && { region }),
        ...(tier && { tier }),
        ...(referralLink !== undefined && { referralLink: referralLink || null }),
        ...(uidHEX !== undefined && { uidHEX: uidHEX || null }),
        ...(referralCount !== undefined && { referralCount: parseInt(referralCount) || 0 }),
        ...(purchaseAmountTotal !== undefined && { purchaseAmountTotal: parseFloat(purchaseAmountTotal) || 0.0 }),
        updatedAt: new Date()
      },
      include: {
        platforms: {
          where: { isActive: true },
          select: {
            platform: true,
            username: true,
            platformId: true
          }
        }
      }
    })

    res.status(200).json({
      success: true,
      message: 'Creator updated successfully',
      creator: {
        id: updatedCreator.id,
        name: updatedCreator.name,
        email: updatedCreator.email,
        avatar: updatedCreator.avatar,
        region: updatedCreator.region,
        tier: updatedCreator.tier,
        isSuperAdmin: updatedCreator.isSuperAdmin,
        totalPoints: updatedCreator.totalPoints,
        contentPoints: updatedCreator.contentPoints,
        referralPoints: updatedCreator.referralPoints,
        referralLink: updatedCreator.referralLink,
        uidHEX: updatedCreator.uidHEX,
        referralCount: updatedCreator.referralCount,
        purchaseAmountTotal: updatedCreator.purchaseAmountTotal,
        lastReferralSync: updatedCreator.lastReferralSync,
        platforms: updatedCreator.platforms
      }
    })

  } catch (error) {
    console.error('Update creator error:', error)
    res.status(500).json({ 
      error: 'Failed to update creator',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
