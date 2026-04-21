import { useState } from 'react'
import './UserNPSScore.css'

function UserNPSScore() {
    const [score, setScore] = useState(null)

    const getLabel = (score) => {
        if (score === null) return ""
        if (score >= 4) return "Promoter"
        if (score >= 3) return "Passive"
        return "Detractor"
    }

    return (
        <div className="UserNPS">

            <div className="userNpsTitle">
                Your Rating
            </div>

            {/* SCORE GRID */}
            <div className="userNpsGrid">
                {[...Array(5)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={`userNpsButton ${score === i + 1 ? "active" : ""}`}
                        onClick={() => setScore(i + 1)}
                    >
                        {i + 1}
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