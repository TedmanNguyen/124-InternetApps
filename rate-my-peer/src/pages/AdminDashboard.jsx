import pullReports from "../data/mockReports"
import AdminCard from "../components/AdminCard"

export default function AdminDashboard() {
    const reports = pullReports()
    return (
        <section className="page admin-dashboard">
            <div className='admin-dashboard-header'>
                <h1>Admin Dashboard</h1>
                <p>Manage students, reviews, and site settings here.</p>
            </div>
            <div className='admin-dashboard-reports'>
                <h2>Reports</h2>
                <div className='admin-dashboard-report-cards'>
                    {/* Report cards will be rendered here */}
                    {reports.map(report => (
                        <AdminCard key={report.id} report={report} />
                    ))}
                </div>
            </div>
        </section>
    )
}