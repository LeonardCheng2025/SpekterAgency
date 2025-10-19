import cron from 'node-cron'
import { prisma } from './db'
import { YouTubeService } from './api/youtube'
import { FacebookService } from './api/facebook'
import { TwitchService } from './api/twitch'

export class SyncService {
  private youtubeService: YouTubeService
  private facebookService: FacebookService
  private twitchService: TwitchService

  constructor() {
    this.youtubeService = new YouTubeService()
    this.facebookService = new FacebookService()
    this.twitchService = new TwitchService()
  }

  // 啟動定時同步
  startScheduledSync() {
    // 每小時同步一次
    const interval = process.env.SYNC_INTERVAL_MINUTES || '60'
    cron.schedule(`*/${interval} * * * *`, async () => {
      await this.syncAllCreators()
    })
  }

  // 同步所有創作者的數據
  async syncAllCreators() {
    try {
      const connections = await prisma.platformConnection.findMany({
        where: { isActive: true },
        include: { creator: true }
      })


      // 分批處理，避免 API 限制
      const batchSize = parseInt(process.env.BATCH_SIZE || '10')
      
      for (let i = 0; i < connections.length; i += batchSize) {
        const batch = connections.slice(i, i + batchSize)
        
        await Promise.allSettled(
          batch.map(connection => this.syncPlatformConnection(connection))
        )

        // 批次間暫停，避免 API 限制
        if (i + batchSize < connections.length) {
          await this.sleep(2000) // 2 seconds
        }
      }

    } catch (error) {
      console.error('Error in scheduled sync:', error)
    }
  }

  // 同步單個平台連接
  async syncPlatformConnection(connection: any) {
    try {

      switch (connection.platform) {
        case 'YOUTUBE':
          await this.youtubeService.syncChannelData(connection.id)
          break
        case 'FACEBOOK':
          await this.facebookService.syncPageData(connection.id)
          break
        case 'TWITCH':
          await this.twitchService.syncChannelData(connection.id)
          break
      }

      // 計算並更新創作者分數
      await this.calculateCreatorScores(connection.creatorId)
      
    } catch (error) {
      console.error(`Error syncing ${connection.platform} for creator ${connection.creator.name}:`, error)
    }
  }

  // 計算創作者分數
  async calculateCreatorScores(creatorId: string) {
    try {
      // 獲取最近 30 天的內容指標
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const recentMetrics = await prisma.contentMetrics.findMany({
        where: {
          content: {
            creatorId,
            publishedAt: {
              gte: thirtyDaysAgo
            }
          }
        },
        include: {
          content: true
        }
      })

      // 計算內容分數 (基於觀看數、互動率等)
      let contentScore = 0
      let totalViews = 0
      let totalEngagement = 0

      recentMetrics.forEach(metric => {
        totalViews += metric.views
        totalEngagement += metric.likes + metric.comments + metric.shares
        
        // 基於平台調整權重
        const platformMultiplier = this.getPlatformMultiplier(metric.content.platform)
        contentScore += (metric.views * 0.1 + totalEngagement * 0.5) * platformMultiplier
      })

      // 計算互動率分數
      const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0
      const engagementScore = Math.min(engagementRate * 10, 100) // 最高 100 分

      // 計算成長分數 (比較最近 15 天 vs 前 15 天)
      const growthScore = await this.calculateGrowthScore(creatorId)

      // 計算品質分數 (基於內容驗證狀態、完整度等)
      const qualityScore = await this.calculateQualityScore(creatorId)

      // 更新創作者總分
      const totalPoints = Math.round(contentScore + engagementScore + growthScore + qualityScore)
      
      await prisma.creator.update({
        where: { id: creatorId },
        data: {
          totalPoints,
          contentPoints: Math.round(contentScore),
          // referralPoints 從其他地方計算
        }
      })

      // 保存詳細指標記錄
      await prisma.creatorMetrics.create({
        data: {
          creatorId,
          platform: 'YOUTUBE', // 或根據主要平台
          subscriberCount: 0, // 需要從平台 API 獲取
          totalViews,
          totalVideos: recentMetrics.length,
          contentScore,
          engagementScore,
          growthScore,
          qualityScore,
          periodStart: thirtyDaysAgo,
          periodEnd: new Date()
        }
      })

    } catch (error) {
      console.error('Error calculating creator scores:', error)
    }
  }

  // 獲取平台權重係數
  private getPlatformMultiplier(platform: string): number {
    switch (platform) {
      case 'YOUTUBE': return 1.0
      case 'TWITCH': return 0.8
      case 'FACEBOOK': return 0.6
      default: return 0.5
    }
  }

  // 計算成長分數
  private async calculateGrowthScore(creatorId: string): Promise<number> {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // 獲取最近 15 天和前 15 天的數據
    const [recentMetrics, previousMetrics] = await Promise.all([
      prisma.contentMetrics.findMany({
        where: {
          content: {
            creatorId,
            publishedAt: { gte: fifteenDaysAgo }
          }
        }
      }),
      prisma.contentMetrics.findMany({
        where: {
          content: {
            creatorId,
            publishedAt: { 
              gte: thirtyDaysAgo,
              lt: fifteenDaysAgo
            }
          }
        }
      })
    ])

    const recentTotal = recentMetrics.reduce((sum, m) => sum + m.views, 0)
    const previousTotal = previousMetrics.reduce((sum, m) => sum + m.views, 0)

    if (previousTotal === 0) return 0

    const growthRate = ((recentTotal - previousTotal) / previousTotal) * 100
    return Math.max(0, Math.min(growthRate, 100)) // 0-100 分
  }

  // 計算品質分數
  private async calculateQualityScore(creatorId: string): Promise<number> {
    const contents = await prisma.content.findMany({
      where: {
        creatorId,
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    if (contents.length === 0) return 0

    // 計算驗證通過率
    const approvedCount = contents.filter(c => c.validationStatus === 'APPROVED').length
    const approvalRate = (approvedCount / contents.length) * 100

    // 計算內容完整度 (有描述、標籤等)
    const completeCount = contents.filter(c => 
      c.description && c.description.length > 50 && c.tags.length > 0
    ).length
    const completenessRate = (completeCount / contents.length) * 100

    return (approvalRate * 0.7 + completenessRate * 0.3)
  }

  // 輔助函數：暫停執行
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 手動觸發單個創作者同步
  async syncCreator(creatorId: string) {
    const connections = await prisma.platformConnection.findMany({
      where: { 
        creatorId,
        isActive: true 
      },
      include: { creator: true }
    })

    for (const connection of connections) {
      await this.syncPlatformConnection(connection)
    }

  }
}
