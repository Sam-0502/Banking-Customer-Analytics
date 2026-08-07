from flask import Flask
from flask_cors import CORS
from backend import db
from backend.config import Config
from backend.api import api_blueprint
from backend.utils.logger import configure_logger
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ]}})
    configure_logger(app)
    db.init_app(app)

    database_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'database'))
    os.makedirs(database_dir, exist_ok=True)
    with app.app_context():
        db.create_all()

    app.register_blueprint(api_blueprint, url_prefix='/api')
    return app


app = create_app()

if __name__ == "__main__":
    # For development use the built‑in server
    app.run(host="0.0.0.0", port=5000, debug=True)
