import { useEffect, useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../AppContext'
import { API_ENDPOINTS } from '../../config/routes'
import './Movie.css'

const BASE = API_ENDPOINTS.BASE_URL

const ERAS = [
    { label: 'Silent & Early Sound', from: 0,    to: 1939 },
    { label: 'Golden Age',           from: 1940,  to: 1959 },
    { label: 'New Hollywood',        from: 1960,  to: 1979 },
    { label: '80s & 90s',            from: 1980,  to: 1999 },
    { label: '2000s',                from: 2000,  to: 2009 },
    { label: '2010s',                from: 2010,  to: 2019 },
    { label: '2020s',                from: 2020,  to: 9999 },
]

const VIEWS = ['Top Rated', 'By Era']

function MovieCard({ movie }) {
    return (
        <Link className="movie-card" to={`/movies/${movie.slug}`}>
            {movie.poster_url ? (
                <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
            ) : (
                <div className="movie-poster-placeholder" />
            )}
            <div className="movie-info">
                <p className="movie-title">{movie.title}</p>
                <p className="muted">{movie.release_date?.slice(0, 4)}</p>
                <p className="movie-nps">NPS {movie.nps_score ?? '—'}</p>
            </div>
        </Link>
    )
}

function MovieGrid({ movies }) {
    if (movies.length === 0) return <p className="muted">No movies found.</p>
    return (
        <div className="movie-grid">
            {movies.map(m => <MovieCard key={m.slug} movie={m} />)}
        </div>
    )
}

function RankedMovieList({ movies }) {
    if (movies.length === 0) return <p className="muted">No movies found.</p>
    return (
        <div className="ranked-list">
            {movies.map((m, i) => (
                <Link key={m.slug} className="ranked-row" to={`/movies/${m.slug}`}>
                    <span className="rank-number">{i + 1}</span>
                    {m.poster_url
                        ? <img src={m.poster_url} alt={m.title} className="ranked-poster" />
                        : <div className="ranked-poster-placeholder" />
                    }
                    <div className="ranked-info">
                        <p className="movie-title">{m.title}</p>
                        <p className="muted">{m.release_date?.slice(0, 4)}</p>
                    </div>
                    <span className="movie-nps">NPS {m.nps_score ?? '—'}</span>
                </Link>
            ))}
        </div>
    )
}

function TopRated({ movies }) {
    const sorted = useMemo(
        () => [...movies].sort((a, b) => (b.nps_score ?? -Infinity) - (a.nps_score ?? -Infinity)).slice(0, 25),
        [movies]
    )
    return (
        <div className="view-section">
            <p className="view-desc">The 25 highest NPS-scoring films in the catalogue.</p>
            <div className="movie-grid top-rated-grid">
                {sorted.map((m, i) => (
                    <Link key={m.slug} className="movie-card" to={`/movies/${m.slug}`}>
                        <div className="movie-poster-wrap">
                            {m.poster_url
                                ? <img src={m.poster_url} alt={m.title} className="movie-poster" />
                                : <div className="movie-poster-placeholder" />
                            }
                            <span className="rank-badge">{i + 1}</span>
                        </div>
                        <div className="movie-info">
                            <p className="movie-title">{m.title}</p>
                            <p className="muted">{m.release_date?.slice(0, 4)}</p>
                            <p className="movie-nps">NPS {m.nps_score ?? '—'}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="top-rated-list-mobile">
                <RankedMovieList movies={sorted} />
            </div>
        </div>
    )
}

function ByEra({ movies }) {
    const [activeEra, setActiveEra] = useState(null)
    const eraRefs = useRef({})

    const byEra = useMemo(() => {
        return ERAS.map(era => {
            const films = movies
                .filter(m => {
                    const y = parseInt(m.release_date?.slice(0, 4))
                    return !isNaN(y) && y >= era.from && y <= era.to
                })
                .sort((a, b) => (b.nps_score ?? -Infinity) - (a.nps_score ?? -Infinity))
            return { ...era, films }
        }).filter(era => era.films.length > 0)
    }, [movies])

    const scrollToEra = (label) => {
        setActiveEra(label)
        const el = eraRefs.current[label]
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="view-section">
            <div className="era-nav">
                {byEra.map(era => (
                    <button
                        key={era.label}
                        className={`era-nav-btn${activeEra === era.label ? ' active' : ''}`}
                        onClick={() => scrollToEra(era.label)}
                    >
                        {era.label}
                    </button>
                ))}
            </div>

            <div className="era-view">
                {byEra.map(era => (
                    <div
                        key={era.label}
                        className="era-block"
                        ref={el => eraRefs.current[era.label] = el}
                    >
                        <div className="era-header">
                            <h2 className="era-title">{era.label}</h2>
                            <span className="era-count">{era.films.length} films</span>
                        </div>
                        <MovieGrid movies={era.films} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function SearchResults({ movies, query }) {
    const results = useMemo(() => {
        const q = query.toLowerCase()
        return movies
            .filter(m => m.title.toLowerCase().includes(q))
            .sort((a, b) => (b.nps_score ?? -Infinity) - (a.nps_score ?? -Infinity))
    }, [movies, query])

    return (
        <div className="view-section">
            <p className="view-desc">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
            <MovieGrid movies={results} />
        </div>
    )
}

function Movie() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeView, setActiveView] = useState(VIEWS[0])

    const { query } = useAppContext()
    const isSearching = query.trim().length > 0

    useEffect(() => {
        fetch(`${BASE}/api/movies/`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                setMovies(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="movie-page"><p className="muted">Loading...</p></div>
    if (error)   return <div className="movie-page"><p className="muted">Error: {error}</p></div>

    return (
        <div className="movie-page">
            <div className="movie-page-header">
                <h1>Movies</h1>
                {!isSearching && (
                    <div className="view-tabs">
                        {VIEWS.map(v => (
                            <button
                                key={v}
                                className={`view-tab${activeView === v ? ' active' : ''}`}
                                onClick={() => setActiveView(v)}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isSearching ? (
                <SearchResults movies={movies} query={query} />
            ) : activeView === 'Top Rated' ? (
                <TopRated movies={movies} />
            ) : (
                <ByEra movies={movies} />
            )}
        </div>
    )
}

export default Movie
