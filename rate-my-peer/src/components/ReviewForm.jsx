import { useState } from 'react'
import { attributeOptions } from '../data/mockStudents'

export default function ReviewForm({ studentName, onSubmit }) {
  const [course, setCourse] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [attributes, setAttributes] = useState(['On Time'])

  const handleToggleAttribute = (attribute) => {
    setAttributes((current) => {
      if (current.includes(attribute)) {
        return current.filter((item) => item !== attribute)
      }

      return [...current, attribute]
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!course.trim() || !comment.trim() || attributes.length === 0) {
      return
    }

    onSubmit({
      course: course.trim().toUpperCase(),
      rating: Number(rating),
      comment: comment.trim(),
      attributes,
    })

    setCourse('')
    setRating(5)
    setComment('')
    setAttributes(['On Time'])
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>Leave a verified review for {studentName}</h2>

      <label>
        Course Name / ID
        <input
          type="text"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          placeholder="Example: CS101"
          required
        />
      </label>

      <label>
        Star Rating
        <select
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          required
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} Star{value > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </label>

      <label>
        Comment
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder="Share specific feedback from your collaboration..."
          required
        />
      </label>

      <fieldset>
        <legend>Attributes</legend>
        <div className="chip-grid">
          {attributeOptions.map((attribute) => {
            const isSelected = attributes.includes(attribute)
            return (
              <button
                key={attribute}
                type="button"
                className={`chip ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleAttribute(attribute)}
              >
                {attribute}
              </button>
            )
          })}
        </div>
      </fieldset>

      <button type="submit" className="primary-link">
        Submit review
      </button>
    </form>
  )
}

