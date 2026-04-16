import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isCompact }) {
  return (
    <div className={`Sidebar ${isCompact ? 'compact' : 'full'}`}>

      <nav className="sidebarNav">
        <NavLink to="/">△ {!isCompact && "Home"}</NavLink>
        <NavLink to="/starred">☆ {!isCompact && "Starred"}</NavLink>
        <NavLink to="/lists">☰ {!isCompact && "Lists"}</NavLink>
      </nav>

    </div>
  )
}

export default Sidebar