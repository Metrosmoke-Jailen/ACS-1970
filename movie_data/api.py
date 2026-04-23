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
    tmdb_id = movie["id"]

    # Get full movie details (includes runtime, budget, revenue, genres)
    details_url = f"https://api.themoviedb.org/3/movie/{tmdb_id}"
    details_params = {"api_key": TMDB_API_KEY}
    details_response = requests.get(details_url, params=details_params)
    details_data = details_response.json()

    # Get cast information
    credits_url = f"https://api.themoviedb.org/3/movie/{tmdb_id}/credits"
    credits_response = requests.get(credits_url, params=details_params)
    credits_data = credits_response.json()
    
    # Extract top 10 cast members
    cast = [
        {"name": person["name"], "character": person["character"]}
        for person in credits_data.get("cast", [])[:10]
    ]

    # Extract genres
    genres = [genre["name"] for genre in details_data.get("genres", [])]

    return {
        "title": movie["title"],
        "description": movie["overview"],
        "release_date": movie["release_date"],
        "poster_url": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
        # specified tmdb_id at top
        "tmdb_id": tmdb_id,
        "genres": genres,
        "runtime": details_data.get("runtime"),
        "budget": details_data.get("budget"),
        "revenue": details_data.get("revenue"),
        "vote_average": details_data.get("vote_average"),
        "vote_count": details_data.get("vote_count"),
        "popularity": details_data.get("popularity"),
        "cast": cast,
    }
