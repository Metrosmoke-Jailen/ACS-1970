# ACS-1970

A movie rating analytics app — scrapes Letterboxd rating histograms, stores them in SQLite, and serves them via a Flask API with a React frontend.

## Prerequisites

- Python 3.12+
- Node.js 18+
- A [TMDb API key](https://www.themoviedb.org/settings/api) (for metadata fetching in `movie_data/`)

## Project Structure

```
backend/        # Flask API + SQLite database
movie_data/     # Scraper scripts and seed data files
frontend/       # React (Vite) frontend
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

### Frontend

```bash
cd frontend
npm install
```

### Environment

Create a `.env` file in `movie_data/`:
```
MOVIE_API_KEY=your_tmdb_api_key
```

## Starting the App

From the project root:

```bash
./start.sh
```

- **Backend** — Flask API at `http://localhost:5000`
- **Frontend** — React (Vite) at `http://localhost:5173`

Press `Ctrl+C` to stop both.

## Running Separately

**Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/movies/` | All movies (no errors) |
| GET | `/movies/<slug>` | Single movie with distribution |

## Backend Structure

```
backend/
  app.py          # App factory — registers blueprints, initializes DB
  config.py       # DB path and environment config
  db.py           # SQLite connection + schema setup (DDL)
  models.py       # TypedDict schemas (MovieSchema, MovieDistributionSchema)
  routes/
    movies.py     # /movies routes + save_movies() for seeding
```

## Scraper / Data Collection

See `movie_data/CLAUDE.md` for full details on the scraper scripts.

**Quick reference:**
```bash
cd movie_data
source ../backend/venv/bin/activate

python collect_movies.py   # scrape hardcoded 20-film list
python seed.py             # scrape ~500 TMDb top-rated films
python fix_failed.py       # retry failed slugs via Letterboxd search
```

Seed data is stored in `movie_data/seed_data.json` and `seed_data.csv` (497 films).
