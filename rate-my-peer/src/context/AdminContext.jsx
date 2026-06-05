import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useStudents } from './StudentContext'

// Admin-only data: moderation reports. Skips loading entirely if the current
// user isn't an admin so non-admins don't get 403s in the console.
const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const { currentUser, authChecked } = useStudents()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { reports } = await api.reports.list()
      console.log(reports)
      setReports(reports)
      return reports
    } catch (err) {
      console.log("error occurred")
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authChecked) return
    if (!currentUser?.isAdmin) {
      setReports([])
      return
    }
    refresh().catch(() => {})
  }, [authChecked, currentUser, refresh])

  const updateReportStatus = useCallback(async (reportId, status) => {
    const { report } = await api.reports.updateStatus(reportId, status)
    setReports((prev) => prev.map((r) => (r.id === reportId ? report : r)))
    return report
  }, [])

  const removeReport = useCallback(async (reportId) => {
    await api.reports.remove(reportId)
    setReports((prev) => prev.filter((r) => r.id !== reportId))
  }, [])

  const createReport = useCallback(async ({ reviewId, reason, details }) => {
    const { report } = await api.reports.create({ reviewId, reason, details })
    // Only push into local state if we're an admin viewing the list.
    if (currentUser?.isAdmin) setReports((prev) => [report, ...prev])
    return report
  }, [currentUser])

  const value = useMemo(
    () => ({
      reports,
      loading,
      error,
      refresh,
      updateReportStatus,
      removeReport,
      createReport,
    }),
    [reports, loading, error, refresh, updateReportStatus, removeReport, createReport],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within an AdminProvider')
  return ctx
}
