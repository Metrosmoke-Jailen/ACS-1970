import { useState } from 'react'
import './ActionPanel.css'

function ActionPanel() {
    const [starred, setStarred] = useState(false)
    const [saved, setSaved] = useState(false)
    const [comment, setComment] = useState('')

    return (
        <div className="ActionPanel">

            {/* COMMENTS SECTION */}
            <div className="commentsSection">
                <div className="commentTitle">Comments</div>
                <textarea
                    className="commentTextarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your thoughts..."
                    rows={4}
                />
            </div>

            {/* MORE ACTIONS */}
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