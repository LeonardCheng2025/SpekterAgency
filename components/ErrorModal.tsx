import React from 'react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  redirectUrl?: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  redirectUrl = 'https://ragnarok-libre.clutch-hub.xyz/' 
}) => {
  if (!isOpen) return null

  const handleRedirect = () => {
    onClose()
    window.location.href = redirectUrl
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="samsung-card max-w-md w-full mx-4 p-6 text-center">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-delabs-text leading-relaxed text-center">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleRedirect}
            className="samsung-btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
