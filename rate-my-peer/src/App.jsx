import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import HelpPage from './pages/HelpPage'
import SearchResultsPage from './pages/SearchResultsPage'
import WriteReviewPage from './pages/WriteReviewPage'
import AdminDashboard from './pages/AdminDashboard'
import ReportsView from './pages/ReportsView'
import ReviewsView from './pages/ReviewsView'
import ProtectedRoute from './components/ProtectedRoute'
import { useStudents } from './context/StudentContext'

function App() {
  const { authChecked } = useStudents()

  // Avoid a flicker where /admin-dashboard briefly redirects to / for a logged-in admin
  // before the session is restored from the token.
  if (!authChecked) return null

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/student/:studentId" element={<ProfilePage />} />
        <Route
          path="/student/:studentId/review"
          element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="reports" replace />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="reviews" element={<ReviewsView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
