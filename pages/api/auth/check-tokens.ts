import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/auth'
import { withCors } from '../../../lib/cors'
import { TokenRefreshService } from '../../../lib/token-refresh'
import { prisma } from '../../../lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await getCurrentUser(req)
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // 獲取用戶的所有平台連接
    const platformConnections = await prisma.platformConnection.findMany({
      where: {
        creatorId: user.id,
        isActive: true
      }
    })

    const tokenStatus = []

    // 檢查每個平台連接的 token 狀態
    for (const connection of platformConnections) {
      const isExpiring = TokenRefreshService.isTokenExpiringSoon(connection.tokenExpiry)
      const isExpired = TokenRefreshService.isTokenExpired(connection.tokenExpiry)
      
      let refreshResult = null
      let needsRefresh = false

      // 如果 token 即將過期或已過期，嘗試刷新
      if (isExpiring || isExpired) {
        needsRefresh = true
        console.log(`🔄 Checking token for ${connection.platform} connection ${connection.id}`)
        
        try {
          refreshResult = await TokenRefreshService.checkAndRefreshTokenIfNeeded(connection.id)
        } catch (error) {
          console.error(`❌ Failed to refresh token for ${connection.platform}:`, error)
        }
      }

      tokenStatus.push({
        platform: connection.platform,
        username: connection.username,
        isExpiring,
        isExpired,
        needsRefresh,
        refreshSuccess: refreshResult?.success || false,
        refreshError: refreshResult?.error || null,
        tokenExpiry: connection.tokenExpiry,
        lastSync: connection.lastSync
      })
    }

    // 檢查是否有任何失敗的刷新
    const failedRefreshes = tokenStatus.filter(status => status.needsRefresh && !status.refreshSuccess)
    const hasTokenIssues = failedRefreshes.length > 0

    res.status(200).json({
      success: true,
      tokenStatus,
      hasTokenIssues,
      failedRefreshes: failedRefreshes.map(status => ({
        platform: status.platform,
        username: status.username,
        error: status.refreshError
      })),
      message: hasTokenIssues 
        ? 'Some platform tokens could not be refreshed. You may need to reconnect these platforms.'
        : 'All platform tokens are valid or have been successfully refreshed.'
    })

  } catch (error) {
    console.error('Token check error:', error)
    res.status(500).json({ 
      error: 'Failed to check token status',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export default withCors(handler)
