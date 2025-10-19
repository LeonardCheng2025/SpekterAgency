import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { withCors } from '@/lib/cors'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get query parameters for filtering
    const { region, platform } = req.query


    // Map frontend platform names to Prisma enum values
    const platformMap: { [key: string]: string } = {
      'YouTube': 'YOUTUBE',
      'Twitch': 'TWITCH',
      'Facebook': 'FACEBOOK'
    }

    // Convert platform name to enum value
    const platformEnum = platform && platform !== 'All' ? platformMap[platform as string] : null

    // Fetch creators with their platform connections
    const creators = await prisma.creator.findMany({
      where: {
        // Filter by region if specified
        ...(region && region !== 'All' ? { region: region as string } : {}),
        // Filter by platform if specified
        ...(platformEnum ? {
          platforms: {
            some: {
              platform: platformEnum as any,
              isActive: true
            }
          }
        } : {})
      },
      include: {
        platforms: {
          where: {
            isActive: true
          },
          select: {
            platform: true,
            username: true
          }
        }
      },
      orderBy: {
        leaderboardScore: 'desc'
      }
    })

    // Transform data to match frontend expectations
    const transformedCreators = creators.map(creator => ({
      id: creator.id,
      name: creator.name,
      platforms: creator.platforms.map(p => p.platform),
      contentPoints: creator.contentPoints,
      referralPoints: creator.referralPoints,
      iapSpending: 0, // This would come from referral system
      onchainSpending: 0, // This would come from referral system
      newPlayers: creator.referralCount, // Use referralCount as newPlayers
      totalPoints: creator.totalPoints,
      tier: creator.tier,
      isLive: creator.isLive,
      avatar: creator.avatar || '/Creator/default.png',
      region: creator.region || 'Pending',
      // Add missing referral fields for CurrentUserRank component
      referralCount: creator.referralCount,
      purchaseAmountTotal: creator.purchaseAmountTotal,
      leaderboardScore: creator.leaderboardScore
    }))


    res.status(200).json({
      success: true,
      creators: transformedCreators
    })

  } catch (error) {
    console.error('Error fetching creators:', error)
    res.status(500).json({ 
      error: 'Failed to fetch creators',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  } finally {
    await prisma.$disconnect()
  }
}

export default withCors(handler)
