import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import StudentCard from '../components/StudentCard'
import { useStudents } from '../context/StudentContext'

export default function LandingPage() {
  const { students } = useStudents()
  const navigate = useNavigate()

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

    </section>
  )
}

