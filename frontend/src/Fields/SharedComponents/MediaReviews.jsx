import ReviewCard from './ReviewCard'
import './MediaReviews.css'

function MediaReviews({ reviews = [] }) {
  return (
    <div className="mediaReviews">

      <h3 className="reviewsTitle">
        Reviews
      </h3>

      <div className="reviewsList">

        {reviews.length === 0 && (
          <p className="muted">No reviews yet.</p>
        )}
        {reviews.map((r, i) => (
          <ReviewCard
            key={r.id ?? i}
            rating={r.rating}
            body={r.body}
            username={r.username}
          />
        ))}

      </div>

    </div>
  )
}

export default MediaReviews