import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import ProfilePage from './pages/ProfilePage'
import SearchResultsPage from './pages/SearchResultsPage'
import WriteReviewPage from './pages/WriteReviewPage'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/student/:studentId" element={<ProfilePage />} />
        <Route path="/student/:studentId/review" element={<WriteReviewPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
