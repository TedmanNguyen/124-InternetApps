import { useEffect, useMemo, useState } from 'react'
import AdminCard from '../components/AdminCard'
import reportStatus from '../data/reportStatus'
import { useAdmin } from '../context/AdminContext'

export default function ReportsView() {
  const { reports, loading, error, refresh } = useAdmin()

  const [draftFilter, setDraftFilter] = useState(reportStatus.slice())
  const [appliedFilter, setAppliedFilter] = useState(reportStatus.slice())

  // Re-fetch when the applied filter changes so the server sends only what we need.
  useEffect(() => {
    refresh({ status: appliedFilter.join(',') }).catch(() => {})
  }, [appliedFilter, refresh])

  const filteredReports = useMemo(
    () => reports.filter((r) => appliedFilter.includes(r.status)),
    [reports, appliedFilter],
  )

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
        <button className="apply-filter-button" onClick={() => setAppliedFilter(draftFilter)}>
          Apply
        </button>
      </div>

      {loading && <p className="muted">Loading reports…</p>}
      {error && <p className="empty-state">{error}</p>}

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

function FilterBadge({ status, statusFilter, setStatusFilter }) {
  const isActive = statusFilter.includes(status)
  const toggleStatus = () => {
    if (isActive) setStatusFilter((prev) => prev.filter((s) => s !== status))
    else setStatusFilter((prev) => [...prev, status])
  }

  return (
    <button
      className={`status-filter-badge ${isActive ? 'status-' + status.toLowerCase().replace(' ', '-') : 'inactive'}`}
      onClick={toggleStatus}
    >
      {status}
    </button>
  )
}
