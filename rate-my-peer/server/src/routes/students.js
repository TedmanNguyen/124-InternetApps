import { Router } from 'express'
import Student from '../models/Student.js'
import Review from '../models/Review.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'
import { HttpError } from '../middleware/errorHandler.js'

const router = Router()

// Aggregate { studentId: { averageRating, reviewCount, topAttributes } } for a list of ids.
async function summarize(studentIds) {
  if (studentIds.length === 0) return new Map()
  const agg = await Review.aggregate([
    { $match: { reviewee: { $in: studentIds }, isDeleted: false } },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        attributes: { $push: '$attributes' },
      },
    },
  ])
  const map = new Map()
  for (const row of agg) {
    const counts = {}
    for (const arr of row.attributes) {
      for (const attr of arr) counts[attr] = (counts[attr] || 0) + 1
    }
    const topAttributes = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([a]) => a)
    map.set(String(row._id), {
      averageRating: Number((row.averageRating || 0).toFixed(1)),
      reviewCount: row.reviewCount,
      topAttributes,
    })
  }
  return map
}

// GET /api/students?q=...   List/search students by name or email, with rating summary.
router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim()
  let filter = {}
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter = { $or: [{ firstName: rx }, { lastName: rx }, { email: rx }] }
  }
  const students = await Student.find(filter).sort({ firstName: 1, lastName: 1 }).limit(100)
  const summary = await summarize(students.map((s) => s._id))
  res.json({
    students: students.map((s) => ({
      ...s.toPublic(),
      averageRating: summary.get(String(s._id))?.averageRating ?? 0,
      reviewCount: summary.get(String(s._id))?.reviewCount ?? 0,
      topAttributes: summary.get(String(s._id))?.topAttributes ?? [],
    })),
  })
})

// GET /api/students/email/:email
router.get('/email/:email', async (req, res) => {
  const student = await Student.findOne({ email: req.params.email.toLowerCase() })
  if (!student) throw new HttpError(404, 'Student not found')
  const summary = await summarize([student._id])
  const s = summary.get(String(student._id))
  res.json({
    student: {
      ...student.toPublic(),
      averageRating: s?.averageRating ?? 0,
      reviewCount: s?.reviewCount ?? 0,
      topAttributes: s?.topAttributes ?? [],
    },
  })
})

// GET /api/students/name/:name   — returns array (multiple students can share a name)
router.get('/name/:name', async (req, res) => {
  const rx = new RegExp(escapeRegex(req.params.name.trim()), 'i')
  const students = await Student.find({ $or: [{ firstName: rx }, { lastName: rx }] })
    .sort({ firstName: 1, lastName: 1 })
    .limit(100)
  const summary = await summarize(students.map((s) => s._id))
  res.json({
    students: students.map((s) => ({
      ...s.toPublic(),
      averageRating: summary.get(String(s._id))?.averageRating ?? 0,
      reviewCount: summary.get(String(s._id))?.reviewCount ?? 0,
      topAttributes: summary.get(String(s._id))?.topAttributes ?? [],
    })),
  })
})

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id)
  if (!student) throw new HttpError(404, 'Student not found')
  const summary = await summarize([student._id])
  const s = summary.get(String(student._id))
  res.json({
    student: {
      ...student.toPublic(),
      averageRating: s?.averageRating ?? 0,
      reviewCount: s?.reviewCount ?? 0,
      topAttributes: s?.topAttributes ?? [],
    },
  })
})

// POST /api/students   Create a "peer" profile (no password). Must be logged in.
// Used by CreatePeerModal when a teammate isn't in the system yet.
router.post('/', requireAuth, async (req, res) => {
  const { firstName, lastName, email, major, school, graduationYear } = req.body || {}
  if (!firstName || !lastName || !email || !major) {
    throw new HttpError(400, 'firstName, lastName, email, major required')
  }
  const exists = await Student.findOne({ email: String(email).toLowerCase() })
  if (exists) {
    return res.status(409).json({ error: 'Email already registered', student: exists.toPublic() })
  }
  const student = await Student.create({
    firstName,
    lastName,
    email,
    major,
    school: school || 'UC Irvine',
    graduationYear: graduationYear || new Date().getFullYear() + 2,
  })
  res.status(201).json({ student: student.toPublic() })
})

// PATCH /api/students/:id   Update own profile.
router.patch('/:id', requireAuth, async (req, res) => {
  if (String(req.user._id) !== req.params.id && !req.user.isAdmin) {
    throw new HttpError(403, 'Cannot edit another user')
  }
  const allowed = ['firstName', 'lastName', 'school', 'major', 'graduationYear', 'profilePic']
  const updates = Object.fromEntries(
    Object.entries(req.body || {}).filter(([k]) => allowed.includes(k)),
  )
  const student = await Student.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
  if (!student) throw new HttpError(404, 'Student not found')
  res.json({ student: student.toPublic() })
})

// GET /api/students/:id/reviews   Reviews this student has received.
router.get('/:id/reviews', optionalAuth, async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.id, isDeleted: false }).sort({
    createdAt: -1,
  })
  res.json({ reviews: reviews.map((r) => r.toPublic(req.user?._id)) })
})

// GET /api/students/:id/reviews/given   Reviews this student has written.
router.get('/:id/reviews/given', optionalAuth, async (req, res) => {
  const reviews = await Review.find({ reviewer: req.params.id, isDeleted: false }).sort({
    createdAt: -1,
  })
  res.json({ reviews: reviews.map((r) => r.toPublic(req.user?._id)) })
})

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default router
