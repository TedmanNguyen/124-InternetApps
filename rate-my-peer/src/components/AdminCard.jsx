import reportStatus from "../data/reportStatus";
import { pullReviewsGivenId } from "../data/mockReviews";
import ReviewCard from "./ReviewCard";
import {pullStudentsGivenId} from "../data/mockStudents";
import "../styles/AdminCard.css"
import { useState } from "react";

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
                    <StatusBadge currentStatus={report.status} />
                </div>
                <div className='dates'>
                    <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({currentStatus}) {
    const [status, setStatus] = useState(currentStatus)
    return (
        <div className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>
            <span>{status}</span>
        </div>
    )
}