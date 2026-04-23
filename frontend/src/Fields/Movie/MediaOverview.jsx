import './MediaOverview.css'

function MediaOverview({ title, description, poster, releaseYear }) {
  return (
    <div className="MediaOverview">

      {/* LEFT: POSTER */}
      <div className="mediaPoster">
        {poster
          ? <img src={poster} alt={title} />
          : <div className="mediaPosterPlaceholder" />
        }
      </div>

      {/* RIGHT: TEXT */}
      <div className="mediaText">
        <div className="mediaTitleRow">
          <h1 className="mediaTitle">{title}</h1>
          {releaseYear && <span className="mediaYear">{releaseYear}</span>}
        </div>

        <p className="mediaDescription">
          {description || 'No description available.'}
        </p>
      </div>

    </div>
  )
}

export default MediaOverview