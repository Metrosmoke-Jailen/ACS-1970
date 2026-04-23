import sqlite3
from pathlib import Path

from config import DB_PATH


def get_connection(db_path: Path = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


_SQL_DIR = Path(__file__).parent
_TABLES = ["movies", "movie_distributions", "reviews"]


def setup_database(db_path: Path = DB_PATH) -> None:
    with get_connection(db_path) as conn:
        for table in _TABLES:
            sql = (_SQL_DIR / f"{table}.sql").read_text()
            conn.execute(sql)
        for col, typedef in [("genres", "TEXT"), ("runtime", "INTEGER"), ("cast", "TEXT")]:
            try:
                conn.execute(f"ALTER TABLE movies ADD COLUMN {col} {typedef}")
            except Exception:
                pass
        conn.commit()
