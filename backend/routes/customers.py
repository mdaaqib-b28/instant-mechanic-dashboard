from flask import Blueprint, jsonify, request
from models import Customer

customers_bp = Blueprint("customers", __name__)


@customers_bp.route("/api/customers", methods=["GET"])
def list_customers():
    page = request.args.get("page", 1, type=int)
    page_size = min(request.args.get("page_size", 20, type=int), 100)

    query = Customer.query.order_by(Customer.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify(
        {
            "items": [c.to_dict() for c in items],
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    )
