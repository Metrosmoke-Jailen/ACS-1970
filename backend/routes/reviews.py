from flask import Blueprint, jsonify, request

from db.db import get_connection

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@reviews_bp.post("/")
def create_review():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    target_type = data.get("target_type")
    target_id = data.get("target_id")

    if not all([user_id, target_type, target_id]):
        return jsonify({"error": "user_id, target_type, and target_id are required"}), 400

    with get_connection() as conn:
        try:
            conn.execute(
                """
                INSERT INTO reviews (user_id, target_type, target_id, rating, body)
                VALUES (?, ?, ?, ?, ?)
                """,
                (user_id, target_type, target_id, data.get("rating"), data.get("body")),
            )
            conn.commit()
        except Exception as e:
            if "UNIQUE constraint" in str(e):
                return jsonify({"error": "review already exists for this user and target"}), 409
            raise

        row = conn.execute(
            "SELECT * FROM reviews WHERE user_id = ? AND target_type = ? AND target_id = ?",
            (user_id, target_type, target_id),
        ).fetchone()

    return jsonify(dict(row)), 201


@reviews_bp.get("/<target_type>/<int:target_id>")
def get_reviews(target_type: str, target_id: int):
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM reviews WHERE target_type = ? AND target_id = ? ORDER BY created_at DESC",
            (target_type, target_id),
        ).fetchall()
    return jsonify([dict(r) for r in rows])


@reviews_bp.patch("/<int:review_id>")
def update_review(review_id: int):
    data = request.get_json(silent=True) or {}
    fields = {k: data[k] for k in ("rating", "body") if k in data}
    if not fields:
        return jsonify({"error": "nothing to update"}), 400

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    with get_connection() as conn:
        result = conn.execute(
            f"UPDATE reviews SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (*fields.values(), review_id),
        )
        conn.commit()
        if result.rowcount == 0:
            return jsonify({"error": "not found"}), 404
        row = conn.execute("SELECT * FROM reviews WHERE id = ?", (review_id,)).fetchone()

    return jsonify(dict(row))


@reviews_bp.delete("/<int:review_id>")
def delete_review(review_id: int):
    with get_connection() as conn:
        result = conn.execute("DELETE FROM reviews WHERE id = ?", (review_id,))
        conn.commit()
        if result.rowcount == 0:
            return jsonify({"error": "not found"}), 404
    return "", 204
