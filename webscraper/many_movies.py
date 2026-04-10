import asyncio
import csv
import json

from scraper import get_rating_distribution, print_histogram


async def run_batch(slugs: list[str]) -> list[dict]:
    results = []

    for i, slug in enumerate(slugs, start=1):
        try:
            print(f"[{i}/{len(slugs)}] Scraping {slug}...")
            result = await get_rating_distribution(slug)
            results.append(result)
        except Exception as e:
            error_result = {
                "title": None,
                "slug": slug,
                "distribution": {},
                "error": str(e),
            }
            results.append(error_result)
            print(f"Error scraping '{slug}': {e}")

    return results


def save_json(results: list[dict], filename: str = "movie_histograms.json") -> None:
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)


def save_csv(results: list[dict], filename: str = "movie_histograms.csv") -> None:
    fieldnames = [
        "title",
        "slug",
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

    print("\nFinished scraping.\n")

    for result in results:
        if result.get("error"):
            print(f"{result['slug']}: ERROR -> {result['error']}")
        else:
            print_histogram(result)

    save_json(results)
    save_csv(results)

    print("Saved results to:")
    print("  movie_histograms.json")
    print("  movie_histograms.csv")


if __name__ == "__main__":
    asyncio.run(main())