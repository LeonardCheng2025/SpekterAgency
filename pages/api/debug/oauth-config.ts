import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 獲取當前環境的配置
  const config = {
    environment: process.env.NODE_ENV,
    youtube: {
      clientId: process.env.YOUTUBE_CLIENT_ID,
      redirectUri: process.env.YOUTUBE_REDIRECT_URI,
      hasClientSecret: !!process.env.YOUTUBE_CLIENT_SECRET,
      hasApiKey: !!process.env.YOUTUBE_API_KEY
    },
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID,
      redirectUri: process.env.TWITCH_REDIRECT_URI,
      hasClientSecret: !!process.env.TWITCH_CLIENT_SECRET
    },
    urls: {
      railwayPublicUrl: process.env.RAILWAY_PUBLIC_URL,
      nextauthUrl: process.env.NEXTAUTH_URL
    },
    requestHeaders: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer
    }
  }

  res.status(200).json(config)
}
