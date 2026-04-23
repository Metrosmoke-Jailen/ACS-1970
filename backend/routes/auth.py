from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required, login_user, logout_user

from db.db import User
from extensions import bcrypt, db

user_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@user_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([username, email, password]):
        return jsonify({"error": "username, email, and password are required"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "username or email already in use"}), 409

    user = User(
        username=username,
        email=email,
        password=bcrypt.generate_password_hash(password).decode("utf-8"),
    )
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return jsonify({"id": user.id, "username": user.username, "email": user.email}), 201


@user_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not all([email, password]):
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "invalid email or password"}), 401

    login_user(user)
    return jsonify({"id": user.id, "username": user.username, "email": user.email})


@user_bp.post("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "logged out"})


@user_bp.get("/check")
def check():
    if current_user.is_authenticated:
        return jsonify({"id": current_user.id, "username": current_user.username, "email": current_user.email})
    return jsonify({"error": "not authenticated"}), 401
