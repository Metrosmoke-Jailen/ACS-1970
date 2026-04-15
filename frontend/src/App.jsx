import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Topbar from './persistent/Topbar'
import Home from './Home/Home'
import Footer from './persistent/Footer'

function App() {
  return (
    <div className="App">
      <Topbar />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
