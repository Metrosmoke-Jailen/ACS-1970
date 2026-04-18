import './ReviewCard.css'

function ReviewCard({ score, text, user }) {

  const getLabel = (score) => {
    if (score >= 9) return "Promoter"
    if (score >= 7) return "Passive"
    return "Detractor"
  }

  return (
    <div className="reviewCard">

      <div className="reviewTop">
        <span className="reviewScore">
          Score: {score}
        </span>

        <span className={`reviewLabel ${getLabel(score).toLowerCase()}`}>
          {getLabel(score)}
        </span>
      </div>

      <div className="reviewText">
        {text}
      </div>

      <div className="reviewUser">
        — {user}
      </div>

    </div>
  )
}

export default ReviewCard