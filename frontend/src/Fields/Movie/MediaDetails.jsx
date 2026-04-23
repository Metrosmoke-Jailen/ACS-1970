import './MediaDetails.css'

const BUCKET_LABELS = {
  1: '½★', 2: '★', 3: '★½', 4: '★★', 5: '★★½',
  6: '★★★', 7: '★★★½', 8: '★★★★', 9: '★★★★½', 10: '★★★★★'
}

function MediaDetails({ releaseDate, imdbId, tmdbId, slug, distribution = {} }) {
  const maxPct = Math.max(...Object.values(distribution), 1)

  return (
    <div className="MediaDetails">

      <div className="mediaDetailsGrid">

        {releaseDate && (
          <div className="mediaDetailItem">
            <span className="label">Released</span>
            <span className="value">{releaseDate}</span>
          </div>
        )}

        {imdbId && (
          <div className="mediaDetailItem">
            <span className="label">IMDb</span>
            <a
              className="value mediaDetailLink"
              href={`https://www.imdb.com/title/${imdbId}/`}
              target="_blank"
              rel="noreferrer"
            >
              {imdbId}
            </a>
          </div>
        )}

        {tmdbId && (
          <div className="mediaDetailItem">
            <span className="label">TMDb</span>
            <a
              className="value mediaDetailLink"
              href={`https://www.themoviedb.org/movie/${tmdbId}`}
              target="_blank"
              rel="noreferrer"
            >
              {tmdbId}
            </a>
          </div>
        )}

        {slug && (
          <div className="mediaDetailItem">
            <span className="label">Letterboxd</span>
            <a
              className="value mediaDetailLink"
              href={`https://letterboxd.com/film/${slug}/`}
              target="_blank"
              rel="noreferrer"
            >
              {slug}
            </a>
          </div>
        )}

      </div>

      {Object.keys(distribution).length > 0 && (
        <div className="ratingHistogram">
          <p className="histogramTitle">Rating Distribution</p>
          {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(bucket => {
            const pct = distribution[bucket] ?? 0
            return (
              <div key={bucket} className="histogramRow">
                <span className="histogramLabel">{BUCKET_LABELS[bucket]}</span>
                <div className="histogramBarWrap">
                  <div
                    className="histogramBar"
                    style={{ width: `${(pct / maxPct) * 100}%` }}
                  />
                </div>
                <span className="histogramPct">{pct}%</span>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default MediaDetails
