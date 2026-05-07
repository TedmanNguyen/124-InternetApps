import AttributeTag from "./AttributeTag"
import { pullStudentsGivenId } from "../data/mockStudents"
import { useState } from "react"
import { addUserUpvotedReview, addUserDownvotedReview } from "../data/mockReviews"
import thumbsUp from "../assets/thumbs-up-navy.svg"
import thumbsUpFilled from "../assets/thumbs-up-filled-navy.svg"
import thumbsDown from "../assets/thumbs-down-navy.svg"
import thumbsDownFilled from "../assets/thumbs-down-filled-navy.svg"
import { addReport } from "../data/mockReports"
import { reportReasons } from "../data/reportStatus"
import "../styles/ReviewCard.css"

// will want to pass the current user ID into here
export default function ReviewCard({ review, currentUserId }) {
    // console.log(review.reviewerId)
    let createdAt = `${review.createdAt.toLocaleString('default', { month: 'long' })} ${review.createdAt.getDate()}, ${review.createdAt.getFullYear()}`
    
    const [numUpvotes, setNumUpvotes] = useState(review.upvotes.length || 0)
    const [numDownvotes, setNumDownvotes] = useState(review.downvotes.length || 0)
    const [userUpvoted, setUserUpvoted] = useState(review.upvotes.includes(currentUserId))
    const [userDownvoted, setUserDownvoted] = useState(review.downvotes.includes(currentUserId))
    const [showReportModal, setShowReportModal] = useState(false)

    const onUpvoteClick = () => {
        const upvoted = addUserUpvotedReview(review, currentUserId)  // Replace with actual user ID
        const downvoted = userDownvoted && upvoted ? false : userDownvoted
        setNumUpvotes(review.upvotes.length)
        setNumDownvotes(review.downvotes.length)
        setUserUpvoted(upvoted)
        setUserDownvoted(downvoted)
    }

    const onDownvoteClick = () => {
        const downvoted = addUserDownvotedReview(review, currentUserId)  // Replace with actual user ID
        const upvoted = userUpvoted && downvoted ? false : userUpvoted
        setNumDownvotes(review.downvotes.length)
        setNumUpvotes(review.upvotes.length)
        setUserUpvoted(upvoted)
        setUserDownvoted(downvoted)
    }

    const onReportClick = () => setShowReportModal(true)

    const reviewer = !review.isAnonymous ? pullStudentsGivenId(review.reviewerId) : null
    return (
        <article key={review.id} className="review-item">
            <header className='review-header'>
                <div className='left-side-header'>
                    <div className='reviewer-info'>
                        {!review.isAnonymous && reviewer ? (
                            <>
                                <div className="avatar">{reviewer.firstName[0]}{reviewer.lastName[0]}</div>
                                <strong>{`${reviewer.firstName} ${reviewer.lastName}`}</strong>
                            </>
                        ) : (
                            <>
                                <div className="avatar">?</div>
                                <strong>Anonymous</strong>
                            </>
                        )}
                    </div>
                </div>
                <span>{review.course} - {review.instructor} - {review.project}</span>
                <span>{review.rating}.0 / 5</span>
            </header>
            <p>{review.comment}</p>
            <div className='review-card-footer'>
                <div className="tag-row">
                <span className='review-date'>{createdAt}</span>
                {review.attributes.map((attribute) => (
                    <AttributeTag key={`${review.id}-${attribute}`} label={attribute} />
                ))}
                </div>
                { currentUserId && (
                <div className='upvote-downvote-container'>
                    <button className='vote-button' onClick={onUpvoteClick}><img src={userUpvoted ? thumbsUpFilled : thumbsUp} alt="Upvote" width={25} height={25}/> {numUpvotes}</button>
                    <button className='vote-button' onClick={onDownvoteClick}><img src={userDownvoted ? thumbsDownFilled : thumbsDown} alt="Downvote" width={25} height={25} /> {numDownvotes}</button>
                    <button className='report-button' onClick={onReportClick}>Report</button>
                </div>
            )}
            </div>
            {showReportModal && <ReportReviewModal review={review} currentUserId={currentUserId} onClose={() => setShowReportModal(false)} />}
        </article>
    )
}

function ReportReviewModal({ review, currentUserId, onClose }) {
    const [reason, setReason] = useState(reportReasons[0])
    const [details, setDetails] = useState("")

    const isValid = reason && details.trim().length > 0

    const handleSubmit = () => {
        if (!isValid) return
        addReport({
            reporterId: currentUserId,
            reviewId: review.id,
            reason,
            details: details.trim(),
        })
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Report Review</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="report-reason">Reason</label>
                        <select
                            id="report-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            {reportReasons.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="report-details">Details</label>
                        <textarea
                            id="report-details"
                            rows={4}
                            placeholder="Add context for the moderation team..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button
                        className={`submit-button ${isValid ? "" : "disabled"}`}
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        Submit Report
                    </button>
                </div>
            </div>
        </div>
    )
}