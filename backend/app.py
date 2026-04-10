import json
from pathlib import Path
from typing import Any, Dict, List, Optional, TypedDict, cast

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class Movie(TypedDict):
    id: int
    title: str
    genre: str
    year: int
    ratings: List[float]


DATA_FILE = Path(__file__).with_name("movies.json")
DEFAULT_MOVIES: List[Movie] = [
    {
        "id": 1,
        "title": "The Godfather",
        "genre": "Crime",
        "year": 1972,
        "ratings": [5.0, 5.0, 4.0],
    },
    {
        "id": 2,
        "title": "Inception",
        "genre": "Sci-Fi",
        "year": 2010,
        "ratings": [5.0, 4.0, 5.0],
    },
    {
        "id": 3,
        "title": "Spirited Away",
        "genre": "Animation",
        "year": 2001,
        "ratings": [5.0, 5.0],
    },
]


def write_movies(movies: List[Movie]) -> None:
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(movies, file, indent=2)


def read_movies() -> List[Movie]:
    if not DATA_FILE.exists():
        write_movies(DEFAULT_MOVIES)
        return cast(List[Movie], json.loads(json.dumps(DEFAULT_MOVIES)))

    with DATA_FILE.open("r", encoding="utf-8") as file:
        return cast(List[Movie], json.load(file))


def average_rating(ratings: List[float]) -> Optional[float]:
    if not ratings:
        return None
    return round(sum(ratings) / len(ratings), 1)


def serialize_movie(movie: Movie, include_ratings: bool = False) -> Dict[str, Any]:
    ratings = movie.get("ratings", [])
    payload: Dict[str, Any] = {
        "id": movie["id"],
        "title": movie["title"],
        "genre": movie["genre"],
        "year": movie["year"],
        "rating_count": len(ratings),
        "average_rating": average_rating(ratings),
    }

    if include_ratings:
        payload["ratings"] = ratings

    return payload


def find_movie(movies: List[Movie], movie_id: int) -> Optional[Movie]:
    return next((movie for movie in movies if movie["id"] == movie_id), None)


read_movies()


@app.route("/")
def index():
    return jsonify(
        {
            "message": "Movie rating API is running.",
            "available_endpoints": [
                "/api/hello",
                "/api/movies",
                "/api/movies/<id>",
                "/api/movies/<id>/ratings",
            ],
            "frontend_dev_url": "http://localhost:5174",
        }
    )


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Velvet Ratings!"})


@app.route("/api/movies", methods=["GET"])
def list_movies():
    movies = read_movies()
    return jsonify([serialize_movie(movie) for movie in movies])


@app.route("/api/movies/<int:movie_id>", methods=["GET"])
def get_movie(movie_id: int):
    movies = read_movies()
    movie = find_movie(movies, movie_id)

    if not movie:
        return jsonify({"error": "Movie not found."}), 404

    return jsonify(serialize_movie(movie, include_ratings=True))


@app.route("/api/movies", methods=["POST"])
def add_movie():
    raw_data = request.get_json(silent=True)
    data: Dict[str, Any] = cast(Dict[str, Any], raw_data) if isinstance(raw_data, dict) else {}
    title = str(data.get("title", "")).strip()
    genre = str(data.get("genre", "")).strip()
    year = data.get("year")

    if not title or not genre or not isinstance(year, int):
        return jsonify({"error": "title, genre, and integer year are required."}), 400

    movies = read_movies()
    new_movie: Movie = {
        "id": max((movie["id"] for movie in movies), default=0) + 1,
        "title": title,
        "genre": genre,
        "year": year,
        "ratings": [],
    }
    movies.append(new_movie)
    write_movies(movies)

    return jsonify(serialize_movie(new_movie, include_ratings=True)), 201


@app.route("/api/movies/<int:movie_id>/ratings", methods=["POST"])
def add_rating(movie_id: int):
    raw_data = request.get_json(silent=True)
    data: Dict[str, Any] = cast(Dict[str, Any], raw_data) if isinstance(raw_data, dict) else {}
    rating = data.get("rating")

    if not isinstance(rating, (int, float)) or not 1 <= float(rating) <= 10:
        return jsonify({"error": "rating must be a number between 1 and 10."}), 400

    movies = read_movies()
    movie = find_movie(movies, movie_id)

    if not movie:
        return jsonify({"error": "Movie not found."}), 404

    movie.setdefault("ratings", []).append(round(float(rating), 1))
    write_movies(movies)

    return (
        jsonify(
            {
                "message": "Rating added successfully.",
                "movie": serialize_movie(movie, include_ratings=True),
            }
        ),
        201,
    )


@app.errorhandler(404)
def not_found(_error: Exception):
    return (
        jsonify(
            {
                "error": "Route not found.",
                "try": ["/", "/api/hello", "/api/movies"],
            }
        ),
        404,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5173)
