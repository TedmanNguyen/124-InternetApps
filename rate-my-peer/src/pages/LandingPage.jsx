import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import StudentCard from '../components/StudentCard'
import { useStudents } from '../context/StudentContext'

export default function LandingPage() {
  const { students } = useStudents()
  const navigate = useNavigate()

  const topRated = [...students]
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 3)

  return (
    <section className="page landing-page">
      <div className="hero-block">
        <h1>Find trusted teammates before your next project starts.</h1>
        <p>
          Search classmates, inspect multi-course performance, and leave
          evidence-based feedback.
        </p>
        <SearchBar
          buttonLabel="Search peers"
          onSearch={(searchTerm) =>
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
          }
        />
      </div>

      <div className="section-header">
        <h2>Popular Profiles</h2>
      </div>
      <div className="card-grid">
        {topRated.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </section>
  )
}

