import AttributeTag from "./AttributeTag"

export default function ReviewCard({ review }) {
    return (
        <article key={review.id} className="review-item">
            <header>
            <strong>{review.course}</strong>
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