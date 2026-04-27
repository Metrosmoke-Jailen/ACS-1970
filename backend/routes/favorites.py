from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError

from db.db import Favorite, Movie
from extensions import db

favorites_bp = Blueprint("favorites", __name__, url_prefix="/api/favorites")


@favorites_bp.post("/")
@login_required
def toggle_favorite():
    data = request.get_json(silent=True) or {}
    movie_id = data.get("movie_id")
    if not movie_id:
        return jsonify({"error": "movie_id is required"}), 400

    existing = db.session.query(Favorite).filter_by(
        user_id=current_user.id, movie_id=movie_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"favorited": False})

    favorite = Favorite(user_id=current_user.id, movie_id=movie_id)
    db.session.add(favorite)
    db.session.commit()
    return jsonify({"favorited": True}), 201


@favorites_bp.get("/")
@login_required
def get_favorites():
    rows = (
        db.session.query(Favorite, Movie)
        .join(Movie, Favorite.movie_id == Movie.id)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )
    return jsonify([
        {
            "id": movie.id,
            "slug": movie.slug,
            "title": movie.title,
            "poster_url": movie.poster_url,
            "nps_score": movie.nps_score,
            "release_date": movie.release_date,
        }
        for _, movie in rows
    ])


@favorites_bp.get("/<int:movie_id>")
@login_required
def check_favorite(movie_id: int):
    exists = db.session.query(Favorite).filter_by(
        user_id=current_user.id, movie_id=movie_id
    ).first() is not None
    return jsonify({"favorited": exists})
