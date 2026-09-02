from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from models import db, Booking, Customer, Mechanic

bookings_bp = Blueprint("bookings", __name__)


@bookings_bp.route("/api/bookings", methods=["GET"])
def list_bookings():
    page = request.args.get("page", 1, type=int)
    page_size = min(request.args.get("page_size", 20, type=int), 100)
    search = request.args.get("search", "", type=str).strip()
    status = request.args.get("status", "", type=str).strip()
    sort_by = request.args.get("sort_by", "created_at", type=str)
    sort_dir = request.args.get("sort_dir", "desc", type=str)

    query = Booking.query.join(Customer, isouter=True)

    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(
                Customer.name.ilike(like),
                Booking.vehicle_make.ilike(like),
                Booking.vehicle_model.ilike(like),
                Booking.service_category.ilike(like),
            )
        )

    if status:
        query = query.filter(Booking.status == status)

    sort_column_map = {
        "created_at": Booking.created_at,
        "amount": Booking.amount,
        "status": Booking.status,
        "scheduled_at": Booking.scheduled_at,
    }
    sort_column = sort_column_map.get(sort_by, Booking.created_at)
    query = query.order_by(sort_column.desc() if sort_dir == "desc" else sort_column.asc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify(
        {
            "items": [b.to_dict() for b in items],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total + page_size - 1) // page_size),
        }
    )


@bookings_bp.route("/api/bookings/<int:booking_id>", methods=["GET"])
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    return jsonify(booking.to_dict())


@bookings_bp.route("/api/bookings/<int:booking_id>/status", methods=["PATCH"])
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    new_status = request.json.get("status") if request.is_json else None
    if not new_status:
        return jsonify({"error": "status is required"}), 400
    booking.status = new_status
    db.session.commit()
    return jsonify(booking.to_dict())
