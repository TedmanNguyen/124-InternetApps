import { useState } from 'react'
import { attributeOptions } from '../data/mockStudents'

export default function ReviewForm({ student, onClose, onSubmit }) {
  const [course, setCourse] = useState('')
  const [instructor, setInstructor] = useState('')
  const [project, setProject] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [attributes, setAttributes] = useState([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [wouldWorkWithAgain, setWouldWorkWithAgain] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleToggleAttribute = (attribute) => {
    setAttributes((current) =>
      current.includes(attribute)
        ? current.filter((item) => item !== attribute)
        : [...current, attribute]
    )
  }

  const isFormValid = course && rating > 0 && verified

  const handleSubmit = () => {
    if (!isFormValid) return

    onSubmit({
      course: course.trim().toUpperCase(),
      instructor: instructor.trim(),
      project: project.trim(),
      rating,
      comment: comment.trim(),
      attributes,
      isAnonymous,
      wouldWorkWithAgain,
    })

    setCourse('')
    setInstructor('')
    setProject('')
    setRating(0)
    setComment('')
    setAttributes([])
    setIsAnonymous(false)
    setWouldWorkWithAgain(false)
    setVerified(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit Review for {student.firstName} {student.lastName}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <input
              id="course"
              type="text"
              placeholder="e.g., CS124, CS220"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              list="courseList"
            />
            <datalist id="courseList">
              <option value="CS101" />
              <option value="CS124" />
              <option value="CS220" />
              <option value="ENG200" />
              <option value="MATH200" />
              <option value="STAT310" />
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Professor</label>
            <input
              id="instructor"
              type="text"
              placeholder="e.g., Professor David Deng"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project">Project</label>
            <input
              id="project"
              type="text"
              placeholder="e.g., Web Crawler"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Star Rating *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-button ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  ⭐
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-display">{rating} out of 5 stars</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comments</label>
            <textarea
              id="comment"
              placeholder="Share your experience working with this student..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Select Attributes</label>
            <div className="chip-grid">
              {attributeOptions.map((attr) => (
                <button
                  key={attr}
                  className={`chip ${attributes.includes(attr) ? 'selected' : ''}`}
                  onClick={() => handleToggleAttribute(attr)}
                  type="button"
                >
                  {attr}
                </button>
              ))}
            </div>
          </div>

          <div className="checkbox">
            <div className="form-group">
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={wouldWorkWithAgain}
                  onChange={(e) => setWouldWorkWithAgain(e.target.checked)}
                />
                <span>Would you work with them again?</span>
              </label>
            </div>

            <div className="form-group">
              <label className="anonymous-checkbox">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span>Submit this review anonymously</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="verification-checkbox">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />
              <span>I verify that I worked with this student on a group project.</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`submit-button ${isFormValid ? '' : 'disabled'}`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  )
}
