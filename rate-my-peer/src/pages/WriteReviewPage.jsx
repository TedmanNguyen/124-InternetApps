import { useNavigate, useParams } from 'react-router-dom'
import ReviewForm from '../components/ReviewForm'
import { useStudents } from '../context/StudentContext'

export default function WriteReviewPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { addReview, getStudentById } = useStudents()

  const student = getStudentById(studentId)

  if (!student) {
    return <p className="empty-state">Student profile not found.</p>
  }

  const handleSubmit = async (reviewData) => {
    await addReview({
      studentId: student.id,
      ...reviewData,
    })

    navigate(`/student/${student.id}`)
  }

  return (
    <section className="page">
      <ReviewForm
        student={student}
        onClose={() => navigate(-1)}
        onSubmit={handleSubmit}
      />
    </section>
  )
}

