import asyncio
import csv
import json
import sqlite3
from pathlib import Path
from typing import Any, Optional, TypedDict, cast

from scraper import get_rating_distribution, print_histogram
from api import get_movie_metadata


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


def calculate_nps(distribution: dict[int, int]) -> Optional[float]:
    if not distribution:
        return None
    promoters = sum(distribution.get(k, 0) for k in [9, 10])
    detractors = sum(distribution.get(k, 0) for k in [1, 2, 3, 4, 5, 6])
    return round(promoters - detractors, 1)


async def run_batch(slugs: list[str]) -> list[MovieSchema]:
    results: list[MovieSchema] = []

    for i, slug in enumerate(slugs, start=1):
        if i > 1:
            await asyncio.sleep(2)
        try:
            print(f"[{i}/{len(slugs)}] Scraping {slug}...")
            scraped = cast(dict[str, Any], await get_rating_distribution(slug))
        except Exception as e:
            print(f"  Scrape error for '{slug}': {e}")
            results.append({
                "title": None,
                "slug": slug,
                "imdb_id": None,
                "distribution": {},
                "nps_score": None,
                "description": None,
                "release_date": None,
                "poster_url": None,
                "tmdb_id": None,
                "error": str(e),
            })
            continue

        metadata: dict[str, Any] = {}
        if scraped.get("imdb_id"):
            try:
                metadata = cast(dict[str, Any], get_movie_metadata(str(scraped["imdb_id"])))
            except Exception as e:
                print(f"  Metadata error for '{slug}' ({scraped['imdb_id']}): {e}")

        dist = cast(dict[int, int], scraped.get("distribution", {}))
        results.append({
            "title": cast(Optional[str], scraped.get("title")),
            "slug": str(scraped.get("slug", slug)),
            "imdb_id": cast(Optional[str], scraped.get("imdb_id")),
            "distribution": dist,
            "nps_score": calculate_nps(dist),
            "description": cast(Optional[str], metadata.get("description")),
            "release_date": cast(Optional[str], metadata.get("release_date")),
            "poster_url": cast(Optional[str], metadata.get("poster_url")),
            "tmdb_id": cast(Optional[int], metadata.get("tmdb_id")),
            "error": None,
        })

    return results


def setup_movie_database(db_path: Path = DB_PATH) -> None:
    with sqlite3.connect(db_path) as conn:
        conn.execute("PRAGMA foreign_keys = ON")
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


def save_to_database(results: list[MovieSchema], db_path: Path = DB_PATH) -> None:
    setup_movie_database(db_path)

    with sqlite3.connect(db_path) as conn:
        conn.execute("PRAGMA foreign_keys = ON")

        for result in results:
            conn.execute(
                """
                INSERT INTO movies (
                    slug,
                    title,
                    imdb_id,
                    tmdb_id,
                    description,
                    release_date,
                    poster_url,
                    nps_score,
                    error,
                    updated_at
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
                "SELECT id FROM movies WHERE slug = ?",
                (result["slug"],),
            ).fetchone()
            if movie_row is None:
                continue

            movie_id = int(movie_row[0])
            conn.execute("DELETE FROM movie_distributions WHERE movie_id = ?", (movie_id,))

            distribution_rows: list[MovieDistributionSchema] = [
                {
                    "movie_id": movie_id,
                    "bucket": int(bucket),
                    "percentage": int(percentage),
                }
                for bucket, percentage in sorted(result.get("distribution", {}).items())
            ]

            conn.executemany(
                """
                INSERT INTO movie_distributions (movie_id, bucket, percentage)
                VALUES (:movie_id, :bucket, :percentage)
                """,
                distribution_rows,
            )

        conn.commit()


def save_json(results: list[MovieSchema], filename: str = "movie_data.json") -> None:
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)


def save_csv(results: list[MovieSchema], filename: str = "movie_data.csv") -> None:
    fieldnames = [
        "title",
        "slug",
        "imdb_id",
        "tmdb_id",
        "release_date",
        "description",
        "poster_url",
        "bucket_1",
        "bucket_2",
        "bucket_3",
        "bucket_4",
        "bucket_5",
        "bucket_6",
        "bucket_7",
        "bucket_8",
        "bucket_9",
        "bucket_10",
        "nps_score",
        "error",
    ]

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for result in results:
            dist = result.get("distribution", {})
            row: dict[str, Any] = {
                "title": result.get("title"),
                "slug": result.get("slug"),
                "imdb_id": result.get("imdb_id"),
                "tmdb_id": result.get("tmdb_id"),
                "release_date": result.get("release_date"),
                "description": result.get("description"),
                "poster_url": result.get("poster_url"),
                "bucket_1": dist.get(1, 0),
                "bucket_2": dist.get(2, 0),
                "bucket_3": dist.get(3, 0),
                "bucket_4": dist.get(4, 0),
                "bucket_5": dist.get(5, 0),
                "bucket_6": dist.get(6, 0),
                "bucket_7": dist.get(7, 0),
                "bucket_8": dist.get(8, 0),
                "bucket_9": dist.get(9, 0),
                "bucket_10": dist.get(10, 0),
                "nps_score": result.get("nps_score"),
                "error": result.get("error", ""),
            }
            writer.writerow(row)


async def main():
    slugs = [
        "inception",
        "the-godfather",
        "midsommar",
        "interstellar",
        "parasite-2019",
        "fight-club",
        "goodfellas",
        "whiplash-2014",
        "moonlight-2016",
        "la-la-land",
        "the-dark-knight",
        "the-social-network",
        "spirited-away",
        "pulp-fiction",
        "get-out-2017",
        "the-batman",
        "arrival-2016",
        "blade-runner-2049",
        "there-will-be-blood",
        "her",
    ]

    results = await run_batch(slugs)

    print("\nFinished collecting.\n")

    for result in results:
        if result.get("error"):
            print(f"{result['slug']}: ERROR -> {result['error']}")
        else:
            print_histogram(cast(dict[str, Any], result))

    save_json(results)
    save_csv(results)
    save_to_database(results)

    print("Saved results to:")
    print("  movie_data.json")
    print("  movie_data.csv")
    print(f"  {DB_PATH.name}")


if __name__ == "__main__":
    asyncio.run(main())
