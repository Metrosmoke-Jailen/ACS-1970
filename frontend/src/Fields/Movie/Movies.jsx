import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Movies.css'

import ControlBar from '../SharedComponents/ControlBar'
import MediaOverview from './MediaOverview'
import MediaDetails from './MediaDetails'


function Movies() {
  return (
    <div className="Movies">

      {/* MEDIA HEADER BLOCK */}
      <div className="mediaHeaderBlock">

        <ControlBar
          field={'movie'}
          queryPlaceHolder={'Search for a movie'}
        />

        <MediaOverview
          title='Project Hail Mary'
          description="Science teacher Ryland Grace wakes up on a 
              spaceship with no recollection of who he is or how he got there. 
              As his memory slowly returns, he soon discovers he must solve 
              the riddle behind a mysterious substance that' s causing the sun 
              to die out. As details of the mission unravel, he calls on his 
              scientific training and sheer ingenuity -- but he may not have 
              to do it alone."
          poster='/Untitled.jpg'
          cast={["Ryan Gosling", "Phil Lord", "Chris Miller",
            "Amy Pascal", "Aditya Sood", "Andy Weir", "Rachel O'Connor"]}
        />

      </div>

      {/* BODY LAYOUT */}
      <div className="moviesContent">

        {/* LEFT / MAIN INFO STACK */}
        <div className="moviesLeft">

          <MediaDetails />
          {/* <MediaReviews /> */}

        </div>

        {/* RIGHT / NPS PANEL */}
        <div className="moviesRight">

          {/* <NPSScore score={78} />
          <UserNPSScore /> */}

        </div>

      </div>

    </div>
  )
}

export default Movies