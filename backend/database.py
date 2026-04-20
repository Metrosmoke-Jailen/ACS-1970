import sqlite3
from pathlib import Path
from typing import Optional, TypedDict

DB_PATH = Path(__file__).with_name("movies.db")


class MovieSchema(TypedDict):
    title: Optional[str]
    slug: str
    imdb_id: Optional[str]
    distribution: dict[int, int]
    nps_score: Optional[float]
    description: Optional[str]
    release_date: Optional[str]
    poster_url: Optional[str]
    tmdb_id: Optional[int]
    error: Optional[str]


class MovieDistributionSchema(TypedDict):
    movie_id: int
    bucket: int
    percentage: int


def get_connection(db_path: Path = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def setup_database(db_path: Path = DB_PATH) -> None:
    with get_connection(db_path) as conn:
        conn.execute(
            """
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
                error TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS movie_distributions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                movie_id INTEGER NOT NULL,
                bucket INTEGER NOT NULL CHECK(bucket BETWEEN 1 AND 10),
                percentage INTEGER NOT NULL CHECK(percentage BETWEEN 0 AND 100),
                FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE,
                UNIQUE(movie_id, bucket)
            )
            """
        )
        conn.commit()


def save_to_database(results: list[MovieSchema], db_path: Path = DB_PATH) -> None:
    setup_database(db_path)

    with get_connection(db_path) as conn:
        for result in results:
            conn.execute(
                """
                INSERT INTO movies (
                    slug, title, imdb_id, tmdb_id, description,
                    release_date, poster_url, nps_score, error, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(slug) DO UPDATE SET
                    title = excluded.title,
                    imdb_id = excluded.imdb_id,
                    tmdb_id = excluded.tmdb_id,
                    description = excluded.description,
                    release_date = excluded.release_date,
                    poster_url = excluded.poster_url,
                    nps_score = excluded.nps_score,
                    error = excluded.error,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    result["slug"],
                    result.get("title"),
                    result.get("imdb_id"),
                    result.get("tmdb_id"),
                    result.get("description"),
                    result.get("release_date"),
                    result.get("poster_url"),
                    result.get("nps_score"),
                    result.get("error"),
                ),
            )

            movie_row = conn.execute(
                "SELECT id FROM movies WHERE slug = ?", (result["slug"],)
            ).fetchone()
            if movie_row is None:
                continue

            movie_id = int(movie_row[0])
            conn.execute("DELETE FROM movie_distributions WHERE movie_id = ?", (movie_id,))

            distribution_rows: list[MovieDistributionSchema] = [
                {"movie_id": movie_id, "bucket": int(bucket), "percentage": int(pct)}
                for bucket, pct in sorted(result.get("distribution", {}).items())
            ]

            conn.executemany(
                """
                INSERT INTO movie_distributions (movie_id, bucket, percentage)
                VALUES (:movie_id, :bucket, :percentage)
                """,
                distribution_rows,
            )

        conn.commit()
