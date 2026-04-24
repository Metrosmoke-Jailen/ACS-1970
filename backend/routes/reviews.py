from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from db.db import Review, User
from extensions import db

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


def _review_dict(r: Review) -> dict:
    return {
        "id": r.id,
        "user_id": r.user_id,
        "target_type": r.target_type,
        "target_id": r.target_id,
        "rating": r.rating,
        "body": r.body,
        "created_at": r.created_at,
        "updated_at": r.updated_at,
    }


@reviews_bp.post("/")
def create_review():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    target_type = data.get("target_type")
    target_id = data.get("target_id")

    if not all([user_id, target_type, target_id]):
        return jsonify({"error": "user_id, target_type, and target_id are required"}), 400

    try:
        review = Review(
            user_id=user_id,
            target_type=target_type,
            target_id=target_id,
            rating=data.get("rating"),
            body=data.get("body"),
        )
        db.session.add(review)
        db.session.commit()
        db.session.refresh(review)
        return jsonify(_review_dict(review)), 201
    except IntegrityError as e:
        db.session.rollback()
        if "UNIQUE constraint" in str(e.orig):
            return jsonify({"error": "review already exists for this user and target"}), 409
        raise


@reviews_bp.get("/<target_type>/<int:target_id>")
def get_reviews(target_type: str, target_id: int):
    rows = (
        db.session.query(Review, User.username)
        .join(User, Review.user_id == User.id)
        .filter(Review.target_type == target_type, Review.target_id == target_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return jsonify([{**_review_dict(r), "username": username} for r, username in rows])


@reviews_bp.patch("/<int:review_id>")
def update_review(review_id: int):
    data = request.get_json(silent=True) or {}
    fields = {k: data[k] for k in ("rating", "body") if k in data}
    if not fields:
        return jsonify({"error": "nothing to update"}), 400

    review = db.session.query(Review).filter_by(id=review_id).first()
    if review is None:
        return jsonify({"error": "not found"}), 404
    try:
        for key, val in fields.items():
            setattr(review, key, val)
        db.session.commit()
        db.session.refresh(review)
        return jsonify(_review_dict(review))
    except Exception:
        db.session.rollback()
        raise


@reviews_bp.delete("/<int:review_id>")
def delete_review(review_id: int):
    review = db.session.query(Review).filter_by(id=review_id).first()
    if review is None:
        return jsonify({"error": "not found"}), 404
    try:
        db.session.delete(review)
        db.session.commit()
        return "", 204
    except Exception:
        db.session.rollback()
        raise
