import json
from pathlib import Path

from db import setup_database
from routes.movies import save_movies

SEED_FILE = Path(__file__).parent.parent / "movie_data" / "seed_data.json"


def main():
    data = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    good = [r for r in data if not r.get("error")]
    print(f"Loaded {len(good)} movies from {SEED_FILE.name}")

    setup_database()
    save_movies(good)
    print(f"Done — {len(good)} movies seeded into movies.db")


if __name__ == "__main__":
    main()
