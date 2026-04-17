import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Movies.css'

import ControlBar from '../SharedComponents/ControlBar'

function Movies() {
  return (
    <div className="Movies">
      <ControlBar
        field={'movie'}
        queryPlaceHolder={'Search for a movie'}
      />
      <div className="moviesTop">
      </div>
      <div className="movies-bottom">

      </div>
    </div>
  )
}

export default Movies
