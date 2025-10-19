import { NextApiRequest, NextApiResponse } from 'next'
import { TwitchService } from '../../../lib/api/twitch'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { videoId, accessToken } = req.query

  if (!videoId || !accessToken) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      required: ['videoId', 'accessToken']
    })
  }

  try {
    const twitchService = new TwitchService()
    
    console.log('🔍 Testing Twitch API with:', {
      videoId: videoId as string,
      hasAccessToken: !!accessToken
    })

    const videoInfo = await twitchService.getVideoInfo(videoId as string, accessToken as string)
    
    if (!videoInfo) {
      return res.status(404).json({
        error: 'Video not found or access denied',
        videoId,
        timestamp: new Date().toISOString()
      })
    }

    const parsedDuration = twitchService.parseDuration(videoInfo.duration)

    return res.status(200).json({
      message: 'Successfully fetched Twitch video info',
      videoInfo: {
        ...videoInfo,
        parsedDuration,
        thumbnail_processed: videoInfo.thumbnail_url?.replace('%{width}', '1280').replace('%{height}', '720')
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Twitch API test error:', error)
    
    let errorMessage = 'Unknown error'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      if (error.message.includes('401')) {
        statusCode = 401
        errorMessage = 'Invalid or expired access token'
      } else if (error.message.includes('400')) {
        statusCode = 400
        errorMessage = 'Invalid video ID or request'
      }
    }

    return res.status(statusCode).json({
      error: 'Failed to fetch video info from Twitch API',
      details: errorMessage,
      videoId,
      timestamp: new Date().toISOString()
    })
  }
}

export default withCors(handler)
