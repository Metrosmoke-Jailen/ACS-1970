import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Movies.css'

function Movies() {
  const [starred, setStarred] = useState(false)
  console.log(starred)
  return (
    <div className="Movies">
      <div className="moviesTop">
        <div className="moviesOuterControls">
          <NavLink className="moviesBackButton" to='/movie'>←</NavLink>
          <input type="text" className="moviesQuery" />
          <button
            className="moviesStarred"
            onClick={() => setStarred(!starred)}>
            {starred ? '★' : '☆'}
          </button>
        </div>
      </div>
      <div className="movies-bottom">

      </div>
    </div>
  )
}

export default Movies
