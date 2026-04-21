import sqlite3
from pathlib import Path

from config import DB_PATH


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
