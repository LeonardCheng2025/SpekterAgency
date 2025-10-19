import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../lib/hooks/useAuth'
import { ProfileSkeleton } from '../../../components/SkeletonLoader'
import SuperAdminContentManager from '../../../components/SuperAdminContentManager'

interface Creator {
  id: string
  name: string
  email?: string
  avatar?: string
  region: string
  tier: string
  isSuperAdmin: boolean
  totalPoints: number
  contentPoints: number
  referralPoints: number
  referralLink?: string
  uidHEX?: string
  referralCount: number
  purchaseAmountTotal: number
  lastReferralSync?: string
  createdAt: string
  platforms: Array<{
    platform: string
    username: string
    platformId: string
  }>
  recentContents?: Array<{
    id: string
    title: string
    platform: string
    createdAt: string
    validationStatus: string
  }>
}

export default function AdminProfile() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated, isLoading } = useAuth()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    region: '',
    tier: '',
    referralLink: '',
    uidHEX: '',
    referralCount: 0,
    purchaseAmountTotal: 0
  })

  // Check authentication and super admin status
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isSuperAdmin)) {
      router.push('/profile')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Fetch creator data
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchCreator(id)
    }
  }, [id])

  const fetchCreator = async (creatorId: string) => {
    try {
      setLoading(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/admin/get-creator?id=${creatorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch creator')
      }

      const data = await response.json()
      setCreator(data.creator)
      setFormData({
        name: data.creator.name || '',
        email: data.creator.email || '',
        region: data.creator.region || '',
        tier: data.creator.tier || '',
        referralLink: data.creator.referralLink || '',
        uidHEX: data.creator.uidHEX || '',
        referralCount: data.creator.referralCount || 0,
        purchaseAmountTotal: data.creator.purchaseAmountTotal || 0
      })
      setError(null)
    } catch (err) {
      console.error('Error fetching creator:', err)
      setError('Failed to load creator data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!creator) return

    setSaving(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/admin/update-creator`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: creator.id,
          ...formData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update creator')
      }

      const data = await response.json()
      setCreator(data.creator)
      alert('Creator updated successfully!')
    } catch (err) {
      console.error('Error updating creator:', err)
      alert(err instanceof Error ? err.message : 'Failed to update creator')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    )
  }

  if (!user?.isSuperAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">Access Denied</p>
            <button
              onClick={() => router.push('/profile')}
              className="samsung-btn-primary"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !creator) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">{error || 'Creator not found'}</p>
            <button
              onClick={() => router.push('/profile')}
              className="samsung-btn-primary"
            >
              Back to Profile
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin: Edit Creator Profile
              </h1>
              <p className="text-delabs-text">
                Editing: {creator.name} ({creator.id})
              </p>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-delabs-surface text-white rounded-lg hover:bg-delabs-surface-hover transition-colors"
            >
              ← Back to Profile
            </button>
          </div>

          <div className="space-y-8">
            {/* Content Management Section */}
            <SuperAdminContentManager 
              creatorId={creator.id}
              creatorName={creator.name}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Creator Info */}
              <div className="space-y-6">
                <div className="samsung-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-delabs-text text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-delabs-text text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-delabs-text text-sm font-medium mb-2">
                        Region
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      >
                        <option value="Taiwan">Taiwan</option>
                        <option value="Thailand">Thailand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-delabs-text text-sm font-medium mb-2">
                        Tier
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Partner">Partner</option>
                        <option value="Best">Best</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Information */}
              <div className="samsung-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Referral Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-delabs-text text-sm font-medium mb-2">
                      Referral Link
                    </label>
                    <input
                      type="text"
                      value={formData.referralLink}
                      onChange={(e) => setFormData({ ...formData, referralLink: e.target.value })}
                      placeholder="https://liff.line.me/..."
                      className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-delabs-text text-sm font-medium mb-2">
                      UID HEX
                    </label>
                    <input
                      type="text"
                      value={formData.uidHEX}
                      onChange={(e) => setFormData({ ...formData, uidHEX: e.target.value })}
                      placeholder="23F142F4"
                      className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-delabs-text text-sm font-medium mb-2">
                        Referral Count
                      </label>
                      <input
                        type="number"
                        value={formData.referralCount}
                        onChange={(e) => setFormData({ ...formData, referralCount: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-delabs-text text-sm font-medium mb-2">
                        Purchase Amount Total ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.purchaseAmountTotal}
                        onChange={(e) => setFormData({ ...formData, purchaseAmountTotal: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Right Column - Stats & Info */}
            <div className="space-y-6">
              {/* Current Stats */}
              <div className="samsung-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Current Stats</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-delabs-text">Total Points</div>
                    <div className="text-white font-semibold">{creator.totalPoints}</div>
                  </div>
                  <div>
                    <div className="text-delabs-text">Content Points</div>
                    <div className="text-white font-semibold">{creator.contentPoints}</div>
                  </div>
                  <div>
                    <div className="text-delabs-text">Referral Points</div>
                    <div className="text-white font-semibold">{creator.referralPoints}</div>
                  </div>
                  <div>
                    <div className="text-delabs-text">Super Admin</div>
                    <div className="text-white font-semibold">
                      {creator.isSuperAdmin ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Platforms */}
              <div className="samsung-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Connected Platforms</h3>
                
                {creator.platforms.length === 0 ? (
                  <p className="text-delabs-text">No platforms connected</p>
                ) : (
                  <div className="space-y-3">
                    {creator.platforms.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-delabs-surface/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-delabs-surface">
                            {platform.platform === 'YOUTUBE' && '📺'}
                            {platform.platform === 'TWITCH' && '🟣'}
                            {platform.platform === 'FACEBOOK' && '📘'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{platform.platform}</p>
                            <p className="text-delabs-text text-sm">@{platform.username}</p>
                          </div>
                        </div>
                        <span className="text-green-400 text-sm">Connected</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Content */}
              {creator.recentContents && creator.recentContents.length > 0 && (
                <div className="samsung-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Content</h3>
                  
                  <div className="space-y-3">
                    {creator.recentContents.map((content) => (
                      <div key={content.id} className="p-3 bg-delabs-surface/50 rounded-lg">
                        <div className="text-white font-medium text-sm mb-1">
                          {content.title}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-delabs-text">
                            {content.platform} • {new Date(content.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            content.validationStatus === 'APPROVED' ? 'bg-green-600' :
                            content.validationStatus === 'REJECTED' ? 'bg-red-600' :
                            'bg-yellow-600'
                          } text-white`}>
                            {content.validationStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}
