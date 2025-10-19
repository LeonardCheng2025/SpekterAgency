import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { createOrUpdateUser, generateToken, setAuthCookie } from '../../../../lib/auth'
import { encrypt } from '../../../../lib/encryption'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, state, error: oauthError } = req.query

    if (oauthError) {
      return res.redirect(`/login?error=twitch_${oauthError}`)
    }

    if (!code || typeof code !== 'string') {
      return res.redirect('/login?error=twitch_no_code')
    }
    
    // 交換 code 獲取 access token
    const tokenRequest = {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.TWITCH_REDIRECT_URI
    }
    
    const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', tokenRequest)

    const { access_token, refresh_token } = tokenResponse.data

    
    // 獲取用戶信息
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID!
      }
    })


    const twitchUser = userResponse.data.data[0]
    if (!twitchUser) {
      throw new Error('No Twitch user found')
    }
    
    // 創建或更新用戶
    const userData = {
      platform: 'TWITCH' as const,
      platformId: twitchUser.id,
      username: twitchUser.display_name,
      name: twitchUser.display_name,
      email: twitchUser.email,
      avatar: twitchUser.profile_image_url,
      accessToken: encrypt(access_token),
      refreshToken: refresh_token ? encrypt(refresh_token) : undefined,
      tokenExpiry: undefined // Twitch tokens don't have expiry in response
    }
    
    const user = await createOrUpdateUser(userData)

    // 生成 JWT token 並設置 cookie
    const authToken = generateToken(user.id)
    setAuthCookie(res, authToken)

    // 重定向到前端 dashboard，帶上 token
    const frontendUrl = process.env.FRONTEND_URL || 'https://ragnarok-libre.clutch-hub.xyz'
    res.redirect(`${frontendUrl}/dashboard?login=success&platform=twitch&token=${encodeURIComponent(authToken)}`)
  } catch (error) {
    console.error('❌ Twitch OAuth callback error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      response: error instanceof Error && 'response' in error ? (error as any).response?.data : undefined
    })
    const frontendUrl = process.env.FRONTEND_URL || 'https://ragnarok-libre.clutch-hub.xyz'
    res.redirect(`${frontendUrl}/login?error=twitch_login_failed`)
  }
}
