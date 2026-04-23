import './Auth.css'

export default function Signup() {
  return (
    <div className="AuthPage">
      <div className="AuthCard">
        <h1>Create account</h1>
        <p className="lede">Join us and get started</p>

        <form className="AuthForm">
          <div className="FormGroup">
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </div>

          <div className="FormGroup">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>

          <div className="FormGroup">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <div className="FormGroup">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button className="btn-primary btn-lg">
            Sign Up
          </button>
        </form>

        <p className="muted">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}