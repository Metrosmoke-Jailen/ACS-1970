import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Movies.css'

import ControlBar from '../SharedComponents/ControlBar'
import MediaOverview from './MediaOverview'
import MediaDetails from './MediaDetails'
import MediaReviews from '../SharedComponents/MediaReviews'
import NPSScore from '../SharedComponents/NPSScore'
import UserNPSScore from '../SharedComponents/UserNPSScore'
import ActionPanel from '../SharedComponents/ActionPanel'

import { movieReviews } from '../../XampleData'

function Movies() {
  const { slug } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/movies/${slug}`)
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

  return (
    <div className="Movies">

      <div className="moviesGrid">
        {/* TOP ROW GRID*/}
        <div className="moviesGridTop">

          {/* TOP-LEFT */}
          <div className="quadrant topLeft">
            <ControlBar
              field={'movie'}
              queryPlaceHolder={'Search for a movie'}
            />

            <MediaOverview
              title={movie.title}
              description={movie.description}
              poster={movie.poster_url}
              cast={movie.cast}
            />
          </div>

          {/* TOP-RIGHT */}
          <div className="quadrant topRight">
            <NPSScore score={movie.nps_score ?? 0} />
            <UserNPSScore />
            <ActionPanel />
          </div>
        </div>


        {/* BOTTOM ROW GRID */}
        <div className="moviesGridBottom">

          {/* BOTTOM-LEFT */}
          <div className="quadrant bottomLeft">
            <MediaDetails movie={movie} />
          </div>

          {/* BOTTOM-RIGHT */}
          <div className="quadrant bottomRight">
            <MediaReviews reviews={movieReviews} />
          </div>
        </div>
      </div>
    </div>



  )
}

export default Movies