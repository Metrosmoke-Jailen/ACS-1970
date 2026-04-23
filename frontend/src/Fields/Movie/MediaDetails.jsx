import './MediaDetails.css'

const BUCKET_LABELS = {
  1: '½★', 2: '★', 3: '★½', 4: '★★', 5: '★★½',
  6: '★★★', 7: '★★★½', 8: '★★★★', 9: '★★★★½', 10: '★★★★★'
}

function formatRuntime(minutes) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function MediaDetails({ releaseDate, imdbId, tmdbId, slug, distribution = {}, genres = [], runtime, cast = [] }) {
  const maxPct = Math.max(...Object.values(distribution), 1)
  const runtimeStr = formatRuntime(runtime)

  return (
    <div className="MediaDetails">

      <div className="mediaDetailsGrid">

        {releaseDate && (
          <div className="mediaDetailItem">
            <span className="label">Released</span>
            <span className="value">{releaseDate}</span>
          </div>
        )}

        {genres.length > 0 && (
          <div className="mediaDetailItem">
            <span className="label">Genre</span>
            <span className="value">{genres.join(', ')}</span>
          </div>
        )}

        {runtimeStr && (
          <div className="mediaDetailItem">
            <span className="label">Runtime</span>
            <span className="value">{runtimeStr}</span>
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

      {cast.length > 0 && (
        <div className="castSection">
          <p className="castTitle">Cast</p>
          <div className="castList">
            {cast.slice(0, 6).map((person, i) => (
              <div key={i} className="castItem">
                <span className="castName">{person.name}</span>
                {person.character && (
                  <span className="castCharacter">{person.character}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
