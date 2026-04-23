import './Home.css'
import Section from '../../ui/Section'

function Home() {
    return (
        <div className="home">

            <div className="homeHeader">
                <h1>Some Some Welcome?</h1>
                <p>Some Some Tag Line</p>
            </div>

            <Section
                title="New NPS"
                type="cards"
                items={['Movie A', 'Movie B', 'Movie C', 'Movie D']}
            />

            <Section
                title="Featured Lists"
                type="cards"
                items={['Top Rated', 'Trending', 'All Time']}
            />

            <Section
                title="Why NPS"
                type="info"
                items={['Simple scoring system to rate anything from movies to food.']}
            />

        </div>
    )
}

export default Home