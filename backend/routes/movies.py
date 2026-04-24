import json

from flask import Blueprint, jsonify
from sqlalchemy.dialects.sqlite import insert as sqlite_insert

from db.db import Movie, MovieDistribution
from extensions import db
from models import MovieSchema

movies_bp = Blueprint("movies", __name__, url_prefix="/api/movies")


def save_movies(results: list[MovieSchema]) -> None:
    try:
        for result in results:
            genres = result.get("genres")
            cast = result.get("cast")

            stmt = (
                sqlite_insert(Movie)
                .values(
                    slug=result["slug"],
                    title=result.get("title"),
                    imdb_id=result.get("imdb_id"),
                    tmdb_id=result.get("tmdb_id"),
                    description=result.get("description"),
                    release_date=result.get("release_date"),
                    poster_url=result.get("poster_url"),
                    nps_score=result.get("nps_score"),
                    genres=json.dumps(genres) if genres is not None else None,
                    runtime=result.get("runtime"),
                    cast=json.dumps(cast) if cast is not None else None,
                    error=result.get("error"),
                )
                .on_conflict_do_update(
                    index_elements=["slug"],
                    set_=dict(
                        title=result.get("title"),
                        imdb_id=result.get("imdb_id"),
                        tmdb_id=result.get("tmdb_id"),
                        description=result.get("description"),
                        release_date=result.get("release_date"),
                        poster_url=result.get("poster_url"),
                        nps_score=result.get("nps_score"),
                        genres=json.dumps(genres) if genres is not None else None,
                        runtime=result.get("runtime"),
                        cast=json.dumps(cast) if cast is not None else None,
                        error=result.get("error"),
                    ),
                )
            )
            db.session.execute(stmt)
            db.session.flush()

            movie = db.session.query(Movie).filter_by(slug=result["slug"]).first()
            if movie is None:
                continue

            db.session.query(MovieDistribution).filter_by(movie_id=movie.id).delete()

            for bucket, pct in sorted(result.get("distribution", {}).items()):
                db.session.add(
                    MovieDistribution(
                        movie_id=movie.id,
                        bucket=int(bucket),
                        percentage=int(pct),
                    )
                )

        db.session.commit()
    except Exception:
        db.session.rollback()
        raise


@movies_bp.get("/")
def get_movies():
    movies = db.session.query(Movie).filter(Movie.error.is_(None)).all()
    return jsonify(
        [
            {
                "id": m.id,
                "slug": m.slug,
                "title": m.title,
                "imdb_id": m.imdb_id,
                "tmdb_id": m.tmdb_id,
                "description": m.description,
                "release_date": m.release_date,
                "poster_url": m.poster_url,
                "nps_score": m.nps_score,
            }
            for m in movies
        ]
    )


@movies_bp.get("/<slug>")
def get_movie(slug: str):
    movie = db.session.query(Movie).filter_by(slug=slug).first()
    if movie is None:
        return jsonify({"error": "not found"}), 404

    distribution = {
        d.bucket: d.percentage
        for d in sorted(movie.distributions, key=lambda d: d.bucket)
    }

    return jsonify(
        {
            "id": movie.id,
            "slug": movie.slug,
            "title": movie.title,
            "imdb_id": movie.imdb_id,
            "tmdb_id": movie.tmdb_id,
            "description": movie.description,
            "release_date": movie.release_date,
            "poster_url": movie.poster_url,
            "nps_score": movie.nps_score,
            "genres": json.loads(movie.genres) if movie.genres else [],
            "cast": json.loads(movie.cast) if movie.cast else [],
            "runtime": movie.runtime,
            "distribution": distribution,
        }
    )
