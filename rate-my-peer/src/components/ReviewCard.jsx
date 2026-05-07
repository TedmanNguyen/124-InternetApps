import AttributeTag from "./AttributeTag"
import { pullStudentsGivenId } from "../data/mockStudents"
import { useState } from "react"
import { addUserUpvotedReview, addUserDownvotedReview } from "../data/mockReviews"
import thumbsUp from "../assets/thumbs-up-navy.svg"
import thumbsUpFilled from "../assets/thumbs-up-filled-navy.svg"
import thumbsDown from "../assets/thumbs-down-navy.svg"
import thumbsDownFilled from "../assets/thumbs-down-filled-navy.svg"
import "../styles/ReviewCard.css"

// will want to pass the current user ID into here
export default function ReviewCard({ review, currentUserId }) {
    // console.log(review.reviewerId)

    const [numUpvotes, setNumUpvotes] = useState(review.upvotes.length || 0)
    const [numDownvotes, setNumDownvotes] = useState(review.downvotes.length || 0)
    const [userUpvoted, setUserUpvoted] = useState(review.upvotes.includes(currentUserId))
    const [userDownvoted, setUserDownvoted] = useState(review.downvotes.includes(currentUserId))

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
                {review.attributes.map((attribute) => (
                    <AttributeTag key={`${review.id}-${attribute}`} label={attribute} />
                ))}
                </div>
                { currentUserId && (
                <div className='upvote-downvote-container'>
                    <button className='vote-button' onClick={onUpvoteClick}>{userUpvoted ? <img src={thumbsUpFilled} alt="Upvote" /> : <img src={thumbsUp} alt="Upvote" />} {numUpvotes}</button>
                    <button className='vote-button' onClick={onDownvoteClick}>{userDownvoted ? <img src={thumbsDownFilled} alt="Downvote" /> : <img src={thumbsDown} alt="Downvote" />} {numDownvotes}</button>
                </div>
            )}
            </div>
        </article>
    )
} 