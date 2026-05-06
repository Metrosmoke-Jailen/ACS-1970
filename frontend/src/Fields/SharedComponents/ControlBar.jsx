import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../AppContext'
import { API_ENDPOINTS } from '../../config/routes'
import './ControlBar.css'

const BASE = API_ENDPOINTS.BASE_URL

function ControlBar({ field, movieId }) {
  const { isLoggedIn } = useAppContext()
  const navigate = useNavigate()
  const [starred, setStarred] = useState(false)

  useEffect(() => {
    if (!movieId || !isLoggedIn) return
    fetch(`${BASE}/api/favorites/${movieId}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStarred(data.favorited) })
      .catch(() => {})
  }, [movieId, isLoggedIn])

  const handleStar = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetch(`${BASE}/api/favorites/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie_id: movieId }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setStarred(data.favorited) })
      .catch(() => {})
  }

  return (
    <div className="ControlBar">
      <div className="controlBarleft">
        <NavLink
          className="controlBarBackButton control-icon control-ghost"
          to={`/${field}`}>
          ←
        </NavLink>
      </div>

      <div className="controlBarRight">
        <button
          className="controlBarStarred control-icon control-minimal"
          onClick={handleStar}>
          {starred ? '★' : '☆'}
        </button>
        <button className="controlBarShare control-icon control-minimal">
          ▷
        </button>
      </div>
    </div>
  )
}

export default ControlBar
