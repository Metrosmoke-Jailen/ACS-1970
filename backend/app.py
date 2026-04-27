import os

from flask import Flask
from flask_cors import CORS
from sqlalchemy import event

from config import DATABASE_URL
from extensions import bcrypt, db, login_manager
from routes.auth import user_bp
from routes.favorites import favorites_bp
from routes.movies import movies_bp
from routes.reviews import reviews_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    CORS(app, supports_credentials=True, origins=["http://localhost:5174"])

    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        @event.listens_for(db.engine, "connect")
        def _set_sqlite_pragma(dbapi_conn, _):
            dbapi_conn.execute("PRAGMA foreign_keys = ON")

        from db.db import setup_database
        setup_database()

    app.register_blueprint(user_bp)
    app.register_blueprint(movies_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(favorites_bp)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
