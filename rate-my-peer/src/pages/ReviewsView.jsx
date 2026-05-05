import ReviewCard from "../components/ReviewCard";
import { pullAllReviews } from "../data/mockReviews"
import { useMemo, useState } from "react";
import { pullStudentsGivenId } from "../data/mockStudents";
import { deleteReview } from "../data/mockReviews";
import "../styles/ReviewsView.css"

export default function ReviewsView() {
    const reviews = useMemo(() => pullAllReviews(), [])
    return (
        <section className="page reviews-view">
            {reviews.map(review => {
                const reviewee = pullStudentsGivenId(review.revieweeId)
                return (
                    <div className='review-card-container' key={review.id}>
                        <ReviewCard key={review.id} review={review} />
                        <div className='bottom-row'>
                            <span><strong>Reviewee: {`${reviewee.firstName} ${reviewee.lastName}`}</strong></span>
                            <button className='delete-review-button' onClick={() => {deleteReview(review.id); /*deleteReport(report.id)*/
                            }}>Delete Review</button>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}