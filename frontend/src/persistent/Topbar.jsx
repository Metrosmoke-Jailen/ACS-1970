import { NavLink, useNavigate } from 'react-router-dom'
import { useAppContext } from '../AppContext'
import './Topbar.css'

function Topbar() {
  const { context, handleSetFieldHome, query, handleSetQuery, isSidebarToggled, setSidebarToggle, username } = useAppContext()
  const { field, queryPlaceholder } = context
  const navigate = useNavigate()

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
            <button className="btn-secondary" onClick={() => navigate('/login')}>Logout</button>
          </div>
        ) : (
          <div className="topbarAccount">
            <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            <button className="btn-secondary" onClick={() => navigate('/signup')}>Signup</button>
          </div>
        )}
      </div>

    </header>
  )
}

export default Topbar