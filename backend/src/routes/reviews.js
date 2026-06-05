import { Router } from 'express'
import Review from '../models/Review.js'
import Student from '../models/Student.js'
import { requireAuth, optionalAuth, requireAdmin } from '../middleware/auth.js'
import { HttpError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/reviews?q=...&role=reviewer,reviewee   Admin-only global list.
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase()
  const roles = (req.query.role || 'reviewer,reviewee').split(',').map((r) => r.trim())

  let reviews = await Review.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(500)

  if (q) {
    const ids = await Student.find({
      $or: [
        { firstName: new RegExp(escapeRegex(q), 'i') },
        { lastName: new RegExp(escapeRegex(q), 'i') },
        { email: new RegExp(escapeRegex(q), 'i') },
      ],
    }).select('_id')
    const idSet = new Set(ids.map((s) => String(s._id)))
    reviews = reviews.filter((r) => {
      const reviewerMatch = roles.includes('reviewer') && idSet.has(String(r.reviewer))
      const revieweeMatch = roles.includes('reviewee') && idSet.has(String(r.reviewee))
      return reviewerMatch || revieweeMatch
    })
  }

  res.json({ reviews: reviews.map((r) => r.toPublic(req.user._id)) })
})

// POST /api/reviews   Create a review.
router.post('/', requireAuth, async (req, res) => {
  const { revieweeId, course, instructor, project, rating, comment, attributes, isAnonymous, wouldWorkWithAgain } =
    req.body || {}
  if (!revieweeId || !course || !rating) throw new HttpError(400, 'revieweeId, course, rating required')

  const review = await Review.create({
    reviewee: revieweeId,
    reviewer: req.user._id,
    course,
    instructor: instructor || '',
    project: project || '',
    rating: Number(rating),
    comment: comment || '',
    attributes: Array.isArray(attributes) ? attributes : [],
    isAnonymous: !!isAnonymous,
    wouldWorkWithAgain: !!wouldWorkWithAgain,
  })

  res.status(201).json({ review: review.toPublic(req.user._id) })
})

// DELETE /api/reviews/:id   Soft delete. Author or admin only.
router.delete('/:id', requireAuth, async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw new HttpError(404, 'Review not found')
  const isAuthor = String(review.reviewer) === String(req.user._id)
  if (!isAuthor && !req.user.isAdmin) throw new HttpError(403, 'Cannot delete this review')

  review.isDeleted = true
  await review.save()
  res.json({ ok: true })
})

// POST /api/reviews/:id/vote  { value: 'up' | 'down' | 'clear' }   Toggle a vote.
router.post('/:id/vote', requireAuth, async (req, res) => {
  const { value } = req.body || {}
  if (!['up', 'down', 'clear'].includes(value)) throw new HttpError(400, 'value must be up, down, or clear')

  const review = await Review.findById(req.params.id)
  if (!review || review.isDeleted) throw new HttpError(404, 'Review not found')

  const userId = req.user._id
  const idEq = (id) => String(id) === String(userId)

  review.upvotes = review.upvotes.filter((id) => !idEq(id))
  review.downvotes = review.downvotes.filter((id) => !idEq(id))
  if (value === 'up') review.upvotes.push(userId)
  if (value === 'down') review.downvotes.push(userId)

  await review.save()
  res.json({ review: review.toPublic(userId) })
})

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default router
