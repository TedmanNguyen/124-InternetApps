import { Link } from 'react-router-dom'
import { getDisplayName } from '../utils/studentMetrics'
import AttributeTag from './AttributeTag'
import RatingStars from './RatingStars'

// `student` comes from the /api/students endpoint and now includes
// averageRating, reviewCount, and topAttributes — no per-card fetch needed.
export default function StudentCard({ student }) {
  const name = getDisplayName(student)
  const rating = student.averageRating ?? 0
  const reviewCount = student.reviewCount ?? 0
  const topAttributes = (student.topAttributes ?? []).slice(0, 3)

  return (
    <article className="student-card">
      <div className="avatar">{student.firstName[0]}{student.lastName[0]}</div>
      <h3>{name}</h3>
      <p>{student.major}</p>
      <p className="muted">{student.email}</p>

      <RatingStars rating={rating} totalReviews={reviewCount} />

      <div className="tag-row">
        {topAttributes.map((attribute) => (
          <AttributeTag key={attribute} label={attribute} />
        ))}
      </div>

      <Link to={`/student/${student.id}`} className="primary-link">
        View profile
      </Link>
    </article>
  )
}
