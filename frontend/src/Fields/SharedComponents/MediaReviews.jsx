import ReviewCard from './ReviewCard'
import './MediaReviews.css'

function MediaReviews({ reviews = [] }) {
  return (
    <div className="mediaReviews">

      <h3 className="reviewsTitle">
        Reviews
      </h3>

      <div className="reviewsList">

        {reviews.map((r, i) => (
          <ReviewCard
            key={i}
            score={r.score}
            text={r.text}
            user={r.user}
          />
        ))}

      </div>

    </div>
  )
}

export default MediaReviews