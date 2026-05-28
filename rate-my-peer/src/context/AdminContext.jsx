import { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { urls } from '../data/urls';

const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // const response = await axios.get(`${urls.base}/${urls.reports}`)
                const response = await axios.get('http://localhost:3000/api/reports')
                setReports(response.data)
            } catch (error) {
                console.error('Error fetching reports:', error)
            }
        }

        fetchReports()
    }, [])

    const setReportStatus = ( {reportId, status} ) => {
        setReports(prevReports => 
            prevReports.map(report => 
                report._id === reportId ? { ...report, status } : report
            )
        )
    }

    const value = useMemo(() => ({
        reports,
        setReportStatus,
    }), [reports])

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => {
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}