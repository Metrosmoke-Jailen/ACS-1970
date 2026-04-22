import './MediaOverview.css'

function MediaOverview({ title, description, poster, cast = [] }) {
  return (
    <div className="MediaOverview">

      {/* LEFT: POSTER */}
      <div className="mediaPoster">
        <img src={poster} alt={title} />
      </div>

      {/* RIGHT: TEXT */}
      <div className="mediaText">
        <h1 className="mediaTitle">{title}</h1>

        <p className="mediaDescription">
          {description}
        </p>

        <div className="mediaCast">
          <strong>Cast:</strong> {cast.join(', ')}
        </div>
      </div>

    </div>
  )
}

export default MediaOverview