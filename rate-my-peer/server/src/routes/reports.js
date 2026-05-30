import { Router } from 'express'
import Report, { REPORT_STATUSES } from '../models/Report.js'
import Review from '../models/Review.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { HttpError } from '../middleware/errorHandler.js'

const router = Router()

// GET /api/reports?status=Pending,Under%20Review   Admin only.
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const statuses = (req.query.status || REPORT_STATUSES.join(','))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const reports = await Report.find({ status: { $in: statuses } }).sort({ createdAt: -1 }).limit(500)
  res.json({ reports: reports.map((r) => r.toPublic()) })
})

// POST /api/reports   File a report against a review.
router.post('/', requireAuth, async (req, res) => {
  const { reviewId, reason, details } = req.body || {}
  if (!reviewId || !reason) throw new HttpError(400, 'reviewId and reason required')

  const review = await Review.findById(reviewId)
  if (!review || review.isDeleted) throw new HttpError(404, 'Review not found')

  const report = await Report.create({
    reporter: req.user._id,
    review: reviewId,
    reason,
    details: details || '',
  })
  res.status(201).json({ report: report.toPublic() })
})

// PATCH /api/reports/:id   Update status. Admin only.
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body || {}
  if (!REPORT_STATUSES.includes(status)) throw new HttpError(400, 'Invalid status')

  const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!report) throw new HttpError(404, 'Report not found')
  res.json({ report: report.toPublic() })
})

// DELETE /api/reports/:id   Admin only.
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const ok = await Report.findByIdAndDelete(req.params.id)
  if (!ok) throw new HttpError(404, 'Report not found')
  res.json({ ok: true })
})

export default router
