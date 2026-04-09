import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Could not reach backend"))
  }, [])

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Flask + React</h1>
      <p>Backend says: <strong>{message || "loading..."}</strong></p>
    </div>
  )
}

export default App
