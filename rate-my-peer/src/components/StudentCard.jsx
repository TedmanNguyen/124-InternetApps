import { Link } from 'react-router-dom'
import { getAggregateRating, getDisplayName, getTopAttributes } from '../utils/studentMetrics'
import AttributeTag from './AttributeTag'
import RatingStars from './RatingStars'

export default function StudentCard({ student }) {
  const name = getDisplayName(student)
  const rating = getAggregateRating(student)
  const topAttributes = getTopAttributes(student, 3)

  return (
    <article className="student-card">
      <div className="avatar">{student.firstName[0]}{student.lastName[0]}</div>
      <h3>{name}</h3>
      <p>{student.major}</p>
      <p className="muted">{student.email}</p>

      <RatingStars rating={rating} totalReviews={student.reviews.length} />

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

