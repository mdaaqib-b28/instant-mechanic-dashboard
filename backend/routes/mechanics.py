from flask import Blueprint, jsonify
from models import Mechanic

mechanics_bp = Blueprint("mechanics", __name__)


@mechanics_bp.route("/api/mechanics", methods=["GET"])
def list_mechanics():
    mechanics = Mechanic.query.all()
    return jsonify([m.to_dict(include_last_booking=True) for m in mechanics])


@mechanics_bp.route("/api/mechanics/<int:mechanic_id>", methods=["GET"])
def get_mechanic(mechanic_id):
    mechanic = Mechanic.query.get_or_404(mechanic_id)
    return jsonify(mechanic.to_dict(include_last_booking=True))
