from flask import Flask
from flask_cors import CORS

from db import setup_database
from routes.movies import movies_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    setup_database()

    app.register_blueprint(movies_bp)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
