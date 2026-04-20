from flask import Flask
from flask_cors import CORS
from database import setup_database

app = Flask(__name__)
CORS(app)

setup_database()


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    app.run(debug=True)
