import AdminCard from "../components/AdminCard"
import pullReports from "../data/mockReports"

export default function ReportsView() {
    const reports = pullReports()
    return (
        <section className="page admin-dashboard">
            <div className='admin-dashboard-reports'>
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