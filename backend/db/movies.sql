CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT,
    imdb_id TEXT,
    tmdb_id INTEGER,
    description TEXT,
    release_date TEXT,
    poster_url TEXT,
    nps_score REAL,
    genres TEXT,
    runtime INTEGER,
    "cast" TEXT,
    error TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
