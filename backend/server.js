import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'

import { connectDb } from './src/config/db.js'
import authRoutes from './src/routes/auth.js'
import studentRoutes from './src/routes/students.js'
import reviewRoutes from './src/routes/reviews.js'
import reportRoutes from './src/routes/reports.js'
import faqRoutes from './src/routes/faqs.js'
import { errorHandler, notFound } from './src/middleware/errorHandler.js'

const app = express()

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS blocked: ${origin}`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/faqs', faqRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
