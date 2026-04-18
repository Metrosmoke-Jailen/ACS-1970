import { useState } from 'react'
import './UserNPSScore.css'

function UserNPSScore() {
    const [score, setScore] = useState(null)

    const getLabel = (score) => {
        if (score === null) return ""
        if (score >= 9) return "Promoter"
        if (score >= 7) return "Passive"
        return "Detractor"
    }

    return (
        <div className="UserNPS">

            <div className="userNpsTitle">
                Your Rating
            </div>

            {/* SCORE GRID */}
            <div className="userNpsGrid">
                {[...Array(11)].map((_, i) => (
                    <button
                        key={i}
                        className={`userNpsButton ${score === i ? "active" : ""}`}
                        onClick={() => setScore(i)}
                    >
                        {i}
                    </button>
                ))}
            </div>

            {/* LABEL */}
            <div className="userNpsLabel">
                {score !== null && (
                    <>
                        You are a <strong>{getLabel(score)}</strong>
                    </>
                )}
            </div>

        </div>
    )
}

export default UserNPSScore