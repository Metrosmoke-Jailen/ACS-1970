import { useEffect, useState } from 'react'
import './App.css'

const emptyMovieForm = {
  title: '',
  genre: '',
  year: '',
}

function App() {
  const [movies, setMovies] = useState([])
  const [message, setMessage] = useState('Connecting to backend...')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [movieForm, setMovieForm] = useState(emptyMovieForm)
  const [ratingValues, setRatingValues] = useState({})
  const [submittingMovie, setSubmittingMovie] = useState(false)
  const [submittingRatingId, setSubmittingRatingId] = useState(null)

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError('')

      const [helloResponse, moviesResponse] = await Promise.all([
        fetch('/api/hello'),
        fetch('/api/movies'),
      ])

      if (!helloResponse.ok || !moviesResponse.ok) {
        throw new Error('Could not load the movie service.')
      }

      const helloData = await helloResponse.json()
      const moviesData = await moviesResponse.json()

      setMessage(helloData.message)
      setMovies(moviesData)
    } catch {
      setError('Could not reach the backend. Make sure Flask is running on port 5173.')
      setMessage('Backend unavailable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  const handleMovieChange = (event) => {
    const { name, value } = event.target
    setMovieForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddMovie = async (event) => {
    event.preventDefault()
    setSubmittingMovie(true)
    setNotice('')
    setError('')

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: movieForm.title.trim(),
          genre: movieForm.genre.trim(),
          year: Number(movieForm.year),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not add movie.')
      }

      setMovies((current) => [...current, data])
      setMovieForm(emptyMovieForm)
      setNotice(`Added "${data.title}" successfully.`)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmittingMovie(false)
    }
  }

  const handleRatingChange = (movieId, value) => {
    setRatingValues((current) => ({ ...current, [movieId]: value }))
  }

  const handleRateMovie = async (movieId) => {
    const rating = Number(ratingValues[movieId])

    if (!rating || rating < 1 || rating > 10) {
      setError('Please enter a rating between 1 and 10.')
      return
    }

    setSubmittingRatingId(movieId)
    setNotice('')
    setError('')

    try {
      const response = await fetch(`/api/movies/${movieId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not save rating.')
      }

      setMovies((current) =>
        current.map((movie) => (movie.id === movieId ? data.movie : movie)),
      )
      setRatingValues((current) => ({ ...current, [movieId]: '' }))
      setNotice(`Saved a ${rating.toFixed(1)} rating.`)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmittingRatingId(null)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Movie rating dashboard</p>
        <h1>Rate your favorite films</h1>
        <p className="hero-copy">
          Browse the movie list, add a new title, and submit ratings instantly.
        </p>
        <div className="status-pill">{message}</div>
      </section>

      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <h2>Add a movie</h2>
            <p>Save a new title to the shared backend list.</p>
          </div>
        </div>

        <form className="movie-form" onSubmit={handleAddMovie}>
          <input
            name="title"
            placeholder="Movie title"
            value={movieForm.title}
            onChange={handleMovieChange}
            required
          />
          <input
            name="genre"
            placeholder="Genre"
            value={movieForm.genre}
            onChange={handleMovieChange}
            required
          />
          <input
            name="year"
            type="number"
            placeholder="Year"
            value={movieForm.year}
            onChange={handleMovieChange}
            required
          />
          <button type="submit" disabled={submittingMovie}>
            {submittingMovie ? 'Saving...' : 'Add movie'}
          </button>
        </form>

        {notice ? <p className="notice-banner">{notice}</p> : null}
        {error ? <p className="error-banner">{error}</p> : null}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Movies</h2>
            <p>{loading ? 'Loading ratings...' : `${movies.length} movie(s) available`}</p>
          </div>
          <button className="secondary-button" onClick={loadMovies}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Loading movies...</p>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className="movie-card-top">
                  <div>
                    <h3>{movie.title}</h3>
                    <p>
                      {movie.genre} • {movie.year}
                    </p>
                  </div>
                  <span className="rating-badge">
                    ⭐ {movie.average_rating ?? 'New'}
                  </span>
                </div>

                <p className="rating-count">
                  {movie.rating_count} rating{movie.rating_count === 1 ? '' : 's'}
                </p>

                <div className="rating-form">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    placeholder="1 to 10"
                    value={ratingValues[movie.id] ?? ''}
                    onChange={(event) => handleRatingChange(movie.id, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRateMovie(movie.id)}
                    disabled={submittingRatingId === movie.id}
                  >
                    {submittingRatingId === movie.id ? 'Saving...' : 'Rate movie'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
