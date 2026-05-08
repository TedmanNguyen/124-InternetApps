import { createContext, useContext, useMemo, useState } from 'react'
import { mockStudents } from '../data/mockStudents'
import { addReview as pushReview } from '../data/mockReviews'
import { admins } from '../data/admins'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(mockStudents)
  const [loggedInUserId, setLoggedInUserId] = useState('123') // John Doe is logged in by default

  const addReview = ({ studentId, course, instructor, project, rating, comment, attributes, isAnonymous }) => {
    const newReview = {
      id: `r-${Date.now()}`,
      revieweeId: studentId,
      reviewerId: loggedInUserId,
      course,
      instructor,
      project,
      rating,
      upvotes: [],
      downvotes: [],
      comment,
      attributes,
      createdAt: new Date(),
      isDeleted: false,
      isAnonymous: Boolean(isAnonymous),
    }

    pushReview(newReview)
  }

  const addStudent = ({ firstName, lastName, email, major }) => {
    const newStudent = {
      id: `stu-${Date.now()}`,
      firstName,
      lastName,
      email,
      major,
      school: 'UC Irvine', // Default school
      graduationYear: new Date().getFullYear() + 2, // Default 2 years from now
      profilePic: null,
      reviews: [],
    }

    setStudents((previousStudents) => [...previousStudents, newStudent])
    return newStudent
  }

  const value = useMemo(
    () => ({
      students,
      addReview,
      addStudent,
      loggedInUserId,
      setLoggedInUserId,
      getStudentById: (studentId) =>
        students.find((student) => student.id === studentId),
      getStudentByEmail: (email) =>
        students.find((student) => student.email.toLowerCase() === email.toLowerCase()),
      getLoggedInUser: () =>
        students.find((student) => student.id === loggedInUserId),
      userIsAdmin: () => admins.includes(loggedInUserId), // John Doe is the admin
    }),
    [students, loggedInUserId],
  )

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentContext)

  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider')
  }

  return context
}

