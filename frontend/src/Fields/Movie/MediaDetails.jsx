import './MediaDetails.css'

function MediaDetails({
  genre,
  releaseYear,
  director,
  runtime
}) {
  return (
    <div className="MediaDetails">

      <div className="mediaDetailsGrid">

        <div className="mediaDetailItem">
          <span className="label">Genre</span>
          <span className="value">{genre}</span>
        </div>

        <div className="mediaDetailItem">
          <span className="label">Release</span>
          <span className="value">{releaseYear}</span>
        </div>

        <div className="mediaDetailItem">
          <span className="label">Director</span>
          <span className="value">{director}</span>
        </div>

        <div className="mediaDetailItem">
          <span className="label">Runtime</span>
          <span className="value">{runtime}</span>
        </div>

      </div>

    </div>
  )
}

export default MediaDetails