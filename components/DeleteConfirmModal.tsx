import React from 'react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Delete Content',
  message = 'Are you sure you want to delete this content? This action cannot be undone.'
}) => {
  if (!isOpen) return null

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
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="samsung-btn-primary"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="samsung-btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
