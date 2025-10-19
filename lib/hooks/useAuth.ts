import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthUser } from '../auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // 先檢查 localStorage 中是否有 token
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      
      if (!token) {
        setUser(null)
        setError('No token found')
        return
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragnaroklibre-clutch-production.up.railway.app'
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        setError(null)
      } else {
        setUser(null)
        if (response.status === 401) {
          // 用戶未認證，清除本地 token
          localStorage.removeItem('auth_token')
          localStorage.removeItem('isLoggedIn')
          setError('Not authenticated')
        } else {
          setError(data.error || 'Authentication failed')
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      setUser(null)
      setError('Failed to check authentication')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragnaroklibre-clutch-production.up.railway.app'
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setUser(null)
        // 清除本地存儲
        localStorage.removeItem('auth_token')
        localStorage.removeItem('isLoggedIn')
        // 清除 sessionStorage 中的登入處理標記
        sessionStorage.removeItem('login_processed')
        // 重定向到 dashboard 並刷新頁面以更新認證狀態
        router.push('/dashboard').then(() => {
          window.location.reload()
        })
      } else {
        throw new Error('Logout failed')
      }
    } catch (err) {
      console.error('Logout failed:', err)
      throw err
    }
  }

  const isAuthenticated = !!user
  const isLoading = loading

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isLoading,
    checkAuth,
    logout
  }
}
