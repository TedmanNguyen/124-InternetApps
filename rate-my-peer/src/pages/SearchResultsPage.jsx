import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import SearchEmptyState from '../components/SearchEmptyState'
import CreatePeerModal from '../components/CreatePeerModal'
import { useStudents } from '../context/StudentContext'
import { getDisplayName } from '../utils/studentMetrics'

export default function SearchResultsPage() {
  const { students } = useStudents()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isEmailSearch = query.includes('@')

  const filteredStudents = useMemo(() => {
    if (!query) {
      return students
    }

    return students.filter((student) => {
      const fullName = getDisplayName(student).toLowerCase()
      return fullName.includes(query) || student.email.toLowerCase().includes(query)
    })
  }, [query, students])

  return (
    <section className="page">
      <div className="section-header">
        <h1>Search Results</h1>
        <p>
          Showing {filteredStudents.length} result
          {filteredStudents.length === 1 ? '' : 's'} for "{query || 'all students'}"
        </p>
      </div>

      {filteredStudents.length > 0 ? (
        <>
          <div className="card-grid">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {!isEmailSearch && (
            <div className="empty-state-container">
              <p className="empty-state">
                Not seeing the right person? Create a new profile.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
                style={{ marginTop: '0.5rem' }}
              >
                Create a New Profile
              </button>
            </div>
          )}
        </>
      ) : (
        <SearchEmptyState searchQuery={query} />
      )}

      {showCreateModal && (
        <CreatePeerModal
          searchQuery={query}
          isEmailSearch={isEmailSearch}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </section>
  )
}

