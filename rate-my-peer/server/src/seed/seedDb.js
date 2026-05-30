import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDb } from '../config/db.js'
import Student from '../models/Student.js'
import Review from '../models/Review.js'
import Report from '../models/Report.js'

// Run with: npm run seed
// Wipes and re-creates the three demo students, their reviews, and one report.
// Default password for every demo account: "password123".

async function run() {
  await connectDb()

  await Promise.all([Student.deleteMany({}), Review.deleteMany({}), Report.deleteMany({})])

  const john = new Student({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.edu',
    school: 'UC Irvine',
    major: 'Computer Science',
    graduationYear: 2024,
    isAdmin: true,
  })
  await john.setPassword('password123')

  const maya = new Student({
    firstName: 'Maya',
    lastName: 'Patel',
    email: 'maya.patel@school.edu',
    school: 'UC Berkeley',
    major: 'Software Engineering',
    graduationYear: 2025,
  })
  await maya.setPassword('password123')

  const leo = new Student({
    firstName: 'Leo',
    lastName: 'Garcia',
    email: 'leo.garcia@school.edu',
    school: 'Stanford University',
    major: 'Data Science',
    graduationYear: 2026,
  })
  await leo.setPassword('password123')

  await Student.insertMany([john, maya, leo])

  const reviews = await Review.insertMany([
    {
      reviewee: john._id,
      reviewer: maya._id,
      course: 'CS101',
      instructor: 'Dr. Ava Lane',
      project: 'Sprint Planning',
      rating: 5,
      comment: 'Led our sprint planning and helped everyone hit deadlines.',
      attributes: ['Leader', 'On Time', 'Strong Coder'],
      isAnonymous: false,
      wouldWorkWithAgain: true,
    },
    {
      reviewee: john._id,
      reviewer: leo._id,
      course: 'ENG200',
      instructor: 'Prof. Mei Kim',
      project: 'Client Presentation',
      rating: 2,
      comment: 'Hard to reach late in the project and missed two check-ins.',
      attributes: ['Absent'],
      isAnonymous: true,
      wouldWorkWithAgain: false,
    },
    {
      reviewee: maya._id,
      reviewer: leo._id,
      course: 'CS220',
      instructor: 'Dr. Aaron Chen',
      project: 'API Integration',
      rating: 4,
      comment: 'Excellent communication and clear pull request notes.',
      attributes: ['Good Communicator', 'Hard Worker'],
      isAnonymous: false,
      wouldWorkWithAgain: false,
    },
    {
      reviewee: maya._id,
      reviewer: john._id,
      course: 'CS220',
      instructor: 'Dr. Aaron Chen',
      project: 'Code Review Sprint',
      rating: 5,
      comment: "Consistently reviewed everyone's code and fixed blockers quickly.",
      attributes: ['Strong Coder', 'Leader', 'On Time'],
      isAnonymous: true,
      wouldWorkWithAgain: true,
    },
    {
      reviewee: leo._id,
      reviewer: john._id,
      course: 'MATH200',
      instructor: 'Prof. Elena Ortiz',
      project: 'Statistical Analysis',
      rating: 3,
      comment: 'Solid work quality, but needed reminders before handoff dates.',
      attributes: ['Hard Worker'],
      isAnonymous: false,
      wouldWorkWithAgain: false,
    },
    {
      reviewee: leo._id,
      reviewer: maya._id,
      course: 'STAT310',
      instructor: 'Dr. Priya Patel',
      project: 'Data Pipeline',
      rating: 4,
      comment: 'Great with data cleanup and quick to help teammates debug.',
      attributes: ['Strong Coder', 'Good Communicator'],
      isAnonymous: true,
      wouldWorkWithAgain: true,
    },
  ])

  await Report.create({
    reporter: john._id,
    review: reviews[2]._id,
    reason: 'Inappropriate Content',
    details: 'The comment contained offensive language that is not acceptable.',
    status: 'Under Review',
  })

  console.log('Seeded:')
  console.log('  students:', await Student.countDocuments())
  console.log('  reviews :', await Review.countDocuments())
  console.log('  reports :', await Report.countDocuments())
  console.log('\nLogin with:')
  console.log('  john.doe@school.edu  / password123   (admin)')
  console.log('  maya.patel@school.edu / password123')
  console.log('  leo.garcia@school.edu / password123')

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
