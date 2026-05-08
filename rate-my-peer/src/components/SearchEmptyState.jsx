import { useState } from 'react'
import CreatePeerModal from './CreatePeerModal'

export default function SearchEmptyState({ searchQuery }) {
  const [showModal, setShowModal] = useState(false)

  const isEmailSearch = searchQuery.includes('@')

  return (
    <>
      <div className="empty-state-container">
        <p className="empty-state">
          {isEmailSearch
            ? `No student found with that email. Would you like to create a profile?`
            : `We couldn't find anyone named "${searchQuery}". Would you like to create a new profile?`}
        </p>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ marginTop: '1rem' }}
        >
          {isEmailSearch
            ? "Can't find your peer? Create a profile to rate them"
            : 'Not seeing the right person? Create a new profile'}
        </button>
      </div>

      {showModal && (
        <CreatePeerModal
          searchQuery={searchQuery}
          isEmailSearch={isEmailSearch}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
