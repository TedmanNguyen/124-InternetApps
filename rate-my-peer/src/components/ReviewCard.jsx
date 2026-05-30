import { useEffect, useState } from 'react'
import AttributeTag from './AttributeTag'
import thumbsUp from '../assets/thumbs-up-navy.svg'
import thumbsUpFilled from '../assets/thumbs-up-filled-navy.svg'
import thumbsDown from '../assets/thumbs-down-navy.svg'
import thumbsDownFilled from '../assets/thumbs-down-filled-navy.svg'
import { reportReasons } from '../data/reportStatus'
import { useReviews } from '../context/ReviewContext'
import { useAdmin } from '../context/AdminContext'
import { useStudents } from '../context/StudentContext'
import { api } from '../api/client'
import '../styles/ReviewCard.css'

// `review` is the API-shaped object (see Review.toPublic on the server):
//   { id, reviewerId, reviewerId is null when isAnonymous, upvoteCount, userUpvoted, ... }
export default function ReviewCard({ review, currentUserId }) {
  const { voteReview } = useReviews()
  const { createReport } = useAdmin()
  const { getStudentById } = useStudents()

  const [local, setLocal] = useState(review)
  const [showReportModal, setShowReportModal] = useState(false)

  // Keep local in sync if a parent re-fetches.
  useEffect(() => setLocal(review), [review])

  if (local.isDeleted) return null

  const createdAt = formatDate(local.createdAt)
  const reviewer = !local.isAnonymous && local.reviewerId ? getStudentById(local.reviewerId) : null
  const [reviewerFallback, setReviewerFallback] = useState(null)

  // Reviewer may not be in the cached students list (e.g. admin view) — fetch on demand.
  useEffect(() => {
    if (local.isAnonymous || !local.reviewerId || reviewer || reviewerFallback) return
    let cancelled = false
    api.students.get(local.reviewerId).then(({ student }) => {
      if (!cancelled) setReviewerFallback(student)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [local.isAnonymous, local.reviewerId, reviewer, reviewerFallback])

  const displayReviewer = reviewer || reviewerFallback

  const handleVote = async (value) => {
    const next = await voteReview(local.id, value)
    setLocal(next)
  }

  const onUpvoteClick = () => handleVote(local.userUpvoted ? 'clear' : 'up')
  const onDownvoteClick = () => handleVote(local.userDownvoted ? 'clear' : 'down')

  return (
    <article className="review-item">
      <header className="review-header">
        <div className="left-side-header">
          <div className="reviewer-info">
            {!local.isAnonymous && displayReviewer ? (
              <>
                <div className="avatar">{displayReviewer.firstName[0]}{displayReviewer.lastName[0]}</div>
                <strong>{`${displayReviewer.firstName} ${displayReviewer.lastName}`}</strong>
              </>
            ) : (
              <>
                <div className="avatar">?</div>
                <strong>Anonymous</strong>
              </>
            )}
          </div>
        </div>
        <span>{local.course} - {local.instructor} - {local.project}</span>
        <span>{local.rating}.0 / 5</span>
      </header>
      <p className="review-comment">{local.comment}</p>
      <p>
        <i>Would work with again: </i>
        <strong>{local.wouldWorkWithAgain !== undefined ? (local.wouldWorkWithAgain ? 'Yes' : 'No') : null}</strong>
      </p>
      <div className="review-card-footer">
        <div className="tag-row">
          <span className="review-date">{createdAt}</span>
          {local.attributes.map((attribute) => (
            <AttributeTag key={`${local.id}-${attribute}`} label={attribute} />
          ))}
        </div>
        {currentUserId && (
          <div className="upvote-downvote-container">
            <button className="vote-button" onClick={onUpvoteClick}>
              <img src={local.userUpvoted ? thumbsUpFilled : thumbsUp} alt="Upvote" width={25} height={25} /> {local.upvoteCount}
            </button>
            <button className="vote-button" onClick={onDownvoteClick}>
              <img src={local.userDownvoted ? thumbsDownFilled : thumbsDown} alt="Downvote" width={25} height={25} /> {local.downvoteCount}
            </button>
            <button className="report-button" onClick={() => setShowReportModal(true)}>Report</button>
          </div>
        )}
      </div>
      {showReportModal && (
        <ReportReviewModal
          review={local}
          createReport={createReport}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </article>
  )
}

function ReportReviewModal({ review, createReport, onClose }) {
  const [reason, setReason] = useState(reportReasons[0])
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState(null)

  const isValid = reason && details.trim().length > 0 && !submitting

  const handleSubmit = async () => {
    if (!isValid) return
    setSubmitting(true)
    setErr(null)
    try {
      await createReport({ reviewId: review.id, reason, details: details.trim() })
      onClose()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Review</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="report-reason">Reason</label>
            <select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              {reportReasons.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="report-details">Details</label>
            <textarea
              id="report-details"
              rows={4}
              placeholder="Add context for the moderation team..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {err && <p className="error-message">{err}</p>}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button
            className={`submit-button ${isValid ? '' : 'disabled'}`}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

function formatDate(raw) {
  if (!raw) return ''
  const d = raw instanceof Date ? raw : new Date(raw)
  if (isNaN(d.getTime())) return ''
  return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
}
