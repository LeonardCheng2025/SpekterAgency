import { useState } from 'react'
import { useRouter } from 'next/router'

interface Creator {
  id: string
  name: string
  email?: string
  region: string
  tier: string
  referralCount: number
  purchaseAmountTotal: number
  platforms: Array<{
    platform: string
    username: string
  }>
}

interface SuperAdminSearchProps {
  onCreatorSelect?: (creatorId: string) => void
}

export default function SuperAdminSearch({ onCreatorSelect }: SuperAdminSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Creator[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/admin/search-creators?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data.creators || [])
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatorClick = (creatorId: string) => {
    if (onCreatorSelect) {
      onCreatorSelect(creatorId)
    } else {
      // Navigate to admin profile page with creator ID
      router.push(`/admin/profile/${creatorId}`)
    }
    setShowResults(false)
    setSearchQuery('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative mb-6">
      <div className="samsung-card p-4 bg-red-900/20 border border-red-500/30">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-red-400 text-sm font-semibold">🔧 SUPER ADMIN</div>
          <div className="text-red-300 text-xs">Creator Search & Management</div>
        </div>
        
        <div className="flex space-x-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by Creator ID or Name..."
            className="flex-1 px-4 py-2 bg-delabs-surface border border-delabs-border rounded-lg text-white placeholder-delabs-text focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-delabs-surface border border-delabs-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="p-4 text-delabs-text text-center">
              No creators found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="divide-y divide-delabs-border">
              {searchResults.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => handleCreatorClick(creator.id)}
                  className="p-4 hover:bg-delabs-surface-hover cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="text-white font-medium">{creator.name}</div>
                          <div className="text-delabs-text text-sm">
                            ID: {creator.id}
                          </div>
                          {creator.email && (
                            <div className="text-delabs-text text-sm">
                              Email: {creator.email}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          creator.region === 'Taiwan' ? 'bg-blue-600' : 'bg-green-600'
                        } text-white`}>
                          {creator.region}
                        </span>
                        <span className="text-delabs-text">
                          Tier: {creator.tier}
                        </span>
                        <span className="text-delabs-text">
                          Referrals: {creator.referralCount}
                        </span>
                        <span className="text-delabs-text">
                          Spend: ${creator.purchaseAmountTotal.toFixed(2)}
                        </span>
                      </div>

                      {creator.platforms.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          {creator.platforms.map((platform, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-delabs-surface text-xs rounded text-delabs-text"
                            >
                              {platform.platform}: @{platform.username}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-red-400 text-sm">
                      Click to Edit →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
