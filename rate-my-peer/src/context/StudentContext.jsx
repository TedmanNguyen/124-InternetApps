import { createContext, useContext, useMemo, useState } from 'react'
import { mockStudents } from '../data/mockStudents'
import { admins } from '../data/admins'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(mockStudents)
  const [loggedInUserId, setLoggedInUserId] = useState('124') // John Doe is logged in by default

  const addReview = ({ studentId, course, rating, comment, attributes, isAnonymous }) => {
    const newReview = {
      id: `r-${Date.now()}`,
      course,
      rating,
      comment,
      attributes,
      isAnonymous: isAnonymous || false,
    }

    setStudents((previousStudents) =>
      previousStudents.map((student) => {
        if (student.id !== studentId) {
          return student
        }

        return {
          ...student,
          reviews: [newReview, ...student.reviews],
        }
      }),
    )
  }

  const value = useMemo(
    () => ({
      students,
      addReview,
      loggedInUserId,
      setLoggedInUserId,
      getStudentById: (studentId) =>
        students.find((student) => student.id === studentId),
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

