import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../AppContext'
import './Topbar.css'

function Topbar() {
  const { context, handleSetFieldHome, query, handleSetQuery, username, isAuthPage, isLoggedIn, logout } = useAppContext()
  const { field, queryPlaceholder } = context
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className='topbar'>
      {/* ------ BRAND LOGO (Always shown) ------ */}
      <NavLink
        className='topbarLogo'
        to="/"
        onClick={handleSetFieldHome}>
        NPS for Everything
      </NavLink>

      {/* ------ DESKTOP NAV LINKS ------ */}
      {!isAuthPage && (
        <nav className="topbarNav">
          <NavLink to="/" className={({ isActive }) => isActive ? "topbarNavLink active" : "topbarNavLink"} onClick={handleSetFieldHome}>Home</NavLink>
          <NavLink to="/movie" className={({ isActive }) => isActive ? "topbarNavLink active" : "topbarNavLink"}>Movies</NavLink>
        </nav>
      )}

      {/* ------ CONDITIONAL CONTENT ------ */}
      {isAuthPage ? (
        <div className="topbarContent">
          <div className="topbarAccount">
            {location.pathname === '/login' ? (
              <button className="btn-secondary" onClick={() => navigate('/signup')}>Sign Up</button>
            ) : (
              <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
            )}
          </div>
        </div>
      ) : (

        <div className="topbarContent">
          {/* --- FIELD IN & QUERY BAR --- */}
          {field !== 'Home' && (
            <div className="topbarSearch">
              <input
                className="topbarQueryBar"
                type="text"
                placeholder={queryPlaceholder}
                value={query}
                onChange={handleSetQuery}
              />
            </div>
          )}

          {/* --- ACCOUNT & LOGOUT OR LOGIN/SIGNUP --- */}
          {isLoggedIn && username ? (
            <div className="topbarAccount">
              <NavLink to="/profile" className="topbarUsername">{username}</NavLink>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="topbarAccount">
              <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
              <button className="btn-secondary" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Topbar