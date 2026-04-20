from flask import Blueprint, jsonify

from db import get_connection
from models import MovieDistributionSchema, MovieSchema

movies_bp = Blueprint("movies", __name__, url_prefix="/api/movies")


def save_movies(results: list[MovieSchema]) -> None:
    with get_connection() as conn:
        for result in results:
            conn.execute(
                """
                INSERT INTO movies (
                    slug, title, imdb_id, tmdb_id, description,
                    release_date, poster_url, nps_score, error, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(slug) DO UPDATE SET
                    title = excluded.title,
                    imdb_id = excluded.imdb_id,
                    tmdb_id = excluded.tmdb_id,
                    description = excluded.description,
                    release_date = excluded.release_date,
                    poster_url = excluded.poster_url,
                    nps_score = excluded.nps_score,
                    error = excluded.error,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (
                    result["slug"],
                    result.get("title"),
                    result.get("imdb_id"),
                    result.get("tmdb_id"),
                    result.get("description"),
                    result.get("release_date"),
                    result.get("poster_url"),
                    result.get("nps_score"),
                    result.get("error"),
                ),
            )

            movie_row = conn.execute(
                "SELECT id FROM movies WHERE slug = ?", (result["slug"],)
            ).fetchone()
            if movie_row is None:
                continue

            movie_id = int(movie_row[0])
            conn.execute("DELETE FROM movie_distributions WHERE movie_id = ?", (movie_id,))

            distribution_rows: list[MovieDistributionSchema] = [
                {"movie_id": movie_id, "bucket": int(bucket), "percentage": int(pct)}
                for bucket, pct in sorted(result.get("distribution", {}).items())
            ]

            conn.executemany(
                """
                INSERT INTO movie_distributions (movie_id, bucket, percentage)
                VALUES (:movie_id, :bucket, :percentage)
                """,
                distribution_rows,
            )

        conn.commit()


@movies_bp.get("/")
def get_movies():
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, slug, title, imdb_id, tmdb_id, description, release_date, poster_url, nps_score FROM movies WHERE error IS NULL"
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@movies_bp.get("/<slug>")
def get_movie(slug: str):
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, slug, title, imdb_id, tmdb_id, description, release_date, poster_url, nps_score FROM movies WHERE slug = ?",
            (slug,),
        ).fetchone()
        if row is None:
            return jsonify({"error": "not found"}), 404

        distribution = conn.execute(
            "SELECT bucket, percentage FROM movie_distributions WHERE movie_id = ? ORDER BY bucket",
            (row["id"],),
        ).fetchall()

    movie = dict(row)
    movie["distribution"] = {r["bucket"]: r["percentage"] for r in distribution}
    return jsonify(movie)
