import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../AppContext'
import { API_ENDPOINTS } from '../../config/routes'
import './Profile.css'

const BASE = API_ENDPOINTS.BASE_URL

function Profile() {
    const { isLoggedIn, username, userId } = useAppContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState(null)
    const [reviews, setReviews] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        Promise.all([
            fetch(`${BASE}/api/auth/check`, { credentials: 'include' }).then(r => r.ok ? r.json() : null),
            fetch(`${BASE}/api/reviews/user/${userId}`, { credentials: 'include' }).then(r => r.ok ? r.json() : []),
            fetch(`${BASE}/api/favorites/`, { credentials: 'include' }).then(r => r.ok ? r.json() : []),
        ]).then(([userData, reviewsData, favoritesData]) => {
            if (userData) setEmail(userData.email)
            setReviews(reviewsData)
            setFavorites(favoritesData)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [isLoggedIn, userId])

    const ratingLabel = (rating) => {
        if (rating >= 9) return 'Promoter'
        if (rating >= 7) return 'Passive'
        return 'Detractor'
    }

    if (loading) {
        return <div className="profile"><p className="muted">Loading...</p></div>
    }

    return (
        <div className="profile">
            <div className="profileHeader">
                <div className="profileAvatar">{username?.[0]?.toUpperCase()}</div>
                <div className="profileInfo">
                    <h1>{username}</h1>
                    {email && <p className="muted">{email}</p>}
                </div>
            </div>

            <section className="profileSection">
                <h2>Favorited Movies</h2>
                {favorites.length === 0 ? (
                    <p className="muted">No favorites yet — star a movie to save it here.</p>
                ) : (
                    <div className="profileMovieGrid">
                        {favorites.map(movie => (
                            <Link
                                key={movie.slug}
                                className="movie-card"
                                to={`/movies/${movie.slug}`}
                            >
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
                        ))}
                    </div>
                )}
            </section>

            <section className="profileSection">
                <h2>Your Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="muted">No reviews yet — rate a movie to see it here.</p>
                ) : (
                    <div className="profileReviews">
                        {reviews.map(review => (
                            <Link
                                key={review.id}
                                className="profileReviewCard"
                                to={`/movies/${review.movie_slug}`}
                            >
                                <div className="profileReviewTop">
                                    <span className="profileReviewTitle">{review.movie_title}</span>
                                    <span className="profileReviewRating">{review.rating}/10</span>
                                    <span className={`profileReviewLabel ${ratingLabel(review.rating).toLowerCase()}`}>
                                        {ratingLabel(review.rating)}
                                    </span>
                                </div>
                                {review.body && <p className="profileReviewBody">{review.body}</p>}
                                <p className="muted profileReviewDate">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Profile
