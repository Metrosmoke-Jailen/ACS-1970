import { NavLink } from 'react-router-dom'
import './Movie.css'

function Movie() {
  return (
    <div className="Movie">
      <NavLink to='/movies'>Example Info and Review</NavLink>
    </div>
  )
}

export default Movie