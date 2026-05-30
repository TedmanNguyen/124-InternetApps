import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api } from '../api/client'

// Lazy-loaded review store. Pages call the fetch helpers in their own
// useEffect; results are cached by reviewId so re-renders don't refetch.
const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const [byId, setById] = useState({}) // { [reviewId]: review }

  const cacheMany = useCallback((reviews) => {
    setById((prev) => {
      const next = { ...prev }
      reviews.forEach((r) => {
        next[r.id] = r
      })
      return next
    })
  }, [])

  const fetchReviewsForStudent = useCallback(
    async (studentId) => {
      const { reviews } = await api.students.reviewsReceived(studentId)
      cacheMany(reviews)
      return reviews
    },
    [cacheMany],
  )

  const fetchReviewsGivenBy = useCallback(
    async (studentId) => {
      const { reviews } = await api.students.reviewsGiven(studentId)
      cacheMany(reviews)
      return reviews
    },
    [cacheMany],
  )

  const fetchAllReviews = useCallback(
    async (params = {}) => {
      const { reviews } = await api.reviews.listAll(params)
      cacheMany(reviews)
      return reviews
    },
    [cacheMany],
  )

  const createReview = useCallback(
    async (payload) => {
      const { review } = await api.reviews.create(payload)
      cacheMany([review])
      return review
    },
    [cacheMany],
  )

  const removeReview = useCallback(async (reviewId) => {
    await api.reviews.remove(reviewId)
    setById((prev) => {
      if (!prev[reviewId]) return prev
      return { ...prev, [reviewId]: { ...prev[reviewId], isDeleted: true } }
    })
  }, [])

  // value: 'up' | 'down' | 'clear'. Returns the updated review.
  const voteReview = useCallback(
    async (reviewId, value) => {
      const { review } = await api.reviews.vote(reviewId, value)
      cacheMany([review])
      return review
    },
    [cacheMany],
  )

  const value = useMemo(
    () => ({
      reviewsById: byId,
      getReview: (id) => byId[id] || null,
      fetchReviewsForStudent,
      fetchReviewsGivenBy,
      fetchAllReviews,
      createReview,
      removeReview,
      voteReview,
    }),
    [byId, fetchReviewsForStudent, fetchReviewsGivenBy, fetchAllReviews, createReview, removeReview, voteReview],
  )

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviews must be used within a ReviewProvider')
  return ctx
}
