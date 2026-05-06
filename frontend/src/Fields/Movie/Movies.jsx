import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_ENDPOINTS } from '../../config/routes'
import './Movies.css'

const BASE = API_ENDPOINTS.BASE_URL

import ControlBar from '../SharedComponents/ControlBar'
import MediaOverview from './MediaOverview'
import MediaDetails from './MediaDetails'
import MediaReviews from '../SharedComponents/MediaReviews'
import NPSScore from '../SharedComponents/NPSScore'
import UserNPSScore from '../SharedComponents/UserNPSScore'

function Movies() {
  const { slug } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`${BASE}/api/movies/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setMovie(data)
        setLoading(false)
        console.log(data)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  const fetchReviews = (movieId) => {
    fetch(`${BASE}/api/reviews/movie/${movieId}`)
      .then(r => r.ok ? r.json() : [])
      .then(setReviews)
      .catch(() => {})
  }

  useEffect(() => {
    if (movie?.id) fetchReviews(movie.id)
  }, [movie?.id])

  if (loading) {
    return (
      <div className="Movies">
        <p className="muted">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="Movies">
        <p className="muted">Error: {error}</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="Movies">
        <p className="muted">Movie not found</p>
      </div>
    )
  }

  const dist = movie.distribution ?? {}
  const promoters = (dist[9] ?? 0) + (dist[10] ?? 0)
  const passives = (dist[7] ?? 0) + (dist[8] ?? 0)
  const detractors = (dist[1] ?? 0) + (dist[2] ?? 0) + (dist[3] ?? 0) + (dist[4] ?? 0) + (dist[5] ?? 0) + (dist[6] ?? 0)

  return (
    <div className="Movies">

      <div className="moviesGrid">
        {/* TOP ROW GRID*/}
        <div className="moviesGridTop">

          {/* TOP-LEFT */}
          <div className="quadrant topLeft">
            <ControlBar
              field={'movie'}
              movieId={movie.id}
            />

            <MediaOverview
              title={movie.title}
              description={movie.description}
              poster={movie.poster_url}
              releaseYear={movie.release_date?.slice(0, 4)}
            />
          </div>

          {/* TOP-RIGHT */}
          <div className="quadrant topRight">
            <NPSScore
              score={movie.nps_score ?? 0}
              promoters={promoters}
              passives={passives}
              detractors={detractors}
            />
            <UserNPSScore movieId={movie.id} onReviewSubmitted={() => fetchReviews(movie.id)} />
          </div>
        </div>


        {/* BOTTOM ROW GRID */}
        <div className="moviesGridBottom">

          {/* BOTTOM-LEFT */}
          <div className="quadrant bottomLeft">
            <MediaDetails
              releaseDate={movie.release_date}
              imdbId={movie.imdb_id}
              tmdbId={movie.tmdb_id}
              slug={movie.slug}
              distribution={dist}
              genres={movie.genres}
              runtime={movie.runtime}
              cast={movie.cast}
            />
          </div>

          {/* BOTTOM-RIGHT */}
          <div className="quadrant bottomRight">
            <MediaReviews reviews={reviews} />
          </div>
        </div>
      </div>
    </div>



  )
}

export default Movies