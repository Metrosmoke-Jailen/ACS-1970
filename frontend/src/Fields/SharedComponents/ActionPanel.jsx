import { useState } from 'react'
import './ActionPanel.css'

function ActionPanel() {
    const [starred, setStarred] = useState(false)
    const [saved, setSaved] = useState(false)

    return (
        <div className="ActionPanel">

            <div className="actionTitle">
                Actions
            </div>

            <button
                className="actionBtn"
                onClick={() => setStarred(!starred)}
            >
                {starred ? "★ Starred" : "☆ Star"}
            </button>

            <button className="actionBtn">
                ⤴ Share
            </button>

            <button
                className="actionBtn"
                onClick={() => setSaved(!saved)}
            >
                {saved ? "✓ In List" : "+ Add to List"}
            </button>

        </div>
    )
}

export default ActionPanel