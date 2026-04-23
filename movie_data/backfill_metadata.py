"""
Backfill genres, runtime, and cast for all movies that have an imdb_id
but are missing the new fields. Hits TMDb API only — no Letterboxd scraping.
"""
import json
import sqlite3
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from api import get_movie_metadata

DB_PATH = Path(__file__).parent.parent / "backend" / "movies.db"


def backfill():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    rows = conn.execute(
        "SELECT id, slug, imdb_id FROM movies WHERE imdb_id IS NOT NULL AND genres IS NULL"
    ).fetchall()

    print(f"Backfilling {len(rows)} movies...")

    ok = 0
    fail = 0

    for i, row in enumerate(rows, 1):
        try:
            meta = get_movie_metadata(row["imdb_id"])
            genres = meta.get("genres") or []
            runtime = meta.get("runtime")
            cast = meta.get("cast") or []

            conn.execute(
                'UPDATE movies SET genres = ?, runtime = ?, "cast" = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                (
                    json.dumps(genres),
                    runtime,
                    json.dumps(cast),
                    row["id"],
                ),
            )
            conn.commit()
            ok += 1
            print(f"[{i}/{len(rows)}] {row['slug']} — {genres} | {runtime}min | {len(cast)} cast")
        except Exception as e:
            fail += 1
            print(f"[{i}/{len(rows)}] {row['slug']} FAILED: {e}")

        if i % 10 == 0:
            time.sleep(1)

    conn.close()
    print(f"\nDone. {ok} updated, {fail} failed.")


if __name__ == "__main__":
    backfill()
