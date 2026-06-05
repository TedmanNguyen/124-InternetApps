import { Router } from 'express'
import Student from '../models/Student.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { HttpError } from '../middleware/errorHandler.js'

const router = Router()

// POST /api/auth/signup  { firstName, lastName, email, password, major? }
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, major } = req.body || {}
  if (!firstName || !lastName || !email || !password) {
    throw new HttpError(400, 'firstName, lastName, email, password required')
  }
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters')

  const exists = await Student.findOne({ email: email.toLowerCase() })
  if (exists) {
    if (exists.passwordHash !== null) throw new HttpError(409, 'Email already registered')

    // Peer-only profile — claim it by setting credentials and updating info.
    exists.firstName = firstName
    exists.lastName = lastName
    exists.major = major || exists.major
    await exists.setPassword(password)
    await exists.save()

    const token = signToken(exists)
    return res.status(200).json({ token, user: exists.toPublic() })
  }

  const student = new Student({
    firstName,
    lastName,
    email,
    major: major || 'Undeclared',
  })
  await student.setPassword(password)
  await student.save()

  const token = signToken(student)
  res.status(201).json({ token, user: student.toPublic() })
})

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) throw new HttpError(400, 'email and password required')

  const student = await Student.findOne({ email: String(email).toLowerCase() })
  if (!student) throw new HttpError(401, 'Invalid email or password')

  const ok = await student.verifyPassword(password)
  if (!ok) throw new HttpError(401, 'Invalid email or password')

  const token = signToken(student)
  res.json({ token, user: student.toPublic() })
})

// GET /api/auth/me — returns the user behind the bearer token.
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user.toPublic() })
})

export default router
