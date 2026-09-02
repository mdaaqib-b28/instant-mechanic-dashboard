from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

BOOKING_STATUSES = [
    "Pending",
    "Assigned",
    "Mechanic On The Way",
    "In Progress",
    "Completed",
    "Cancelled",
]

SERVICE_CATEGORIES = [
    "Engine Repair",
    "Battery Jumpstart",
    "Tyre Replacement",
    "Brake Service",
    "Oil Change",
    "AC Repair",
    "General Inspection",
    "Towing",
]


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship("Booking", backref="customer", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "city": self.city,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Mechanic(db.Model):
    __tablename__ = "mechanics"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    specialty = db.Column(db.String(80), nullable=False)
    status = db.Column(db.String(30), default="Available")  # Available, On Job, Off Duty
    rating = db.Column(db.Float, default=4.5)
    jobs_completed = db.Column(db.Integer, default=0)
    city = db.Column(db.String(80), nullable=False)

    bookings = db.relationship("Booking", backref="mechanic", lazy=True)

    def to_dict(self, include_last_booking=False):
        data = {
            "id": self.id,
            "name": self.name,
            "specialty": self.specialty,
            "status": self.status,
            "rating": self.rating,
            "jobs_completed": self.jobs_completed,
            "city": self.city,
        }
        if include_last_booking:
            last = (
                Booking.query.filter_by(mechanic_id=self.id)
                .order_by(Booking.scheduled_at.desc())
                .first()
            )
            data["last_booking"] = last.to_dict(shallow=True) if last else None
        return data


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)
    mechanic_id = db.Column(db.Integer, db.ForeignKey("mechanics.id"), nullable=True)

    vehicle_make = db.Column(db.String(60), nullable=False)
    vehicle_model = db.Column(db.String(60), nullable=False)
    service_category = db.Column(db.String(80), nullable=False)
    status = db.Column(db.String(30), default="Pending")
    amount = db.Column(db.Float, nullable=False)
    scheduled_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self, shallow=False):
        data = {
            "id": self.id,
            "vehicle": f"{self.vehicle_make} {self.vehicle_model}",
            "service_category": self.service_category,
            "status": self.status,
            "amount": self.amount,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if shallow:
            return data

        data["customer"] = self.customer.name if self.customer else None
        data["customer_id"] = self.customer_id
        data["mechanic"] = self.mechanic.name if self.mechanic else "Unassigned"
        data["mechanic_id"] = self.mechanic_id
        data["created_at"] = self.created_at.isoformat() if self.created_at else None
        return data
