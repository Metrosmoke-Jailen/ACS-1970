import { NavLink } from 'react-router-dom'
import './Card.css'

function Card({ type, label, to }) {

  if (to) {
    return (
      <NavLink to={to} className={`card ${type}`}>
        {label}
      </NavLink>
    )
  }

  return (
    <div className={`card ${type}`}>
      {label}
    </div>
  )
}

export default Card