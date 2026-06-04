import { Navigate, useLocation } from 'react-router-dom'
import { useStudents } from '../context/StudentContext'

// Guards routes that require a logged-in user. If the session hasn't been
// restored yet we render nothing to avoid a flicker; once authChecked is true
// and there's still no user, redirect to /login (remembering where they were
// headed so we can send them back after a successful login).
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, authChecked, userIsAdmin } = useStudents()
  const location = useLocation()

  if (!authChecked) return null

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (adminOnly && !userIsAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}
