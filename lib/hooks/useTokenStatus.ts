import { useState, useEffect } from 'react'

interface TokenStatus {
  platform: string
  username: string
  isExpiring: boolean
  isExpired: boolean
  needsRefresh: boolean
  refreshSuccess: boolean
  refreshError: string | null
  tokenExpiry: string | null
  lastSync: string | null
}

interface TokenCheckResponse {
  success: boolean
  tokenStatus: TokenStatus[]
  hasTokenIssues: boolean
  failedRefreshes: Array<{
    platform: string
    username: string
    error: string
  }>
  message: string
}

export function useTokenStatus() {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus[]>([])
  const [hasTokenIssues, setHasTokenIssues] = useState(false)
  const [failedRefreshes, setFailedRefreshes] = useState<Array<{platform: string, username: string, error: string}>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkTokenStatus = async () => {
    try {
      setLoading(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/auth/check-tokens`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to check token status')
      }

      const data: TokenCheckResponse = await response.json()
      
      setTokenStatus(data.tokenStatus)
      setHasTokenIssues(data.hasTokenIssues)
      setFailedRefreshes(data.failedRefreshes)
      setError(null)

      // 如果有 token 問題，在控制台顯示警告
      if (data.hasTokenIssues) {
        console.warn('⚠️ Token issues detected:', data.failedRefreshes)
      }

    } catch (err) {
      console.error('Error checking token status:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkTokenStatus()
  }, [])

  return {
    tokenStatus,
    hasTokenIssues,
    failedRefreshes,
    loading,
    error,
    checkTokenStatus
  }
}
