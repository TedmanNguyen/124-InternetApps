// Deprecated. Use src/context/AdminContext.jsx or src/api/client.js.

const removed = (name) => () => {
  throw new Error(
    `${name} from src/data/mockReports has been removed. Use AdminContext or src/api/client.`,
  )
}

export const updateReportStatus = removed('updateReportStatus')
export const deleteReport = removed('deleteReport')
export const addReport = removed('addReport')

export default removed('pullReports (default)')
