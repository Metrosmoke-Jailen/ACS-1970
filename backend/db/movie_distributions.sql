CREATE TABLE IF NOT EXISTS movie_distributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    bucket INTEGER NOT NULL CHECK(bucket BETWEEN 1 AND 10),
    percentage INTEGER NOT NULL CHECK(percentage BETWEEN 0 AND 100),
    FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(movie_id, bucket)
);
