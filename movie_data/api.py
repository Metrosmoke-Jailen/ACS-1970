import requests, os
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("MOVIE_API_KEY")


def get_movie_metadata(imdb_id: str) -> dict:
    url = f"https://api.themoviedb.org/3/find/{imdb_id}"
    params = {"api_key": TMDB_API_KEY, "external_source": "imdb_id"}
    response = requests.get(url, params=params)
    data = response.json()

    movie = data["movie_results"][0]

    return {
        "title": movie["title"],
        "description": movie["overview"],
        "release_date": movie["release_date"],
        "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
        "tmdb_id": movie["id"],
    }
