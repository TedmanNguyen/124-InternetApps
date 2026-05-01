import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import { useStudents } from '../context/StudentContext'
import { getDisplayName } from '../utils/studentMetrics'

export default function SearchResultsPage() {
  const { students } = useStudents()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()

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
        <div className="card-grid">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No peers matched that search. Try a name, major, or email fragment.
        </p>
      )}
    </section>
  )
}

