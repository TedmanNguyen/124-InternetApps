import { useState, useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import SearchEmptyState from '../components/SearchEmptyState'
import CreatePeerModal from '../components/CreatePeerModal'
import { api } from '../api/client'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const normalizedQuery = query.toLowerCase()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState([])

  const isEmailSearch = normalizedQuery.includes('@')

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        if (isEmailSearch) {
          const { student } = await api.students.getByEmail(normalizedQuery)
          if (!cancelled) setFilteredStudents(student ? [student] : [])
        } else {
          const { students } = await api.students.getByName(normalizedQuery)
          if (!cancelled) setFilteredStudents(Array.isArray(students) ? students : [])
        }
      } catch (err) {
        if (!cancelled) setFilteredStudents([])
        console.error('Search failed:', err)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [normalizedQuery, isEmailSearch])

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

