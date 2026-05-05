import { useMemo, useState } from "react"
import AdminCard from "../components/AdminCard"
import pullReports from "../data/mockReports"
import reportStatus from "../data/reportStatus"

export default function ReportsView() {
  const reports = useMemo(() => pullReports(), [])

  const [draftFilter, setDraftFilter] = useState(reportStatus.slice())
  const [appliedFilter, setAppliedFilter] = useState(reportStatus.slice())

  const filteredReports = useMemo(
    () => reports.filter((r) => appliedFilter.includes(r.status)),
    [reports, appliedFilter],
  )

  const applyFilterOnClick = () => {
    setAppliedFilter(draftFilter)
  }

  return (
    <section className="page admin-dashboard">
      <div className="filter-container">
        <div className="status-filter">
          <span><strong>Filter by Status:</strong></span>
          {reportStatus.map((status) => (
            <FilterBadge
              key={status}
              status={status}
              statusFilter={draftFilter}
              setStatusFilter={setDraftFilter}
            />
          ))}
        </div>
        <button className="apply-filter-button" onClick={applyFilterOnClick}>
          Apply
        </button>
      </div>

      <div className="admin-dashboard-reports">
        <div className="admin-dashboard-report-cards">
          {filteredReports.map((report) => (
            <AdminCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FilterBadge({status, statusFilter, setStatusFilter}) {
    const isActive = statusFilter.includes(status)

    const toggleStatus = () => {
        if (isActive) {
            setStatusFilter(prev => prev.filter(s => s !== status))
        } else {
            setStatusFilter(prev => [...prev, status])
        }
    }

    return (
        <button className={`status-filter-badge ${isActive ? "status-" + status.toLowerCase().replace(' ', '-') : 'inactive'}`} onClick={toggleStatus}>
            {status}
        </button>
    )
}