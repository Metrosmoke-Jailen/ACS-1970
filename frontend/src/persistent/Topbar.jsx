import { NavLink } from 'react-router-dom'
import './Topbar.css'

function Topbar({ sidebarToggle, handleSetFieldHome, query, handleSetQuery, context, username }) {
  const { isSidebarToggled, setSidebarToggle } = sidebarToggle
  const { field, queryPlaceholder } = context

  return (
    <header className='topbar'>
      {/* ------ SIDEBAR TOGGLE & LOGO ------ */}
      <button
        className="topbarSidebarToggle btn-primary"
        onClick={() => setSidebarToggle(!isSidebarToggled)}>
        {isSidebarToggled ? '-' : '+'}
      </button>
      <NavLink
        className='topbarLogo'
        to="/"
        onClick={handleSetFieldHome}>
        NoCapybara
      </NavLink>

      <div className="topbarContent">
        {/* --- FIELD IN & QUERY BAR --- */}
        <div className="topbarSearch">
          {field ? (
            <NavLink className="topbarField" to={`/${field.toLowerCase()}`}>
              {field}
            </NavLink>
          ) : null}

          <input
            className="topbarQueryBar"
            type="text"
            placeholder={queryPlaceholder}
            value={query}
            onChange={handleSetQuery}
          />
        </div>

        {/* --- ACCOUNT&LOGOUT OR LOGIN/SIGNUP --- */}
        {username ? (
          <div className="topbarAccount">
            <p>{username}</p>
            <button className='btn-secondary'>Logout</button>
          </div>
        ) : (
          <div className="topbarAccount">
            <button>Log In</button>
            <button>Signup</button>
          </div>
        )}
      </div>

    </header>
  )
}

export default Topbar