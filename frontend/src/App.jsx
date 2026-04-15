import { useEffect, useReducer, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Topbar from './persistent/Topbar'
import Sidebar from './persistent/Sidebar'
import Footer from './persistent/Footer'
import Home from './Home/Home'

import Movie from './Fields/Movie/Movie'

// SOME FYI:
// - If setState is passed as is, it is render only specific. 
//   - Else it has logic dependent on data and will be explicitly done here

function App() {

  // ---- TOPBAR PROPS/STATE ---- //
  const [isSidebarToggled, setSidebarToggle] = useState(true)
  const [context, setContext] = useState({
    field: 'movie',
    queryPlaceholder: 'Looking for a certain movie?'
  })
  const [query, setQuery] = useState('')
  const username = 'Test-User'

  // ------- ACTUAL RENDER ------- //
  return (
    <div className="App">
      <Topbar
        sidebarToggle={{ isSidebarToggled, setSidebarToggle }}
        context={context}
        handleSetFieldHome={() => setContext({ field: null, queryPlaceholder: 'Got something in mind?' })}
        username={username}
        query={query}
        handleSetQuery={(e) => setQuery(e.target.value)}
      />

      <div className="sandwichedContent">
        <Sidebar isCompact={!isSidebarToggled} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie' element={<Movie />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
