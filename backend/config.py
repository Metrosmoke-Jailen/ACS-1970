from pathlib import Path

DB_PATH = Path(__file__).with_name("movies.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"
