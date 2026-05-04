import './Home.css'
import Section from '../../ui/Section'

const BROWSE_LINKS = [
    { label: 'Movies', to: '/movie' },
]

function Home() {
    return (
        <div className="home">

            <div className="homeHero">
                <div className="homeHeader">
                    <h1>A better way to measure what people love</h1>
                    <p>NPS cuts through inflated averages to show how audiences really feel — not just what they rated.</p>
                </div>

                <Section
                    title="Explore"
                    type="fields"
                    items={BROWSE_LINKS}
                />
            </div>

            <div className="homeInfoGrid">
                <Section
                    title="What is an NPS Score?"
                    type="info"
                    items={[
                        'Net Promoter Score was built to measure loyalty, not opinions. ' +
                        'It runs from −100 to +100 by subtracting the share of detractors (scores 1–6) ' +
                        'from the share of promoters (scores 9–10). Scores in the middle barely move the needle. ' +
                        'A high NPS means people don\'t just like it — they\'d tell someone else about it.'
                    ]}
                />

                <Section
                    title="Why it works"
                    type="info"
                    items={[
                        'Average ratings hide polarisation. A 7/10 average could mean everyone felt "meh," ' +
                        'or it could mean half the audience loved it and half hated it. ' +
                        'NPS separates those two cases — and that difference matters.'
                    ]}
                />
            </div>

        </div>
    )
}

export default Home