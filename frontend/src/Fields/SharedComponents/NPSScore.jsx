import './NPSScore.css'

function NPSScore({ score, promoters, passives, detractors }) {

    const getLabel = (score) => {
        if (score >= 70) return "Great"
        if (score >= 40) return "Mixed"
        return "Poor"
    }

    return (
        <div className="NPSScore">

            {/* SCORE */}
            <div className="npsScoreOverview">
                <div className="npsScoreLabel">NPS Score</div>
                <div className="npsScoreValue">{score}</div>
                <div className="npsScoreText">{getLabel(score)}</div>
            </div>

            {/* BREAKDOWN */}
            <div className="npsBreakdown">

                <div className="npsRow">
                    <span>Promoters</span>
                    <span>{promoters}%</span>
                </div>

                <div className="npsRow">
                    <span>Passives</span>
                    <span>{passives}%</span>
                </div>

                <div className="npsRow">
                    <span>Detractors</span>
                    <span>{detractors}%</span>
                </div>

            </div>

        </div>
    )
}

export default NPSScore