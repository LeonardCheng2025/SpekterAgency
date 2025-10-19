import React, { useState, useEffect } from 'react'
import DeleteConfirmModal from './DeleteConfirmModal'

interface ContentItem {
  id: string
  title: string
  description?: string
  platform: string
  platformVideoId: string
  contentType: string
  thumbnailUrl?: string
  duration?: number
  publishedAt: string
  isLive: boolean
  embedUrl?: string
  originalUrl?: string
  latestMetrics?: {
    views: number
    likes: number
    comments: number
  } | null
}

interface EmbeddedContentProps {
  userId?: string
}

const EmbeddedContent: React.FC<EmbeddedContentProps> = ({ userId }) => {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<string | null>(null)

  // 驗證和清理縮圖 URL
  const validateThumbnailUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined
    
    try {
      // 嘗試創建 URL 對象來驗證
      new URL(url)
      return url
    } catch (e) {
      console.warn('⚠️ Invalid thumbnail URL:', url)
      return undefined
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      setLoading(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${backendUrl}/api/content/my-content`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contents')
      }

      const data = await response.json()
      setContents(data.contents || [])
    } catch (err) {
      console.error('Error fetching contents:', err)
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (contentId: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevent the link from opening
    e.stopPropagation() // Stop event bubbling
    
    setContentToDelete(contentId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return

    try {
      setDeletingIds(prev => new Set(prev).add(contentToDelete))
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${backendUrl}/api/content/delete/${contentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete content')
      }

      // Remove from local state
      setContents(prev => prev.filter(content => content.id !== contentToDelete))
    } catch (err) {
      console.error('Error deleting content:', err)
      alert('Failed to delete content. Please try again.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(contentToDelete)
        return newSet
      })
      setDeleteModalOpen(false)
      setContentToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setContentToDelete(null)
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-6">My Content</h3>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-delabs-red"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-6">My Content</h3>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchContents}
            className="samsung-btn-secondary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-white mb-6">My Content</h3>
        <div className="text-center py-8 text-delabs-text">
          <p>No content submitted yet.</p>
          <p className="text-sm mt-2">Submit your first content URL above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-6">My Content ({contents.length})</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => {
          const CardWrapper = content.originalUrl ? 'a' : 'div'
          const wrapperProps = content.originalUrl ? {
            href: content.originalUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'block samsung-card overflow-hidden hover:shadow-glow-red transition-all duration-300 cursor-pointer'
          } : {
            className: 'block samsung-card overflow-hidden transition-all duration-300'
          }
          
          return (
            <div key={content.id} className="relative group">
              <CardWrapper {...wrapperProps}>
            {/* Thumbnail Display (no iframe due to CSP restrictions) */}
            {validateThumbnailUrl(content.thumbnailUrl) ? (
              <div className="relative w-full h-48 bg-gray-900">
                <img 
                  src={content.thumbnailUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onLoad={() => {
                    // Thumbnail loaded successfully
                  }}
                  onError={(e) => {
                    // Handle thumbnail loading errors
                    const target = e.target as HTMLImageElement
                    const fallbackUrl = `https://images.weserv.nl/?url=${encodeURIComponent(content.thumbnailUrl!)}&w=640&h=360&fit=cover&output=webp`
                    
                    // Try using image proxy service as fallback
                    if (!target.dataset.fallbackTried) {
                      target.dataset.fallbackTried = 'true'
                      target.src = fallbackUrl
                      return
                    }
                    
                    // 如果代理也失敗，顯示預設圖片
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-center p-4">
                          <div class="text-6xl text-gray-600 mb-2">🎬</div>
                          <span class="text-gray-400 mb-2">Preview Unavailable</span>
                          <span class="text-xs text-gray-500">Twitch Video</span>
                        </div>
                      `
                    }
                  }}
                />
                {content.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(content.duration)}
                  </div>
                )}
                {/* Platform Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    content.platform === 'TWITCH' ? 'bg-purple-600 text-white' :
                    content.platform === 'YOUTUBE' ? 'bg-red-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {content.platform}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400">No Preview Available</span>
              </div>
            )}

            {/* Content Info */}
            <div className="p-4">
              <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                {content.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-delabs-text mb-2">
                <span className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    content.platform === 'TWITCH' ? 'bg-purple-500' :
                    content.platform === 'YOUTUBE' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></span>
                  {content.platform}
                </span>
                <span>{formatDate(content.publishedAt)}</span>
              </div>

              {content.latestMetrics && (
                <div className="flex items-center justify-between text-xs text-delabs-text mb-2">
                  <span>{formatViews(content.latestMetrics.views)} views</span>
                  {content.latestMetrics.likes > 0 && (
                    <span>{content.latestMetrics.likes} likes</span>
                  )}
                </div>
              )}

              {content.isLive && (
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-xs text-red-400 font-medium">LIVE</span>
                </div>
              )}

            </div>
              </CardWrapper>
            
            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteClick(content.id, e)}
              disabled={deletingIds.has(content.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 disabled:opacity-50"
              title="Delete content"
            >
              {deletingIds.has(content.id) ? (
                <div className="animate-spin w-3 h-3 border border-delabs-red border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
      />
    </div>
  )
}

export default EmbeddedContent
