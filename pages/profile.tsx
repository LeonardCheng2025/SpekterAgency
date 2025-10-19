import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { AuthUser } from '../lib/auth'
import { useAuth } from '../lib/hooks/useAuth'
import { useTokenStatus } from '../lib/hooks/useTokenStatus'
import ContentSubmissionForm from '../components/ContentSubmissionForm'
import EmbeddedContent from '../components/EmbeddedContent'
import ReferralLinkManager from '../components/ReferralLinkManager'
import SuperAdminSearch from '../components/SuperAdminSearch'
import { ProfileSkeleton } from '../components/SkeletonLoader'

export default function Profile() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { hasTokenIssues, failedRefreshes, checkTokenStatus } = useTokenStatus()
  const [error, setError] = useState<string | null>(null)
  const [refreshContent, setRefreshContent] = useState(0)

  // Check authentication state
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleContentSubmitted = () => {
    // Trigger refresh of embedded content
    setRefreshContent(prev => prev + 1)
  }

  const handleReferralLinkUpdate = async (referralLink: string, uidHEX: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }


      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ragnaroklibre-clutch-production.up.railway.app'
      const response = await fetch(`${backendUrl}/api/profile/update-referral`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          referralLink: referralLink || null,
          uidHEX: uidHEX || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`)
      }

      if (data.success) {
        // Refresh user data
        window.location.reload()
      } else {
        throw new Error(data.error || 'Failed to update referral link')
      }
    } catch (error) {
      console.error('Error updating referral link:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    )
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">{error || 'Unable to load user data'}</p>
            <button
              onClick={() => router.push('/login')}
              className="samsung-btn-primary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Super Admin Search */}
            {user?.isSuperAdmin && (
              <SuperAdminSearch />
            )}

            {/* User Basic Information */}
            <div className="samsung-card p-6 mb-8">
              <div className="flex items-center space-x-6">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    className="w-20 h-20 rounded-full border-2 border-delabs-red"
                  />
                ) : (
                  <div className="w-20 h-20 bg-delabs-surface rounded-full flex items-center justify-center border-2 border-delabs-red">
                    <span className="text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                  {user.email && (
                    <p className="text-delabs-text mb-2">{user.email}</p>
                  )}
                  <p className="text-sm text-gray-500">User ID: {user.id}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Account Status & Platform Connections */}
              <div className="space-y-6">
                {/* Platform Connections */}
                {/* Token Status Warning */}
                {hasTokenIssues && failedRefreshes.length > 0 && (
                  <div className="samsung-card p-4 mb-6 border-l-4 border-yellow-500 bg-yellow-500/10">
                    <div className="flex items-start space-x-3">
                      <div className="text-yellow-500 mt-1">⚠️</div>
                      <div>
                        <h4 className="text-yellow-500 font-semibold mb-2">Platform Connection Issues</h4>
                        <p className="text-delabs-text text-sm mb-2">
                          Some platform tokens need to be refreshed. This may affect content submission.
                        </p>
                        <ul className="text-delabs-text text-sm space-y-1">
                          {failedRefreshes.map((failure, index) => (
                            <li key={index}>
                              • {failure.platform} (@{failure.username}): {failure.error}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={checkTokenStatus}
                          className="mt-3 px-3 py-1 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-400 transition-colors"
                        >
                          Retry Token Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="samsung-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Connected Platforms</h3>
                  
                  {user.platforms.length === 0 ? (
                    <p className="text-delabs-text">No platforms connected yet</p>
                  ) : (
                    <div className="space-y-4">
                      {user.platforms.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-delabs-surface/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-delabs-surface">
                              {platform.platform === 'YOUTUBE' && (
                                <img src="/youtube.png" alt="YouTube" className="w-6 h-6 object-contain" />
                              )}
                              {platform.platform === 'TWITCH' && (
                                <img src="/twitch.png" alt="Twitch" className="w-6 h-6 object-contain" />
                              )}
                              {platform.platform === 'FACEBOOK' && (
                                <img src="/facebook.png" alt="Facebook" className="w-6 h-6 object-contain" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{platform.platform}</p>
                              <p className="text-delabs-text text-sm">@{platform.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400 text-sm">Connected</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Referral Status */}
                <div className="samsung-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Referral Status</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <ReferralLinkManager 
                        currentLink={user.referralLink}
                        onUpdate={handleReferralLinkUpdate}
                      />
                    </div>
                    
                    <div className="border-t border-delabs-surface pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-delabs-text">No. of Referred Players:</span>
                        <span className="text-white font-medium">{user.referralCount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-delabs-text">Referred Players&apos; Total Spend:</span>
                        <span className="text-white font-medium">${(user.purchaseAmountTotal || 0).toFixed(2)}</span>
                      </div>
                      {user.lastReferralSync && (
                        <div className="text-xs text-delabs-text">
                          Last updated: {new Date(user.lastReferralSync).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Level - Hidden per user request */}
                {/* 
                <div className="samsung-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Member Level</h3>
                  <div className="flex items-center space-x-4">
                    <div className={`px-4 py-2 rounded-lg font-semibold ${
                      user.tier === 'Best' ? 'bg-tier-gold text-white' :
                      user.tier === 'Partner' ? 'bg-tier-silver text-white' :
                      'bg-tier-bronze text-white'
                    }`}>
                      {user.tier || 'Normal'}
                    </div>
                    <div className="text-delabs-text text-sm">
                      {user.tier === 'Best' ? 'Top tier creator' :
                       user.tier === 'Partner' ? 'Partner creator' :
                       'Standard member'}
                    </div>
                  </div>
                </div>
                */}
              </div>

              {/* Right Column - Content Submission */}
              <div>
                <ContentSubmissionForm 
                  onContentSubmitted={handleContentSubmitted} 
                  userPlatforms={user.platforms}
                />
              </div>
            </div>

            {/* Embedded Content Section */}
            <EmbeddedContent key={refreshContent} userId={user.id} />
          </div>
        </div>
      </div>
    </Layout>
  )
}