import { useEffect, useMemo, useRef, useState } from 'react'
import AdminCard from '../components/AdminCard'
import reportStatus from '../data/reportStatus'
import { useAdmin } from '../context/AdminContext'

export default function ReportsView() {
  const { reports, loading, error, refresh } = useAdmin()

  const [draftFilter, setDraftFilter] = useState(reportStatus.slice())
  const [appliedFilter, setAppliedFilter] = useState(reportStatus.slice())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    refresh({ status: appliedFilter.join(',') }).catch(() => {})
  }, [appliedFilter, refresh])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredReports = useMemo(
    () => reports.filter((r) => appliedFilter.includes(r.status)),
    [reports, appliedFilter],
  )

  const handleApply = () => {
    setAppliedFilter(draftFilter)
    setDropdownOpen(false)
  }

  const selectedCount = draftFilter.length
  const totalCount = reportStatus.length

  return (
    <section className="page admin-dashboard">
      <div className="filter-container" ref={dropdownRef}>
        <div className="status-filter-dropdown">
          <button
            className="apply-filter-button"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            Filter by Status
            {selectedCount < totalCount && ` (${selectedCount}/${totalCount})`}
            {' '}{dropdownOpen ? '▲' : '▼'}
          </button>

          {dropdownOpen && (
            <div className="status-filter-menu">
              {reportStatus.map((status) => (
                <FilterOption
                  key={status}
                  status={status}
                  draftFilter={draftFilter}
                  setDraftFilter={setDraftFilter}
                />
              ))}
              <div className="status-filter-menu-footer">
                <button className="apply-filter-button" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
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

function FilterOption({ status, draftFilter, setDraftFilter }) {
  const isChecked = draftFilter.includes(status)
  const toggle = () => {
    if (isChecked) setDraftFilter((prev) => prev.filter((s) => s !== status))
    else setDraftFilter((prev) => [...prev, status])
  }

  return (
    <label className={`status-filter-option status-${status.toLowerCase().replace(' ', '-')}`}>
      <input type="checkbox" checked={isChecked} onChange={toggle} />
      {status}
    </label>
  )
}
