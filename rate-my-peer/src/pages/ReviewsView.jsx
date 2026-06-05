import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard'
import SearchBar from '../components/SearchBar'
import { useReviews } from '../context/ReviewContext'
import { useStudents } from '../context/StudentContext'
import { api } from '../api/client'
import '../styles/ReviewsView.css'

// Admin-only review browser. Filters by role (reviewer / reviewee) and free text.
export default function ReviewsView() {
  const { currentUser, loggedInUserId } = useStudents()
  const { fetchAllReviews, removeReview } = useReviews()

  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const [reviewRole, setReviewRole] = useState({ reviewer: true, reviewee: true })

  const [reviews, setReviews] = useState([])
  const [revieweesById, setRevieweesById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Refetch when search or role filter changes — backend does the heavy lifting.
  useEffect(() => {
    // if (!currentUser?.isAdmin) return
    let cancelled = false
    setLoading(true)
    fetchAllReviews({
      ...(query ? { q: query } : {}),
      role: Object.entries(reviewRole)
        .filter(([, on]) => on)
        .map(([k]) => k)
        .join(','),
    })
      .then(async (data) => {
        if (cancelled) return
        setReviews(data)
        // Hydrate reviewee names — they're rendered in the bottom row of each card.
        const ids = [...new Set(data.map((r) => r.revieweeId))]
        const missing = ids.filter((id) => !revieweesById[id])
        if (missing.length) {
          const fetched = await Promise.all(missing.map((id) => api.students.get(id).then((r) => r.student).catch(() => null)))
          if (cancelled) return
          setRevieweesById((prev) => {
            const next = { ...prev }
            fetched.forEach((s) => { if (s) next[s.id] = s })
            return next
          })
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [currentUser, query, reviewRole, fetchAllReviews]) // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => reviews.filter((r) => !r.isDeleted), [reviews])

  if (!currentUser?.isAdmin) return <p className="empty-state">Admin only.</p>

  return (
    <section className="page reviews-view">
      <SearchBar
        defaultValue={query}
        buttonLabel="Search peers"
        onSearch={(term) => {
          if (term) setSearchParams({ q: term }, { replace: true })
          else setSearchParams({}, { replace: true })
        }}
      />
      <ReviewFilter reviewRole={reviewRole} setReviewRole={setReviewRole} />

      {loading && <p className="muted">Loading reviews…</p>}
      {error && <p className="empty-state">{error}</p>}

      {visible.map((review) => {
        const reviewee = revieweesById[review.revieweeId]
        return (
          <div className="review-card-container" key={review.id}>
            <ReviewCard review={review} currentUserId={loggedInUserId} />
            <div className="bottom-row">
              <span>
                <strong>
                  Reviewee: {reviewee ? `${reviewee.firstName} ${reviewee.lastName}` : '…'}
                </strong>
              </span>
              <button
                className="delete-review-button"
                onClick={async () => {
                  await removeReview(review.id)
                  setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, isDeleted: true } : r)))
                }}
              >
                Delete Review
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}

function ReviewFilter({ reviewRole, setReviewRole }) {
  const toggleRole = (role) => setReviewRole((prev) => ({ ...prev, [role]: !prev[role] }))

  return (
    <div className="review-filter">
      <span><strong>Filter by Role:</strong></span>
      <button
        className={`filter-button ${reviewRole.reviewer ? 'active' : ''}`}
        onClick={() => toggleRole('reviewer')}
      >
        Reviewer
      </button>
      <button
        className={`filter-button ${reviewRole.reviewee ? 'active' : ''}`}
        onClick={() => toggleRole('reviewee')}
      >
        Reviewee
      </button>
    </div>
  )
}
