import React from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}) => {
  if (!isOpen) {
    return null
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
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
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="samsung-btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="samsung-btn-primary"
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
