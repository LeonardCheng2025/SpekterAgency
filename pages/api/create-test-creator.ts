import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 創建測試創作者
    const creator = await prisma.creator.upsert({
      where: { email: 'test@example.com' },
      create: {
        name: 'Test Creator',
        email: 'test@example.com',
        region: 'Thailand',
        tier: 'Normal'
      },
      update: {
        name: 'Test Creator',
        region: 'Thailand',
        tier: 'Normal'
      }
    })

    res.status(200).json({
      success: true,
      creator,
      message: 'Test creator created/updated successfully',
      youtubeOAuthUrl: `/api/connect/youtube?creatorId=${creator.id}`,
      twitchOAuthUrl: `/api/connect/twitch?creatorId=${creator.id}`
    })
  } catch (error) {
    console.error('Error creating test creator:', error)
    res.status(500).json({
      error: 'Failed to create test creator',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
