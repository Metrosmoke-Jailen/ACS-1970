import { Link } from 'react-router-dom'
import './Auth.css'

export default function Login() {
  return (
    <div className="AuthPage">
      <div className="AuthCard">
        <h1>Welcome back</h1>
        <p className="lede">Log in to continue</p>

        <form className="AuthForm">
          <div className="FormGroup">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>

          <div className="FormGroup">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button className="btn-primary btn-lg">
            Log In
          </button>
        </form>

        <p className="muted">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}