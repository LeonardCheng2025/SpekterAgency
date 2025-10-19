import React, { useState, useEffect } from 'react'

interface UserPlatform {
  platform: string
  username: string
  platformId: string
}

interface ContentSubmissionFormProps {
  onContentSubmitted?: () => void
  userPlatforms?: UserPlatform[]
}

const ContentSubmissionForm: React.FC<ContentSubmissionFormProps> = ({ onContentSubmitted, userPlatforms = [] }) => {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState<'TWITCH' | 'YOUTUBE' | 'FACEBOOK'>('TWITCH')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Auto-detect platform based on user's connected platforms
  useEffect(() => {
    if (userPlatforms.length > 0) {
      // Priority: YouTube > Twitch > Facebook
      const youtubeConnection = userPlatforms.find(p => p.platform === 'YOUTUBE')
      const twitchConnection = userPlatforms.find(p => p.platform === 'TWITCH')
      const facebookConnection = userPlatforms.find(p => p.platform === 'FACEBOOK')
      
      if (youtubeConnection) {
        setPlatform('YOUTUBE')
      } else if (twitchConnection) {
        setPlatform('TWITCH')
      } else if (facebookConnection) {
        setPlatform('FACEBOOK')
      }
    }
  }, [userPlatforms])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid URL' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${backendUrl}/api/content/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url.trim(),
          platform
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to submit content')
      }

      setMessage({ type: 'success', text: 'Content submitted successfully!' })
      setUrl('')
      
      // 通知父組件刷新內容列表
      if (onContentSubmitted) {
        onContentSubmitted()
      }

    } catch (error) {
      console.error('Content submission error:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to submit content'
      })
    } finally {
      setLoading(false)
    }
  }


  const validateUrl = (url: string, platform: string): boolean => {
    const patterns = {
      TWITCH: [
        /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/videos\/\d+/
      ],
      YOUTUBE: [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[\w-]+/
      ],
      FACEBOOK: [
        /facebook\.com\/.*\/videos\/\d+/,
        /fb\.watch\/[\w-]+/
      ]
    }

    const platformPatterns = patterns[platform as keyof typeof patterns] || []
    return platformPatterns.some(pattern => pattern.test(url))
  }

  const isUrlValid = url.trim() === '' || validateUrl(url, platform)

  return (
    <div className="samsung-card p-6 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-6">Submit Content</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
        {/* Platform Display (Auto-detected) - Better spacing */}
        <div>
          <label className="block text-sm font-medium text-delabs-text mb-2">
            Platform
          </label>
          <div className="w-full px-4 py-3 bg-delabs-surface/50 border border-line rounded-lg text-white">
            {platform === 'YOUTUBE' && 'YouTube'}
            {platform === 'TWITCH' && 'Twitch'}
            {platform === 'FACEBOOK' && 'Facebook'}
          </div>
        </div>

        {/* URL Input - Better spacing */}
        <div className="flex-grow">
          <label className="block text-sm font-medium text-delabs-text mb-2">
            Content URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full px-4 py-3 bg-delabs-surface border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-delabs-red focus:border-transparent ${
              !isUrlValid ? 'border-red-500 bg-red-900/20' : 'border-line'
            }`}
            disabled={loading}
            required
          />
          {!isUrlValid && (
            <p className="mt-2 text-sm text-red-400">
              Please enter a valid {platform} URL
            </p>
          )}
        </div>

        {/* Submit Button - Original design with red color */}
        <button
          type="submit"
          disabled={loading || !url.trim() || !isUrlValid}
          className={`w-full px-6 py-3 bg-brand hover:bg-brand/80 text-white font-semibold rounded-lg transition-all duration-200 ${
            loading || !url.trim() || !isUrlValid
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-delabs-red"></div>
            </div>
          ) : (
            'Submit Content'
          )}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-900/20 border-green-500/30 text-green-400' 
            : 'bg-red-900/20 border-red-500/30 text-red-400'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ContentSubmissionForm
