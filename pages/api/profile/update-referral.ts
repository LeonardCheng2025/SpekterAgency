import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { prisma } from '../../../lib/db'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {

    const user = await getCurrentUser(req)
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { referralLink, uidHEX } = req.body

    // Validate input
    if (referralLink && typeof referralLink !== 'string') {
      return res.status(400).json({ error: 'Invalid referral link format' })
    }

    if (uidHEX && typeof uidHEX !== 'string') {
      return res.status(400).json({ error: 'Invalid UID HEX format' })
    }

    // Validate referral link format if provided
    if (referralLink) {
      const pattern = /^https:\/\/liff\.line\.me\/\d+-\w+\?startapp=U_[A-Fa-f0-9]+$/
      if (!pattern.test(referralLink)) {
        return res.status(400).json({ error: 'Invalid referral link format' })
      }

      // Extract UID HEX from referral link and verify it matches
      const match = referralLink.match(/startapp=U_([A-Fa-f0-9]+)/)
      const extractedUidHEX = match ? match[1] : null
      
      if (!extractedUidHEX || extractedUidHEX !== uidHEX) {
        return res.status(400).json({ error: 'UID HEX does not match referral link' })
      }
    }

    // Update creator record
    const updatedCreator = await prisma.creator.update({
      where: { id: user.id },
      data: {
        referralLink: referralLink || null,
        uidHEX: uidHEX || null,
        // Reset referral data if removing the link
        ...((!referralLink || !uidHEX) && {
          referralCount: 0,
          purchaseAmountTotal: 0,
          lastReferralSync: null
        }),
        updatedAt: new Date()
      }
    })

    res.status(200).json({
      success: true,
      message: referralLink ? 'Referral link updated successfully' : 'Referral link removed successfully',
      data: {
        referralLink: updatedCreator.referralLink,
        uidHEX: updatedCreator.uidHEX,
        referralCount: updatedCreator.referralCount,
        purchaseAmountTotal: updatedCreator.purchaseAmountTotal
      }
    })

  } catch (error) {
    console.error('Update referral link error:', error)
    res.status(500).json({ 
      error: 'Failed to update referral link',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
