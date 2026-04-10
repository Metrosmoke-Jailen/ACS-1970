# CLAUDE.md

## Project Overview

Letterboxd rating histogram web scraper for ACS 1970 coursework. Scrapes rating distribution data from Letterboxd film pages and outputs histograms, JSON, and CSV files.

## Stack

- **Python 3.12**
- **Playwright** (async, Chromium headless) — renders JS-heavy Letterboxd pages
- **BeautifulSoup4** — parses HTML after Playwright fetches it
- **Flask + flask-cors** — listed in requirements, not yet wired up (likely future API layer)

## File Structure

```
scraper.py        # Core scraping logic — get_rating_distribution(), print_histogram()
many_movies.py    # Batch runner — scrapes a hardcoded list of slugs, saves JSON + CSV
requirements.txt  # Pinned dependencies
```

## Key Concepts

### Rating Buckets (STAR_TO_INT)
Letterboxd uses half-star increments mapped to integers 1–10:
- `1` = half-★, `2` = ★, ..., `10` = ★★★★★

### Film Slugs
Films are identified by URL slug (e.g. `inception`, `the-godfather`, `parasite-2019`). Pass these to `get_rating_distribution(slug)`.

### Output Files (from many_movies.py)
- `movie_histograms.json` — full results array with title, slug, distribution dict
- `movie_histograms.csv` — flat table with columns bucket_1 through bucket_10

## Running

```bash
# Single film (call from Python)
python -c "import asyncio; from scraper import get_rating_distribution, print_histogram; asyncio.run(get_rating_distribution('inception'))"

# Batch run (hardcoded slug list in many_movies.py)
python many_movies.py
```

## Notes

- Playwright blocks images/CSS/fonts to speed up scraping (`page.route` abort pattern)
- User-agent is spoofed to avoid bot detection
- The scraper waits for `.rating-histogram` selector before parsing — if Letterboxd changes their DOM this is the first thing to check
- Flask is in requirements but has no implementation yet in this directory
