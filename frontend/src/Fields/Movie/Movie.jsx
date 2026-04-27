import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../AppContext'
import './Movie.css'

function Movie() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { query } = useAppContext()

    useEffect(() => {
        fetch('/api/movies/')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => {
                setMovies(data) // removed slice so search works on all movies
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    const filteredMovies = movies
        .filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (b.nps_score ?? -Infinity) - (a.nps_score ?? -Infinity))

    if (loading) {
        return (
            <div className="movie-page">
                <p className="muted">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="movie-page">
                <p className="muted">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="movie-page">
            <div className="movie-page-header">
                <h1>Movies</h1>
                <p className="lede">Rated by NPS score</p>
            </div>

            <div className="movie-grid">
                {filteredMovies.length === 0 ? (
                    <p className="muted">No movies found</p>
                ) : (
                    filteredMovies.map(movie => (
                        <Link
                            key={movie.slug}
                            className="movie-card"
                            to={`/movies/${movie.slug}`}
                        >
                            {movie.poster_url ? (
                                <img
                                    src={movie.poster_url}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                            ) : (
                                <div className="movie-poster-placeholder" />
                            )}

                            <div className="movie-info">
                                <p className="movie-title">{movie.title}</p>
                                <p className="muted">
                                    {movie.release_date?.slice(0, 4)}
                                </p>
                                <p className="movie-nps">
                                    NPS {movie.nps_score ?? '—'}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default Movie