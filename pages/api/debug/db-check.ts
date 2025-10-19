import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 檢查數據庫連接
    const creators = await prisma.creator.findMany({
      include: {
        platforms: {
          select: {
            platform: true,
            username: true,
            platformId: true,
            isActive: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    const platformConnections = await prisma.platformConnection.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        platform: true,
        username: true,
        platformId: true,
        isActive: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return res.status(200).json({
      message: 'Database check successful',
      data: {
        creators: {
          count: creators.length,
          items: creators
        },
        platformConnections: {
          count: platformConnections.length,
          items: platformConnections
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database check error:', error)
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

export default withCors(handler)
