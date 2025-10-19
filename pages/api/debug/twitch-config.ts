import { NextApiRequest, NextApiResponse } from 'next'
import { withCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const config = {
      TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID ? `✓ Set (${process.env.TWITCH_CLIENT_ID})` : '✗ Missing',
      TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET ? '✓ Set (hidden)' : '✗ Missing',
      TWITCH_REDIRECT_URI: process.env.TWITCH_REDIRECT_URI || '✗ Missing',
      RAILWAY_PUBLIC_URL: process.env.RAILWAY_PUBLIC_URL || '✗ Missing',
      FRONTEND_URL: process.env.FRONTEND_URL || '✗ Missing',
      NODE_ENV: process.env.NODE_ENV || 'development',
      // 生成正確的 Twitch OAuth URL
      generatedAuthUrl: ''
    }

    // 生成 Twitch OAuth URL
    if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_REDIRECT_URI) {
      const params = new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        redirect_uri: process.env.TWITCH_REDIRECT_URI,
        response_type: 'code',
        scope: 'user:read:email channel:read:subscriptions',
        state: 'login'
      })
      config.generatedAuthUrl = `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
    }

    // 檢查 Twitch API 可用性
    let twitchApiStatus = 'Unknown'
    try {
      const response = await fetch('https://api.twitch.tv/helix/', {
        method: 'GET',
        headers: {
          'Client-Id': process.env.TWITCH_CLIENT_ID || ''
        }
      })
      twitchApiStatus = response.status === 400 ? 'Available (400 expected without token)' : `Status: ${response.status}`
    } catch (error) {
      twitchApiStatus = 'Connection failed'
    }

    return res.status(200).json({
      message: 'Twitch OAuth Configuration Debug',
      config,
      twitchApiStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
