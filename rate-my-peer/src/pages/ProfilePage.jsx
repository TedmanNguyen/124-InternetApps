import { Link, useParams } from 'react-router-dom'
import AttributeTag from '../components/AttributeTag'
import RatingStars from '../components/RatingStars'
import { useStudents } from '../context/StudentContext'
import {
  getAggregateRating,
  getCourseBreakdown,
  getDisplayName,
  getTopAttributes,
} from '../utils/studentMetrics'

export default function ProfilePage() {
  const { studentId } = useParams()
  const { getStudentById } = useStudents()

  const student = getStudentById(studentId)

  if (!student) {
    return <p className="empty-state">Student profile not found.</p>
  }

  const aggregateRating = getAggregateRating(student)
  const courseBreakdown = getCourseBreakdown(student)
  const topAttributes = getTopAttributes(student, 6)

  return (
    <section className="page">
      <div className="profile-header">
        <div className="avatar large">{student.firstName[0]}{student.lastName[0]}</div>
        <div>
          <h1>{getDisplayName(student)}</h1>
          <p>{student.major}</p>
          <p className="muted">{student.email}</p>
          <RatingStars
            rating={aggregateRating}
            totalReviews={student.reviews.length}
            size="lg"
          />
        </div>
        <Link to={`/student/${student.id}/review`} className="primary-link">
          Write review
        </Link>
      </div>

      <div className="profile-grid">
        <section className="panel">
          <h2>Course Breakdown</h2>
          {courseBreakdown.length ? (
            <ul className="list">
              {courseBreakdown.map((item) => (
                <li key={item.course}>
                  <span>{item.course}</span>
                  <span>{item.rating.toFixed(1)} stars ({item.reviews})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No course ratings yet.</p>
          )}
        </section>

        <section className="panel">
          <h2>Top Attributes</h2>
          <div className="tag-row">
            {topAttributes.length ? (
              topAttributes.map((attribute) => (
                <AttributeTag key={attribute} label={attribute} />
              ))
            ) : (
              <p className="muted">No attribute data yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Recent Reviews</h2>
        <div className="review-list">
          {student.reviews.map((review) => (
            <article key={review.id} className="review-item">
              <header>
                <strong>{review.course}</strong>
                <span>{review.rating}.0 / 5</span>
              </header>
              <p>{review.comment}</p>
              <div className="tag-row">
                {review.attributes.map((attribute) => (
                  <AttributeTag key={`${review.id}-${attribute}`} label={attribute} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

