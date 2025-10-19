import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 檢查數據庫連接
    await prisma.$queryRaw`SELECT 1`
    
    // 獲取基本統計
    const [creatorsCount, connectionsCount, contentsCount] = await Promise.all([
      prisma.creator.count(),
      prisma.platformConnection.count(),
      prisma.content.count()
    ])

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      railway: {
        projectName: process.env.RAILWAY_PROJECT_NAME,
        publicUrl: process.env.RAILWAY_PUBLIC_URL
      },
      statistics: {
        creators: creatorsCount,
        platformConnections: connectionsCount,
        contents: contentsCount
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
