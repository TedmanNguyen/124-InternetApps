import { useEffect, useState } from 'react'
import reportStatus from '../data/reportStatus'
import ReviewCard from './ReviewCard'
import { api } from '../api/client'
import { useAdmin } from '../context/AdminContext'
import { useReviews } from '../context/ReviewContext'
import '../styles/AdminCard.css'

// Renders one report alongside the offending review, with status cycling and a
// soft-delete-review action. Loads the linked review + reporter + reviewer
// lazily because the admin endpoint only sends ids.
export default function AdminCard({ report }) {
  const { updateReportStatus, removeReport } = useAdmin()
  const { removeReview } = useReviews()

  const [review, setReview] = useState(null)
  const [reporter, setReporter] = useState(null)
  const [reviewer, setReviewer] = useState(null)
  const [statusIdx, setStatusIdx] = useState(Math.max(0, reportStatus.indexOf(report.status)))
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.students.get(report.reporterId).then((r) => !cancelled && setReporter(r.student)).catch(() => {})
    // We don't have a single-review endpoint, so pull received-reviews for the reviewee
    // wouldn't help here. Instead, use the all-reviews list cache (set in ReviewsView) —
    // but to keep AdminCard self-sufficient, fetch the review-context cache through a getter.
    // Simplest: hit /api/students/:id/reviews for the reviewer and find it. To avoid that,
    // we expose minimal review fields directly here by fetching the review via the
    // server's listAll filtered by id is overkill; instead, lean on the cached reviewsById
    // from ReviewContext (parent ReportsView fetches the review when it renders the page).
    return () => { cancelled = true }
  }, [report.reporterId])

  // Pull the review through the admin list endpoint; it's already cached if loaded.
  const { reviewsById, fetchAllReviews } = useReviews()
  useEffect(() => {
    if (reviewsById[report.reviewId]) {
      setReview(reviewsById[report.reviewId])
      return
    }
    let cancelled = false
    fetchAllReviews()
      .then((reviews) => {
        if (!cancelled) setReview(reviews.find((r) => r.id === report.reviewId) ?? null)
      })
      .catch(() => {
        if (!cancelled) setReview(null)
      })
    return () => { cancelled = true }
  }, [report.reviewId, fetchAllReviews])

  useEffect(() => {
    if (!review?.reviewerId) return
    let cancelled = false
    api.students.get(review.reviewerId).then((r) => !cancelled && setReviewer(r.student)).catch(() => {})
    return () => { cancelled = true }
  }, [review?.reviewerId])

  if (hidden) return null
  if (!review) return <div className="admin-card"><p className="muted">Loading review…</p></div>
  if (review.isDeleted) return null

  const cycleStatus = async () => {
    const nextIdx = (statusIdx + 1) % reportStatus.length
    setStatusIdx(nextIdx)
    try {
      await updateReportStatus(report.id, reportStatus[nextIdx])
    } catch (e) {
      // roll back on failure
      setStatusIdx(statusIdx)
      alert(e.message)
    }
  }

  const handleDeleteReview = async () => {
    try {
      await removeReview(review.id)
      setHidden(true)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="admin-card">
      <ReviewCard review={review} />
      <div className="report-details">
        <h3>Report ID: {report.id}</h3>
        <div className="emails-and-id">
          <p><strong>Reviewer Email:</strong> {reviewer?.email ?? '…'}</p>
          <p><strong>Reporter Email:</strong> {reporter?.email ?? '…'}</p>
          <p><strong>Review ID:</strong> {report.reviewId}</p>
        </div>
        <p><strong>Reason:</strong> {report.reason}</p>
        <p><strong>Details:</strong> {report.details}</p>
        <div className="status-container">
          <p><strong>Status:</strong></p>
          <button
            className={`status-badge status-${reportStatus[statusIdx].toLowerCase().replace(' ', '-')}`}
            onClick={cycleStatus}
          >
            {reportStatus[statusIdx]}
          </button>
        </div>
        <div className="bottom-row-admin-card">
          <div className="dates">
            <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
          </div>
          <button className="delete-review-button" onClick={handleDeleteReview}>
            Delete Review
          </button>
        </div>
      </div>
    </div>
  )
}
