export function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

// Centralised error handler. Routes throw and this responds.
export function errorHandler(err, req, res, next) {
  // Mongoose validation
  if (err.name === 'ValidationError') {
    const fields = Object.fromEntries(
      Object.entries(err.errors).map(([k, v]) => [k, v.message]),
    )
    return res.status(400).json({ error: 'Validation failed', fields })
  }

  // Duplicate key (e.g. email already in use)
  if (err.code === 11000) {
    const key = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({ error: `Duplicate ${key}` })
  }

  // Cast errors (bad ObjectId in URL)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const status = err.status || 500
  const message = err.message || 'Internal server error'
  if (status >= 500) console.error('[error]', err)
  res.status(status).json({ error: message })
}

// Throw this from routes for clean 4xx responses.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
