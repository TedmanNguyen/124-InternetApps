import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Layout() {
  const navigate = useNavigate()

  const handleSearch = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-row">
          <NavLink to="/" className="brand">
            Rate My Peer
          </NavLink>

          <div className="header-links">
            <NavLink to="/" end>
              Search
            </NavLink>
            <NavLink to="/student/123">Profile</NavLink>
            <button type="button" className="ghost-button">
              Logout
            </button>
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

