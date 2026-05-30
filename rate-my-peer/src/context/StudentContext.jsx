import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from '../api/client'

// Shape of the context value is intentionally close to the previous mock version
// so most existing components keep working with minor tweaks.
//
// students is an ARRAY of { id, firstName, lastName, email, school, major, ... }
// so .filter/.map in the pages still work.
const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([])
  const [currentUser, setCurrentUser] = useState(null) // null = logged out
  const [authChecked, setAuthChecked] = useState(false) // becomes true after first /me attempt
  const [studentsLoading, setStudentsLoading] = useState(true)
  const [studentsError, setStudentsError] = useState(null)

  // --- Initial load: restore session if a token is in storage, then fetch students ---
  useEffect(() => {
    let cancelled = false

    async function init() {
      if (getToken()) {
        try {
          const { user } = await api.auth.me()
          if (!cancelled) setCurrentUser(user)
        } catch {
          setToken(null) // bad/expired token
        }
      }
      if (!cancelled) setAuthChecked(true)

      try {
        const { students } = await api.students.list()
        if (!cancelled) setStudents(students)
      } catch (err) {
        if (!cancelled) setStudentsError(err.message)
      } finally {
        if (!cancelled) setStudentsLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  const refreshStudents = useCallback(async (q = '') => {
    const { students } = await api.students.list(q)
    setStudents(students)
    return students
  }, [])

  // --- Auth ---
  const login = useCallback(async (email, password) => {
    const { token, user } = await api.auth.login({ email, password })
    setToken(token)
    setCurrentUser(user)
    return user
  }, [])

  const signup = useCallback(async (payload) => {
    const { token, user } = await api.auth.signup(payload)
    setToken(token)
    setCurrentUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setCurrentUser(null)
  }, [])

  // --- Mutations ---
  const addReview = useCallback(async ({ studentId, ...rest }) => {
    const { review } = await api.reviews.create({ revieweeId: studentId, ...rest })
    return review
  }, [])

  const addStudent = useCallback(async ({ firstName, lastName, email, major }) => {
    const { student } = await api.students.create({ firstName, lastName, email, major })
    setStudents((prev) => [...prev, student])
    return student
  }, [])

  const value = useMemo(
    () => ({
      // data
      students,
      studentsLoading,
      studentsError,
      refreshStudents,

      // auth
      currentUser,
      authChecked,
      login,
      signup,
      logout,

      // back-compat with the old context surface
      loggedInUserId: currentUser?.id ?? null,
      getLoggedInUser: () => currentUser,
      userIsAdmin: () => !!currentUser?.isAdmin,
      getStudentById: (studentId) => students.find((s) => s.id === studentId),
      getStudentByEmail: (email) =>
        students.find((s) => s.email.toLowerCase() === String(email).toLowerCase()),

      // mutations
      addReview,
      addStudent,
    }),
    [
      students,
      studentsLoading,
      studentsError,
      refreshStudents,
      currentUser,
      authChecked,
      login,
      signup,
      logout,
      addReview,
      addStudent,
    ],
  )

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudents() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudents must be used within a StudentProvider')
  return ctx
}
