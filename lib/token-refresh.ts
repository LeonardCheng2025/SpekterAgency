import axios from 'axios'
import { google } from 'googleapis'
import { prisma } from './db'
import { encrypt, decrypt } from './encryption'

export interface TokenRefreshResult {
  success: boolean
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: Date
  error?: string
}

export class TokenRefreshService {
  
  /**
   * 檢查 token 是否即將過期 (在 5 分鐘內過期)
   */
  static isTokenExpiringSoon(tokenExpiry: Date | null): boolean {
    if (!tokenExpiry) return false
    
    const now = new Date()
    const expiryTime = new Date(tokenExpiry)
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000) // 5分鐘後
    
    return expiryTime <= fiveMinutesFromNow
  }

  /**
   * 檢查 token 是否已過期
   */
  static isTokenExpired(tokenExpiry: Date | null): boolean {
    if (!tokenExpiry) return false
    
    const now = new Date()
    const expiryTime = new Date(tokenExpiry)
    
    return expiryTime <= now
  }

  /**
   * 刷新 YouTube access token
   */
  static async refreshYouTubeToken(platformConnectionId: string): Promise<TokenRefreshResult> {
    try {
      const connection = await prisma.platformConnection.findUnique({
        where: { id: platformConnectionId }
      })

      if (!connection || !connection.refreshToken) {
        return {
          success: false,
          error: 'No platform connection or refresh token found'
        }
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      )

      // 設置現有的 refresh token
      oauth2Client.setCredentials({
        refresh_token: decrypt(connection.refreshToken)
      })

      // 刷新 access token
      const { credentials } = await oauth2Client.refreshAccessToken()

      if (!credentials.access_token) {
        return {
          success: false,
          error: 'Failed to refresh YouTube access token'
        }
      }

      // 更新資料庫中的 token 資訊
      await prisma.platformConnection.update({
        where: { id: platformConnectionId },
        data: {
          accessToken: encrypt(credentials.access_token),
          refreshToken: credentials.refresh_token ? encrypt(credentials.refresh_token) : connection.refreshToken,
          tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
          lastSync: new Date()
        }
      })

      console.log(`✅ YouTube token refreshed for connection ${platformConnectionId}`)

      return {
        success: true,
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token || decrypt(connection.refreshToken),
        tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined
      }

    } catch (error) {
      console.error('❌ Error refreshing YouTube token:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 刷新 Twitch access token
   */
  static async refreshTwitchToken(platformConnectionId: string): Promise<TokenRefreshResult> {
    try {
      const connection = await prisma.platformConnection.findUnique({
        where: { id: platformConnectionId }
      })

      if (!connection || !connection.refreshToken) {
        return {
          success: false,
          error: 'No platform connection or refresh token found'
        }
      }

      // 使用 refresh token 獲取新的 access token
      const response = await axios.post('https://id.twitch.tv/oauth2/token', {
        grant_type: 'refresh_token',
        refresh_token: decrypt(connection.refreshToken),
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET
      })

      const { access_token, refresh_token, expires_in } = response.data

      if (!access_token) {
        return {
          success: false,
          error: 'Failed to refresh Twitch access token'
        }
      }

      // 計算過期時間
      const tokenExpiry = new Date(Date.now() + expires_in * 1000)

      // 更新資料庫中的 token 資訊
      await prisma.platformConnection.update({
        where: { id: platformConnectionId },
        data: {
          accessToken: encrypt(access_token),
          refreshToken: refresh_token ? encrypt(refresh_token) : connection.refreshToken,
          tokenExpiry: tokenExpiry,
          lastSync: new Date()
        }
      })

      console.log(`✅ Twitch token refreshed for connection ${platformConnectionId}`)

      return {
        success: true,
        accessToken: access_token,
        refreshToken: refresh_token || decrypt(connection.refreshToken),
        tokenExpiry: tokenExpiry
      }

    } catch (error) {
      console.error('❌ Error refreshing Twitch token:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 根據平台類型自動刷新 token
   */
  static async refreshPlatformToken(platformConnectionId: string, platform: 'YOUTUBE' | 'TWITCH'): Promise<TokenRefreshResult> {
    switch (platform) {
      case 'YOUTUBE':
        return this.refreshYouTubeToken(platformConnectionId)
      case 'TWITCH':
        return this.refreshTwitchToken(platformConnectionId)
      default:
        return {
          success: false,
          error: `Unsupported platform: ${platform}`
        }
    }
  }

  /**
   * 檢查並刷新即將過期的 token
   */
  static async checkAndRefreshTokenIfNeeded(platformConnectionId: string): Promise<TokenRefreshResult> {
    try {
      const connection = await prisma.platformConnection.findUnique({
        where: { id: platformConnectionId }
      })

      if (!connection) {
        return {
          success: false,
          error: 'Platform connection not found'
        }
      }

      // 檢查 token 是否需要刷新
      if (this.isTokenExpiringSoon(connection.tokenExpiry) || this.isTokenExpired(connection.tokenExpiry)) {
        console.log(`🔄 Token expiring soon for ${connection.platform} connection ${platformConnectionId}, refreshing...`)
        return this.refreshPlatformToken(platformConnectionId, connection.platform as 'YOUTUBE' | 'TWITCH')
      }

      // Token 仍然有效
      return {
        success: true,
        accessToken: connection.accessToken ? decrypt(connection.accessToken) : undefined
      }

    } catch (error) {
      console.error('❌ Error checking token expiry:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 獲取有效的 access token（如果需要會自動刷新）
   */
  static async getValidAccessToken(platformConnectionId: string): Promise<string | null> {
    const result = await this.checkAndRefreshTokenIfNeeded(platformConnectionId)
    
    if (result.success && result.accessToken) {
      return result.accessToken
    }

    console.error(`❌ Failed to get valid access token for connection ${platformConnectionId}:`, result.error)
    return null
  }

  /**
   * 處理 API 調用失敗時的 token 刷新重試機制
   */
  static async handleApiCallWithTokenRefresh<T>(
    platformConnectionId: string,
    apiCall: (accessToken: string) => Promise<T>,
    maxRetries: number = 1
  ): Promise<T | null> {
    let retries = 0

    while (retries <= maxRetries) {
      try {
        // 獲取有效的 access token
        const accessToken = await this.getValidAccessToken(platformConnectionId)
        
        if (!accessToken) {
          throw new Error('No valid access token available')
        }

        // 執行 API 調用
        return await apiCall(accessToken)

      } catch (error: any) {
        console.error(`❌ API call failed (attempt ${retries + 1}):`, error)

        // 檢查是否為 token 相關錯誤
        const isTokenError = this.isTokenRelatedError(error)
        
        if (isTokenError && retries < maxRetries) {
          console.log(`🔄 Token-related error detected, forcing token refresh...`)
          
          // 強制刷新 token
          const connection = await prisma.platformConnection.findUnique({
            where: { id: platformConnectionId }
          })

          if (connection) {
            const refreshResult = await this.refreshPlatformToken(
              platformConnectionId, 
              connection.platform as 'YOUTUBE' | 'TWITCH'
            )

            if (!refreshResult.success) {
              console.error(`❌ Failed to refresh token:`, refreshResult.error)
              break
            }
          }

          retries++
          continue
        }

        // 非 token 錯誤或已達最大重試次數
        throw error
      }
    }

    return null
  }

  /**
   * 判斷錯誤是否與 token 相關
   */
  private static isTokenRelatedError(error: any): boolean {
    if (!error) return false

    const errorMessage = error.message || error.toString()
    const errorStatus = error.response?.status || error.status

    // HTTP 401 Unauthorized
    if (errorStatus === 401) return true

    // 常見的 token 錯誤訊息
    const tokenErrorKeywords = [
      'unauthorized',
      'invalid_token',
      'token_expired',
      'expired_token',
      'invalid credentials',
      'authentication failed',
      'access denied'
    ]

    return tokenErrorKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword)
    )
  }
}
