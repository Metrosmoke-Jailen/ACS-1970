import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './ControlBar.css'


function ControlBar({ field, queryPlaceHolder }) {
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

      <div className="controlBarCenter">
        <input
          type="text"
          className="controlBarQuery"
          placeholder={queryPlaceHolder}
        />
      </div>

      <div className="controlBarRight">
        <button
          className="controlBarStarred control-icon control-minimal"
          onClick={() => setStarred(!starred)}>
          {starred ? '★' : '☆'}
        </button>
      </div>
    </div >
  )
}

export default ControlBar
