import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const clientId = process.env.TWITCH_CLIENT_ID
    const clientSecret = process.env.TWITCH_CLIENT_SECRET
    
    if (!clientId) {
      return res.status(500).json({ error: 'Twitch Client ID not configured' })
    }

    if (!clientSecret) {
      return res.status(500).json({ 
        error: 'Twitch Client Secret not configured',
        message: 'Please add TWITCH_CLIENT_SECRET to your environment variables'
      })
    }

    // 獲取應用程式訪問令牌
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const accessToken = tokenResponse.data.access_token

    // 測試 API 調用 - 獲取熱門遊戲
    const gamesResponse = await axios.get('https://api.twitch.tv/helix/games/top', {
      params: {
        first: 5
      },
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const games = gamesResponse.data.data

    res.status(200).json({
      success: true,
      message: 'Twitch API connection successful',
      testData: {
        topGames: games.map((game: any) => ({
          name: game.name,
          id: game.id
        }))
      },
      clientId: `${clientId.substring(0, 8)}...${clientId.substring(clientId.length - 4)}`,
      tokenGenerated: true
    })
  } catch (error) {
    console.error('Twitch API test error:', error)
    
    if (axios.isAxiosError(error)) {
      return res.status(500).json({
        error: 'Twitch API request failed',
        details: error.response?.data || error.message,
        status: error.response?.status
      })
    }

    res.status(500).json({
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
