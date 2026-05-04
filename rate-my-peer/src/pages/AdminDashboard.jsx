import pullReports from "../data/mockReports"
import AdminCard from "../components/AdminCard"
import { NavLink, Outlet } from 'react-router-dom'
import "../styles/AdminDashboard.css"


/* TODO
    1.  Allow for filtering based on report status.
    2.  Reports that lead to deleted reviews should remove the report from
        the page, but not the database (tbd, do not know if this is what we want)
    3.  Allow for deleting a report
    4.  Second page for searching for students, then looking over their
        reviews and manually removing them
    5.  Make it so only admins can access this page 
        (the link should not appear for non-admins)
*/
export default function AdminDashboard() {
    return (
    <section className="page admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage students, reviews, and site settings.</p>
      </div>

      <nav className="admin-tabs">
        <NavLink to="reports" className="header-link">Reports</NavLink>
        <NavLink to="reviews" className="header-link">Reviews</NavLink>
      </nav>

      <Outlet />
    </section>
  )
}