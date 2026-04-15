import asyncio
import requests
import re
import os
from dotenv import load_dotenv
from collect_movies import run_batch, save_json, save_csv

load_dotenv()

TMDB_API_KEY = os.getenv("MOVIE_API_KEY")


def get_tmdb_top_rated(pages: int = 25) -> list[dict]:
    """Fetch top rated movies from TMDb. 25 pages = ~500 movies."""
    movies = []
    for page in range(1, pages + 1):
        print(f"  Fetching TMDb page {page}/{pages}...")
        response = requests.get(
            "https://api.themoviedb.org/3/movie/top_rated",
            params={"api_key": TMDB_API_KEY, "language": "en-US", "page": page},
        )
        data = response.json()
        movies.extend(data.get("results", []))
    return movies


def title_to_slug(title: str) -> str:
    """Convert a movie title to a Letterboxd slug (best guess)."""
    slug = title.lower()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug)
    return slug


async def main():
    print("Fetching top rated movies from TMDb...")
    movies = get_tmdb_top_rated(pages=25)
    print(f"Got {len(movies)} movies from TMDb.\n")

    slugs = [title_to_slug(m["title"]) for m in movies]

    # Remove duplicates while preserving order
    seen = set()
    slugs = [s for s in slugs if not (s in seen or seen.add(s))]

    print(f"Running scraper on {len(slugs)} slugs...\n")
    results = await run_batch(slugs)

    # Summary
    success = [r for r in results if not r.get("error")]
    failed = [r for r in results if r.get("error")]
    print(f"\nDone. {len(success)} succeeded, {len(failed)} failed.")

    if failed:
        print("\nFailed slugs (likely wrong slug — check Letterboxd manually):")
        for r in failed:
            print(f"  {r['slug']}")

    save_json(results, "seed_data.json")
    save_csv(results, "seed_data.csv")
    print("\nSaved to seed_data.json and seed_data.csv")


if __name__ == "__main__":
    asyncio.run(main())
