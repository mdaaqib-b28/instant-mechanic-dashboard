from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from models import db
from routes.dashboard import dashboard_bp
from routes.bookings import bookings_bp
from routes.mechanics import mechanics_bp
from routes.customers import customers_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_ORIGIN"]}})

    app.register_blueprint(dashboard_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(mechanics_bp)
    app.register_blueprint(customers_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "not found"}), 404

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
