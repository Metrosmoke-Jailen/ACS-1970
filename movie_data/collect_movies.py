import asyncio
import csv
import json

from scraper import get_rating_distribution, print_histogram
from api import get_movie_metadata


def calculate_nps(distribution: dict) -> float | None:
    if not distribution:
        return None
    promoters = sum(distribution.get(k, 0) for k in [8, 9, 10])
    detractors = sum(distribution.get(k, 0) for k in [1, 2, 3, 4])
    return round(promoters - detractors, 1)


async def run_batch(slugs: list[str]) -> list[dict]:
    results = []

    for i, slug in enumerate(slugs, start=1):
        if i > 1:
            await asyncio.sleep(2)
        try:
            print(f"[{i}/{len(slugs)}] Scraping {slug}...")
            scraped = await get_rating_distribution(slug)
        except Exception as e:
            print(f"  Scrape error for '{slug}': {e}")
            results.append(
                {
                    "title": None,
                    "slug": slug,
                    "imdb_id": None,
                    "distribution": {},
                    "description": None,
                    "release_date": None,
                    "poster_url": None,
                    "tmdb_id": None,
                    "error": str(e),
                }
            )
            continue

        metadata = {}
        if scraped.get("imdb_id"):
            try:
                metadata = get_movie_metadata(scraped["imdb_id"])
            except Exception as e:
                print(f"  Metadata error for '{slug}' ({scraped['imdb_id']}): {e}")

        dist = scraped["distribution"]
        results.append(
            {
                "title": scraped["title"],
                "slug": scraped["slug"],
                "imdb_id": scraped["imdb_id"],
                "distribution": dist,
                "nps_score": calculate_nps(dist),
                "description": metadata.get("description"),
                "release_date": metadata.get("release_date"),
                "poster_url": metadata.get("poster_url"),
                "tmdb_id": metadata.get("tmdb_id"),
            }
        )

    return results


def save_json(results: list[dict], filename: str = "movie_data.json") -> None:
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)


def save_csv(results: list[dict], filename: str = "movie_data.csv") -> None:
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
            row = {
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
            print_histogram(result)

    save_json(results)
    save_csv(results)

    print("Saved results to:")
    print("  movie_data.json")
    print("  movie_data.csv")


if __name__ == "__main__":
    asyncio.run(main())
