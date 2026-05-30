import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useStudents } from '../context/StudentContext'

export default function Layout() {
  const navigate = useNavigate()
  const { userIsAdmin, currentUser, logout } = useStudents()

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-row">
          <NavLink to="/" className="brand">
            Rate My Peer
          </NavLink>

          <div className="header-links">
            {userIsAdmin() && (
              <NavLink to="/admin-dashboard" className="header-link">
                Admin Dashboard
              </NavLink>
            )}
            <NavLink to="/" end className="header-link">
              Search
            </NavLink>
            <NavLink to="/help" end className="header-link">
              Help
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to={`/student/${currentUser.id}`} className="header-link">
                  Profile
                </NavLink>
                <button type="button" className="ghost-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="header-link">
                Login
              </NavLink>
            )}
          </div>
        </div>

        <SearchBar
          placeholder="Search classmates by name or email"
          buttonLabel="Find"
          onSearch={handleSearch}
        />
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Built for collaborative project accountability.
      </footer>
    </div>
  )
}
