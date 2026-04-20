import asyncio
import csv
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from collect_movies import run_batch

FAILED_TXT = Path(__file__).with_name("failed.txt")
SEED_JSON = Path(__file__).with_name("seed_data.json")
SEED_CSV = Path(__file__).with_name("seed_data.csv")


async def search_letterboxd_slug(browser, query: str) -> str | None:
    """Search Letterboxd and return the slug of the first film result."""
    url = f"https://letterboxd.com/search/films/{query}/"
    context = await browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1280, "height": 800},
    )
    page = await context.new_page()

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_selector("ul.results", timeout=15000)
        html = await page.content()
    except Exception as e:
        print(f"  Search failed for '{query}': {e}")
        await context.close()
        return None

    await context.close()

    soup = BeautifulSoup(html, "html.parser")
    first = soup.select_one("ul.results li .react-component[data-item-slug]")
    if first:
        return first["data-item-slug"]

    return None


def load_failed_slugs() -> list[str]:
    lines = FAILED_TXT.read_text(encoding="utf-8").splitlines()
    return [line.strip() for line in lines if line.strip() and not line.startswith("Failed")]


def append_json(new_results: list[dict]) -> None:
    existing = json.loads(SEED_JSON.read_text(encoding="utf-8"))
    # only treat non-error entries as already done
    existing_good_slugs = {r["slug"] for r in existing if not r.get("error")}
    # remove error entries that we now have good data for
    new_slugs = {r["slug"] for r in new_results if not r.get("error")}
    existing = [r for r in existing if r["slug"] not in new_slugs]
    to_add = [r for r in new_results if r["slug"] not in existing_good_slugs]
    existing.extend(to_add)
    SEED_JSON.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Appended/replaced {len(to_add)} entries in {SEED_JSON.name}")


def append_csv(new_results: list[dict]) -> None:
    fieldnames = [
        "title", "slug", "imdb_id", "tmdb_id", "release_date", "description",
        "poster_url", "bucket_1", "bucket_2", "bucket_3", "bucket_4", "bucket_5",
        "bucket_6", "bucket_7", "bucket_8", "bucket_9", "bucket_10", "nps_score", "error",
    ]

    # read existing rows, keeping only non-error ones not superseded by new results
    existing_rows: list[dict] = []
    new_slugs = {r["slug"] for r in new_results if not r.get("error")}
    if SEED_CSV.exists():
        with open(SEED_CSV, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                # drop error rows we now have good data for
                if row["slug"] in new_slugs:
                    continue
                existing_rows.append(row)

    existing_good_slugs = {r["slug"] for r in existing_rows}
    to_add = [r for r in new_results if r["slug"] not in existing_good_slugs]

    # rewrite the whole CSV with existing good rows + new ones
    with open(SEED_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing_rows)
        for result in to_add:
            dist = result.get("distribution", {})
            writer.writerow({
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
            })

    print(f"  Appended {len(to_add)} entries to {SEED_CSV.name}")


async def main():
    failed_slugs = load_failed_slugs()
    print(f"Resolving {len(failed_slugs)} failed slugs via Letterboxd search...\n")

    resolved: list[str] = []
    still_failed: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        for i, slug in enumerate(failed_slugs, start=1):
            print(f"[{i}/{len(failed_slugs)}] Searching for '{slug}'...")
            found = await search_letterboxd_slug(browser, slug.replace("-", " "))
            if found:
                print(f"  -> resolved to '{found}'")
                resolved.append(found)
            else:
                print(f"  -> no result found")
                still_failed.append(slug)
            if i < len(failed_slugs):
                await asyncio.sleep(1.5)

        await browser.close()

    print(f"\nResolved {len(resolved)}, still failed: {len(still_failed)}")

    if still_failed:
        print("Still failed:", still_failed)

    if not resolved:
        print("Nothing to scrape.")
        return

    print(f"\nScraping {len(resolved)} resolved slugs...\n")
    results = await run_batch(resolved)

    success = [r for r in results if not r.get("error")]
    errors = [r for r in results if r.get("error")]
    print(f"\nDone. {len(success)} succeeded, {len(errors)} failed.")

    print("\nAppending to seed files...")
    append_json(results)
    append_csv(results)


if __name__ == "__main__":
    asyncio.run(main())
