import { createContext, useContext, useMemo, useState } from 'react'
import { mockStudents } from '../data/mockStudents'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(mockStudents)

  const addReview = ({ studentId, course, rating, comment, attributes }) => {
    const newReview = {
      id: `r-${Date.now()}`,
      course,
      rating,
      comment,
      attributes,
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
      getStudentById: (studentId) =>
        students.find((student) => student.id === studentId),
    }),
    [students],
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

