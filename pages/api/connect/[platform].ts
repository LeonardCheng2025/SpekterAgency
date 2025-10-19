import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { platform } = req.query

    if (typeof platform !== 'string') {
      return res.status(400).json({ error: 'Invalid platform' })
    }

    let authUrl = ''
    const baseUrl = process.env.RAILWAY_PUBLIC_URL || 'https://ragnaroklibre-clutch-production.up.railway.app'

    switch (platform.toLowerCase()) {
      case 'youtube':
        // YouTube OAuth URL
        const youtubeClientId = process.env.YOUTUBE_CLIENT_ID
        const youtubeRedirectUri = encodeURIComponent(`${baseUrl}/api/auth/youtube/callback`)
        const youtubeScope = encodeURIComponent('https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly')
        
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${youtubeClientId}&` +
          `redirect_uri=${youtubeRedirectUri}&` +
          `response_type=code&` +
          `scope=${youtubeScope}&` +
          `access_type=offline&` +
          `prompt=consent&` +
          `state=login`
        break

      case 'twitch':
        // Twitch OAuth URL
        const twitchClientId = process.env.TWITCH_CLIENT_ID
        const twitchRedirectUri = encodeURIComponent(`${baseUrl}/api/auth/twitch/callback`)
        const twitchScope = encodeURIComponent('user:read:email channel:read:subscriptions')
        
        authUrl = `https://id.twitch.tv/oauth2/authorize?` +
          `client_id=${twitchClientId}&` +
          `redirect_uri=${twitchRedirectUri}&` +
          `response_type=code&` +
          `scope=${twitchScope}&` +
          `state=login`
        break

      case 'facebook':
        return res.status(501).json({ error: 'Facebook OAuth not implemented yet' })

      default:
        return res.status(400).json({ error: 'Unsupported platform' })
    }

    
    // 重定向到 OAuth 提供者
    res.redirect(authUrl)
  } catch (error) {
    console.error('OAuth connection error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
