import asyncio
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup


STAR_TO_INT = {
    "half-★": 1,
    "★": 2,
    "★½": 3,
    "★★": 4,
    "★★½": 5,
    "★★★": 6,
    "★★★½": 7,
    "★★★★": 8,
    "★★★★½": 9,
    "★★★★★": 10,
}

BAR_WIDTH = 40  # max characters for histogram bars


async def get_rating_distribution(film_slug: str) -> dict:
    url = f"https://letterboxd.com/film/{film_slug}/"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        await page.route(
            "**/*.{png,jpg,jpeg,gif,svg,woff2,css}", lambda route: route.abort()
        )

        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_selector(".rating-histogram", timeout=10000)

        html = await page.content()
        await browser.close()

    soup = BeautifulSoup(html, "html.parser")

    title = soup.find("h1", class_="headline-1")
    film_title = title.get_text(strip=True) if title else film_slug

    histogram_div = soup.find("div", class_="rating-histogram")
    if not histogram_div:
        raise ValueError(f"No histogram found for '{film_slug}'")

    bars = histogram_div.find_all("li", class_="rating-histogram-bar")

    distribution = {}  # bucket_int (1–10) -> percentage int
    for bar in bars:
        link = bar.find("a")
        if not link:
            continue

        title_attr = link.get("data-original-title", "")
        pct_match = re.search(r"\((\d+)%\)", title_attr)
        pct = int(pct_match.group(1)) if pct_match else 0

        star_label_match = re.search(r"[\d,]+ (.+?) ratings", title_attr)
        if not star_label_match:
            continue
        star_label = star_label_match.group(1).strip()
        bucket = STAR_TO_INT.get(star_label)
        if bucket is None:
            continue

        distribution[bucket] = pct

    return {"title": film_title, "slug": film_slug, "distribution": distribution}


def print_histogram(result: dict):
    INT_TO_STAR = {v: k for k, v in STAR_TO_INT.items()}
    dist = result["distribution"]
    max_pct = max(dist.values(), default=1)

    print(f"\n  {result['title']}")
    print(f"  {'─' * 50}")
    for bucket in range(1, 11):
        star = INT_TO_STAR[bucket]
        pct = dist.get(bucket, 0)
        bar = "█" * round(pct / max_pct * BAR_WIDTH)
        print(f"  {star:8s} | {bar:<{BAR_WIDTH}} {pct:2d}%")
    print()
