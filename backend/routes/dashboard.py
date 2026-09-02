from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from sqlalchemy import func
from models import db, Booking, Mechanic, Customer

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def get_dashboard():
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    total_bookings = db.session.query(func.count(Booking.id)).scalar()
    today_bookings = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.created_at >= today_start)
        .scalar()
    )
    completed = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.status == "Completed")
        .scalar()
    )
    pending = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.status.in_(["Pending", "Assigned", "Mechanic On The Way", "In Progress"]))
        .scalar()
    )
    cancelled = (
        db.session.query(func.count(Booking.id))
        .filter(Booking.status == "Cancelled")
        .scalar()
    )
    total_revenue = (
        db.session.query(func.coalesce(func.sum(Booking.amount), 0))
        .filter(Booking.status == "Completed")
        .scalar()
    )
    active_mechanics = (
        db.session.query(func.count(Mechanic.id))
        .filter(Mechanic.status != "Off Duty")
        .scalar()
    )
    new_customers = (
        db.session.query(func.count(Customer.id))
        .filter(Customer.created_at >= today_start)
        .scalar()
    )

    # Bookings over last 14 days
    since = datetime.utcnow() - timedelta(days=14)
    daily_rows = (
        db.session.query(
            func.date(Booking.created_at).label("day"),
            func.count(Booking.id).label("count"),
            func.coalesce(func.sum(Booking.amount), 0).label("revenue"),
        )
        .filter(Booking.created_at >= since)
        .group_by(func.date(Booking.created_at))
        .order_by(func.date(Booking.created_at))
        .all()
    )
    bookings_over_time = [
        {"date": str(row.day), "bookings": row.count, "revenue": float(row.revenue)}
        for row in daily_rows
    ]

    status_rows = (
        db.session.query(Booking.status, func.count(Booking.id))
        .group_by(Booking.status)
        .all()
    )
    status_breakdown = [{"status": s, "count": c} for s, c in status_rows]

    category_rows = (
        db.session.query(Booking.service_category, func.count(Booking.id))
        .group_by(Booking.service_category)
        .all()
    )
    category_breakdown = [{"category": cat, "count": c} for cat, c in category_rows]

    return jsonify(
        {
            "total_bookings": total_bookings,
            "today_bookings": today_bookings,
            "completed_bookings": completed,
            "pending_bookings": pending,
            "cancelled_bookings": cancelled,
            "total_revenue": float(total_revenue),
            "active_mechanics": active_mechanics,
            "new_customers_today": new_customers,
            "bookings_over_time": bookings_over_time,
            "status_breakdown": status_breakdown,
            "category_breakdown": category_breakdown,
        }
    )
