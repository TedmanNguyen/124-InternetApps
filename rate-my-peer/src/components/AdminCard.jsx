import reportStatus from "../data/reportStatus";
import { pullReviewsGivenId } from "../data/mockReviews";
import ReviewCard from "./ReviewCard";
import {pullStudentsGivenId} from "../data/mockStudents";
import "../styles/AdminCard.css"
import { useState } from "react";
import { updateReportStatus } from "../data/mockReports";
import { deleteReview } from "../data/mockReviews";
export default function AdminCard({report}) {
    const review = pullReviewsGivenId(report.reviewId)
    const reviewer = pullStudentsGivenId(review.reviewerId)
    const reporter = pullStudentsGivenId(report.reporterId)

    return (
        <div className="admin-card">
            <ReviewCard review={review} />
            <div className='report-details'>
                <h3>Report ID: {report.id}</h3>
                <div className='emails-and-id'>
                    <p><strong>Reviewer Email:</strong> {reviewer.email}</p>
                    <p><strong>Reporter Email:</strong> {reporter.email}</p>
                    <p><strong>Review ID:</strong> {report.reviewId}</p>
                </div>
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Details:</strong> {report.details}</p>
                <div className="status-container">
                    <p><strong>Status:</strong></p>
                    <StatusBadge currentStatus={reportStatus.indexOf(report.status)} report={report} />
                </div>
                <div className='bottom-row-admin-card'>
                    <div className='dates'>
                        <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
                    </div>
                    <button className='delete-review-button' onClick={() => {deleteReview(report.reviewId); /*deleteReport(report.id)*/
                    }}>Delete Review</button>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({currentStatus, report}) {
    const [status, setStatus] = useState(currentStatus)

    const changeStatus = () => {
        setStatus(prev => (prev + 1) % reportStatus.length)
    }

    const onClick = () => {
        setStatus(prev => (prev + 1) % reportStatus.length)
        updateReportStatus(report.id, reportStatus[(status + 1) % reportStatus.length])
        // send the new status to the database
    }

    return (
        <>
            <button className={`status-badge status-${reportStatus[status].toLowerCase().replace(' ', '-')}`} onClick={onClick}>
                {reportStatus[status]}
            </button>
        </>
    )
}