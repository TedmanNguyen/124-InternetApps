import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useStudents } from '../context/StudentContext'

export default function Layout() {
  const navigate = useNavigate()
  const { userIsAdmin, currentUser, logout } = useStudents()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-row">
          <NavLink to="/" className="brand" onClick={closeMenu}>
            Rate My Peer
          </NavLink>

          <button
            type="button"
            className="hamburger"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`header-links${menuOpen ? ' open' : ''}`}>
            {userIsAdmin() && (
              <NavLink to="/admin-dashboard" className="header-link" onClick={closeMenu}>
                Admin Dashboard
              </NavLink>
            )}
            <NavLink to="/" end className="header-link" onClick={closeMenu}>
              Search
            </NavLink>
            <NavLink to="/help" end className="header-link" onClick={closeMenu}>
              Help
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to={`/student/${currentUser.id}`} className="header-link" onClick={closeMenu}>
                  Profile
                </NavLink>
                <button type="button" className="ghost-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="header-link" onClick={closeMenu}>
                Login
              </NavLink>
            )}
          </nav>
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
