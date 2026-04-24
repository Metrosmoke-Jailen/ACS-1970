import './ReviewCard.css'

function ReviewCard({ rating, body, username }) {

  const getLabel = (rating) => {
    if (rating >= 9) return "Promoter"
    if (rating >= 7) return "Passive"
    return "Detractor"
  }

  return (
    <div className="reviewCard">

      <div className="reviewTop">
        <span className="reviewScore">
          Score: {rating}
        </span>

        <span className={`reviewLabel ${getLabel(rating).toLowerCase()}`}>
          {getLabel(rating)}
        </span>
      </div>

      {body && (
        <div className="reviewText">
          {body}
        </div>
      )}

      <div className="reviewUser">
        — {username}
      </div>

    </div>
  )
}

export default ReviewCard
