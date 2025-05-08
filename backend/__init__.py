from flask import Flask
from flask_cors import CORS
from core.config import Config
from core.database import db
from routes.auth_routes import auth_bp
from routes.process_routes import process_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(auth_bp)
    app.register_blueprint(process_bp)

    return app
