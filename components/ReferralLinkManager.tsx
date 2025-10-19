import { useState } from 'react'

interface ReferralLinkManagerProps {
  currentLink?: string
  onUpdate: (referralLink: string, uidHEX: string) => void
}

export default function ReferralLinkManager({ currentLink, onUpdate }: ReferralLinkManagerProps) {
  const [isEditing, setIsEditing] = useState(!currentLink)
  const [inputLink, setInputLink] = useState(currentLink || '')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Extract uidHEX from referral link
  const extractUidHEX = (link: string): string | null => {
    try {
      const match = link.match(/startapp=U_([A-Fa-f0-9]+)/)
      return match ? match[1] : null
    } catch (error) {
      return null
    }
  }

  const validateReferralLink = (link: string): boolean => {
    // Check if it's a valid referral link format
    const pattern = /^https:\/\/liff\.line\.me\/\d+-[\w]+\?startapp=U_[A-Fa-f0-9]+$/
    return pattern.test(link)
  }

  const handleSave = async () => {
    setError('')
    
    if (!inputLink.trim()) {
      setError('Please enter a referral link')
      return
    }

    if (!validateReferralLink(inputLink)) {
      setError('Invalid referral link format. Please use the correct LINE LIFF link format.')
      return
    }

    const uidHEX = extractUidHEX(inputLink)
    if (!uidHEX) {
      setError('Could not extract UID HEX from the referral link')
      return
    }

    // Direct save without modal
    setIsLoading(true)
    try {
      await onUpdate(inputLink, uidHEX)
      setIsEditing(false)
    } catch (error) {
      setError('Failed to update referral link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            placeholder="Enter your referral link here"
            className="flex-1 px-4 py-3 bg-delabs-surface border border-line rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-delabs-red focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-brand text-white rounded-full text-xs font-bold tracking-wide border border-brand/50 hover:bg-brand/80 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
        
        {error && (
          <span className="text-red-400 text-xs">{error}</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          value={currentLink || ''} 
          readOnly 
          className="flex-1 bg-delabs-surface/50 text-white text-sm px-3 py-2 rounded border border-delabs-surface"
        />
        <button 
          onClick={() => navigator.clipboard.writeText(currentLink!)}
          className="bg-brand hover:bg-brand/80 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors"
          title="Copy to clipboard"
        >
          Copy
        </button>
      </div>
    </div>
  )
}
