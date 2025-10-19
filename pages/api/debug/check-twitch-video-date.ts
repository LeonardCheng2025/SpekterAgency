import { NextApiRequest, NextApiResponse } from 'next'
import { withCors } from '../../../lib/cors'
import { TwitchService } from '../../../lib/api/twitch'
import { prisma } from '../../../lib/db'
import { decrypt } from '../../../lib/encryption'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 獲取現有的 content 記錄
    const content = await prisma.content.findFirst({
      where: {
        platform: 'TWITCH',
        contentType: 'VIDEO'
      }
    })

    if (!content) {
      return res.status(404).json({ error: 'No Twitch video content found' })
    }

    // 獲取創建者的 Twitch access token
    const creator = await prisma.creator.findUnique({
      where: { id: content.creatorId },
      include: {
        platforms: {
          where: { platform: 'TWITCH' }
        }
      }
    })

    if (!creator?.platforms[0]) {
      return res.status(404).json({ error: 'No Twitch connection found for creator' })
    }

    const encryptedToken = creator.platforms[0].accessToken
    if (!encryptedToken) {
      return res.status(404).json({ error: 'No access token found for Twitch connection' })
    }
    const accessToken = decrypt(encryptedToken)

    // 使用 Twitch API 獲取影片信息
    const twitchService = new TwitchService()
    const videoInfo = await twitchService.getVideoInfo(content.platformVideoId, accessToken)

    return res.status(200).json({
      message: 'Video date comparison',
      content: {
        id: content.id,
        title: content.title,
        platformVideoId: content.platformVideoId,
        publishedAt_db: content.publishedAt,
        createdAt_db: content.createdAt
      },
      twitchApi: videoInfo ? {
        title: videoInfo.title,
        created_at: videoInfo.created_at,
        created_at_parsed: new Date(videoInfo.created_at)
      } : null,
      comparison: videoInfo ? {
        db_date: content.publishedAt.toISOString(),
        api_date: new Date(videoInfo.created_at).toISOString(),
        dates_match: content.publishedAt.toISOString() === new Date(videoInfo.created_at).toISOString()
      } : null
    })
  } catch (error) {
    console.error('Error checking video date:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
