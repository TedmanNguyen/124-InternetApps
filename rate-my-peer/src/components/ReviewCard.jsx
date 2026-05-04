import AttributeTag from "./AttributeTag"
import { pullStudentsGivenId } from "../data/mockStudents"
import "../styles/ReviewCard.css"

export default function ReviewCard({ review }) {
    // console.log(review.reviewerId)
    const reviewer = pullStudentsGivenId(review.reviewerId)
    return (
        <article key={review.id} className="review-item">
            <header className='review-header'>
                <div className='left-side-header'>
                    <div className='reviewer-info'>
                        <div className="avatar">{reviewer.firstName[0]}{reviewer.lastName[0]}</div>
                        <strong>{`${reviewer.firstName} ${reviewer.lastName}`}</strong>
                    </div>
                </div>
                <span>{review.course} - {review.instructor} - {review.project}</span>
                <span>{review.rating}.0 / 5</span>
            </header>
            <p>{review.comment}</p>
            <div className="tag-row">
            {review.attributes.map((attribute) => (
                <AttributeTag key={`${review.id}-${attribute}`} label={attribute} />
            ))}
            </div>
        </article>
    )
} 