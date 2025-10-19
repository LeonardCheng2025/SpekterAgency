import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { google } from 'googleapis'
import { createOrUpdateUser, generateToken, setAuthCookie } from '../../../../lib/auth'
import { encrypt } from '../../../../lib/encryption'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state, error: oauthError } = req.query
    if (oauthError) {
      return res.redirect(`/login?error=youtube_${oauthError}`)
    }

    if (!code || typeof code !== 'string') {
      return res.redirect('/login?error=youtube_no_code')
    }

    // 設置 OAuth2 客戶端
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    )

    // 直接向 Google OAuth 端點發送請求交換 tokens
    const tokenRequest = {
      code,
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', tokenRequest)

    const tokens = tokenResponse.data
    oauth2Client.setCredentials(tokens)

    // 獲取用戶的 YouTube 頻道信息
    const youtube = google.youtube('v3')
    const channelResponse = await youtube.channels.list({
      auth: oauth2Client,
      part: ['snippet', 'statistics'],
      mine: true
    })

    const channel = channelResponse.data.items?.[0]
    if (!channel) {
      throw new Error('No YouTube channel found')
    }
    
    // 創建或更新用戶
    const userData = {
      platform: 'YOUTUBE' as const,
      platformId: channel.id!,
      username: channel.snippet?.title || '',
      name: channel.snippet?.title || 'YouTube Creator',
      email: undefined, // YouTube API 不提供 email
      avatar: channel.snippet?.thumbnails?.high?.url || undefined,
      accessToken: encrypt(tokens.access_token!),
      refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
      tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
    }
    
    const user = await createOrUpdateUser(userData)

    // 生成 JWT token 並設置 cookie
    const authToken = generateToken(user.id)
    setAuthCookie(res, authToken)

    // 重定向到前端 dashboard，帶上 token
    const frontendUrl = process.env.FRONTEND_URL || 'https://ragnarok-libre.clutch-hub.xyz'
    res.redirect(`${frontendUrl}/dashboard?login=success&platform=youtube&token=${encodeURIComponent(authToken)}`)
  } catch (error) {
    console.error('❌ YouTube OAuth callback error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined
    })
    const frontendUrl = process.env.FRONTEND_URL || 'https://ragnarok-libre.clutch-hub.xyz'
    res.redirect(`${frontendUrl}/login?error=youtube_login_failed`)
  }
}
