import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../AppContext'
import { API_ENDPOINTS } from '../../config/routes'
import './UserNPSScore.css'

const BASE = API_ENDPOINTS.BASE_URL

function UserNPSScore({ movieId, onReviewSubmitted }) {
    const { isLoggedIn, userId } = useAppContext()
    const [score, setScore] = useState(null)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    const getLabel = (score) => {
        if (score === null) return ""
        if (score >= 9) return "Promoter"
        if (score >= 7) return "Passive"
        return "Detractor"
    }

    const handleSubmit = async () => {
        if (score === null) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            const res = await fetch(`${BASE}/api/reviews/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    user_id: userId,
                    target_type: 'movie',
                    target_id: movieId,
                    rating: score,
                    body: comment.trim() || null,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setSubmitError(data.error || 'Submission failed')
            } else {
                setSubmitted(true)
                onReviewSubmitted?.()
            }
        } catch {
            setSubmitError('Could not reach the server')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isLoggedIn) {
        return (
            <div className="UserNPS">
                <div className="userNpsTitle">Your Rating</div>
                <p className="userNpsLoginPrompt">
                    <Link to="/login">Log in</Link> to leave a review
                </p>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="UserNPS">
                <div className="userNpsTitle">Your Rating</div>
                <p className="userNpsSuccess">Review submitted — thanks!</p>
            </div>
        )
    }

    return (
        <div className="UserNPS">
            <div className="userNpsTitle">Your Rating</div>

            <div className="userNpsGrid">
                {[...Array(10)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`userNpsButton ${score === i + 1 ? "active" : ""}`}
                        onClick={() => setScore(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="userNpsLabel">
                {score !== null && (
                    <>You are a <strong>{getLabel(score)}</strong></>
                )}
            </div>

            <textarea
                className="userNpsComment"
                placeholder="Add a comment (optional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
            />

            {submitError && <p className="userNpsError">{submitError}</p>}

            <button
                className="userNpsSubmit btn-primary"
                onClick={handleSubmit}
                disabled={score === null || submitting}
            >
                {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
        </div>
    )
}

export default UserNPSScore
