function Star({ fill = 0 }) {
  const clippedFill = Math.max(0, Math.min(fill, 1))

  return (
    <span className="star-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="star-base">
        <path d="M12 17.2l-5.5 3.3 1.5-6.3L3 9.8l6.5-.6L12 3.2l2.5 6 6.5.6-5 4.4 1.5 6.3z" />
      </svg>
      <span className="star-fill" style={{ width: `${clippedFill * 100}%` }}>
        <svg viewBox="0 0 24 24">
          <path d="M12 17.2l-5.5 3.3 1.5-6.3L3 9.8l6.5-.6L12 3.2l2.5 6 6.5.6-5 4.4 1.5 6.3z" />
        </svg>
      </span>
    </span>
  )
}

export default function RatingStars({ rating, totalReviews, size = 'md' }) {
  const roundedRating = Number(rating.toFixed(1))

  return (
    <div className={`rating-stars ${size}`}>
      <div className="stars-track" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.max(0, Math.min(1, roundedRating - index))
          return <Star key={index} fill={fill} />
        })}
      </div>
      <span className="rating-text">
        {roundedRating.toFixed(1)} / 5
        {typeof totalReviews === 'number' ? ` (${totalReviews})` : ''}
      </span>
    </div>
  )
}

