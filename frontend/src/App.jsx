import { useEffect, useReducer, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { AppProvider, useAppContext } from './AppContext'
import Topbar from './persistent/Topbar'
import Sidebar from './persistent/Sidebar'
import Footer from './persistent/Footer'
import TabNav from './persistent/TabNav'
import Home from './Fields/Home/Home'

import Movie from './Fields/Movie/Movie'
import Movies from './Fields/Movie/Movies'

// SOME FYI:
// - If setState is passed as is, it is render only specific. 
//   - Else it has logic dependent on data and will be explicitly stated here

function AppContent() {
  const { isSidebarToggled } = useAppContext()

  // ------- ACTUAL RENDER ------- //
  return (
    <div className="App">
      <Topbar />

      <div className="sandwichedContent">
        {/* <Sidebar isCompact={!isSidebarToggled} /> */}
        <TabNav />

        {/* ---- MAIN CONTENT ---- */}
        <div className="mainContent">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/movie' element={<Movie />} />
            <Route path='/movies/:slug' element={<Movies />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
