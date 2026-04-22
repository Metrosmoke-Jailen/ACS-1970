import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './ControlBar.css'

// FOR QUICK ACTIONS WITH NAVIGATION

function ControlBar({ field }) {
  // SIMULATING STATES AND PROPS
  const [starred, setStarred] = useState(false)

  return (
    <div className="ControlBar">
      <div className="controlBarleft">
        <NavLink
          className="controlBarBackButton control-icon control-ghost"
          to={`/${field}`}>
          ←
        </NavLink>
      </div>

      <div className="controlBarRight">
        <button
          className="controlBarStarred control-icon control-minimal"
          onClick={() => setStarred(!starred)}>
          {starred ? '★' : '☆'}
        </button>
        <button className="controlBarShare control-icon control-minimal">
          ▷
        </button>
      </div>
    </div >
  )
}

export default ControlBar
