import { useState, useEffect } from 'react'

interface Content {
  id: string
  title: string
  platform: string
  contentType: string
  validationStatus: string
  createdAt: string
  thumbnailUrl?: string
  viewCount?: number
  originalUrl: string
}

interface SuperAdminContentManagerProps {
  creatorId: string
  creatorName: string
}

export default function SuperAdminContentManager({ creatorId, creatorName }: SuperAdminContentManagerProps) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [newContentUrl, setNewContentUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 獲取創作者的內容
  const fetchContents = async () => {
    try {
      setLoading(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/content/creator/${creatorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }

      const data = await response.json()
      setContents(data.contents || [])
    } catch (err) {
      console.error('Error fetching contents:', err)
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  // 提交新內容
  const handleSubmitContent = async () => {
    if (!newContentUrl.trim()) return

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/admin/submit-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: newContentUrl,
          creatorId: creatorId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit content')
      }

      setSuccess(`Content submitted successfully for ${creatorName}`)
      setNewContentUrl('')
      fetchContents() // 重新加載內容列表
    } catch (err) {
      console.error('Error submitting content:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit content')
    } finally {
      setSubmitting(false)
    }
  }

  // 刪除內容
  const handleDeleteContent = async (contentId: string, contentTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${contentTitle}"?`)) return

    setDeleting(contentId)
    setError(null)
    setSuccess(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/content/delete/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete content')
      }

      setSuccess(`Content "${contentTitle}" deleted successfully`)
      fetchContents() // 重新加載內容列表
    } catch (err) {
      console.error('Error deleting content:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete content')
    } finally {
      setDeleting(null)
    }
  }

  // 初始加載
  useEffect(() => {
    fetchContents()
  }, [creatorId]) // fetchContents is stable as it doesn't depend on external state

  // 清除消息
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Content Management</h3>
        <span className="text-delabs-text text-sm">Managing content for: {creatorName}</span>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="text-green-400 text-sm">{success}</div>
        </div>
      )}

      {/* Submit New Content */}
      <div className="samsung-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Submit New Content</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-delabs-text text-sm font-medium mb-2">
              Content URL (YouTube or Twitch)
            </label>
            <input
              type="text"
              value={newContentUrl}
              onChange={(e) => setNewContentUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://www.twitch.tv/videos/..."
              className="w-full px-4 py-3 bg-delabs-surface border border-delabs-border rounded-lg text-white placeholder-delabs-text focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
          <button
            onClick={handleSubmitContent}
            disabled={submitting || !newContentUrl.trim()}
            className="w-full py-3 bg-brand hover:bg-brand-hover disabled:bg-delabs-surface disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span>Submit Content for {creatorName}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Existing Content */}
      <div className="samsung-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Existing Content</h4>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-delabs-text text-lg mb-2">📭</div>
            <p className="text-delabs-text">No content submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((content) => (
              <div key={content.id} className="flex items-center space-x-4 p-4 bg-delabs-surface/50 rounded-lg">
                {/* Thumbnail */}
                {content.thumbnailUrl && (
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                )}

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{content.title}</div>
                  <div className="flex items-center space-x-4 mt-1 text-sm">
                    <span className="flex items-center space-x-1">
                      {content.platform === 'YOUTUBE' && <span>📺</span>}
                      {content.platform === 'TWITCH' && <span>🟣</span>}
                      <span className="text-delabs-text">{content.platform}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      content.validationStatus === 'APPROVED' ? 'bg-green-600' :
                      content.validationStatus === 'REJECTED' ? 'bg-red-600' :
                      'bg-yellow-600'
                    } text-white`}>
                      {content.validationStatus}
                    </span>
                    <span className="text-delabs-text">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                    {content.viewCount && (
                      <span className="text-delabs-text">
                        👀 {content.viewCount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <a
                    href={content.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-delabs-surface text-delabs-text hover:text-white rounded-lg transition-colors"
                    title="View Original"
                  >
                    🔗
                  </a>
                  <button
                    onClick={() => handleDeleteContent(content.id, content.title)}
                    disabled={deleting === content.id}
                    className="p-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                    title="Delete Content"
                  >
                    {deleting === content.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      '🗑️'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
