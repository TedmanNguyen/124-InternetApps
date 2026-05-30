import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'
import { HttpError } from './errorHandler.js'

export function signToken(student) {
  return jwt.sign(
    { sub: String(student._id), isAdmin: !!student.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

// Verify JWT and attach req.user (the Student doc). Throws 401 if missing or invalid.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new HttpError(401, 'Missing auth token')

  const payload = jwt.verify(token, process.env.JWT_SECRET)
  const user = await Student.findById(payload.sub)
  if (!user) throw new HttpError(401, 'User no longer exists')
  req.user = user
  next()
}

// Same as requireAuth but doesn't fail if there's no token — useful for endpoints
// that change shape per user (e.g. returning userUpvoted on reviews).
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await Student.findById(payload.sub)
  } catch {
    // ignore — treat as anonymous
  }
  next()
}

export function requireAdmin(req, res, next) {
  if (!req.user) throw new HttpError(401, 'Auth required')
  if (!req.user.isAdmin) throw new HttpError(403, 'Admin only')
  next()
}
