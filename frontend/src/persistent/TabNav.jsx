import { NavLink } from "react-router-dom"
import './TabNav.css'

function TabNav() {
  return (
    <div className="TabNav">
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "tab active" : "tab"}
      >Home
      </NavLink>

      <NavLink
        to="/movie"
        className={({ isActive }) => isActive ? "tab active" : "tab"}
      >Movies
      </NavLink>
    </div>
  )
}

export default TabNav