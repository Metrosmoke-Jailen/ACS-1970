import { NavLink } from 'react-router-dom'
import { useAppContext } from '../AppContext'
import './Topbar.css'

function Topbar() {
  const { context, handleSetFieldHome, query, handleSetQuery, isSidebarToggled, setSidebarToggle, username } = useAppContext()
  const { field, queryPlaceholder } = context

  return (
    <header className='topbar'>
      {/* ------ SIDEBAR TOGGLE & LOGO ------ */}
      {/* <button
        className="topbarSidebarToggle btn-primary"
        onClick={() => setSidebarToggle(!isSidebarToggled)}>
        {isSidebarToggled ? '←' : '→'}
      </button> */}
      <NavLink
        className='topbarLogo'
        to="/"
        onClick={handleSetFieldHome}>
        NoCapybara
      </NavLink>

      <div className="topbarContent">
        {/* --- FIELD IN & QUERY BAR --- */}
        {field !== 'Home' && (
          <div className="topbarSearch">
            <NavLink
              className={({ isActive }) =>
                isActive ? "topbarField active" : "topbarField"
              }
              to={`/${field?.toLowerCase().replace(/\s+/g, '-')}`}
            >{field}
            </NavLink>

            <input
              className="topbarQueryBar"
              type="text"
              placeholder={queryPlaceholder}
              value={query}
              onChange={handleSetQuery}
            />
          </div>
        )}

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