"""
Seed script: creates realistic sample data.
Run: python seed.py
"""
import random
from datetime import datetime, timedelta

from faker import Faker

from app import create_app
from models import db, Customer, Mechanic, Booking, SERVICE_CATEGORIES

fake = Faker("en_IN")

VEHICLE_MAKES = {
    "Maruti Suzuki": ["Swift", "Baleno", "WagonR", "Dzire", "Ertiga"],
    "Hyundai": ["i20", "Creta", "Venue", "Verna"],
    "Tata": ["Nexon", "Punch", "Altroz", "Harrier"],
    "Honda": ["City", "Amaze", "WR-V"],
    "Toyota": ["Innova", "Fortuner", "Glanza"],
    "Mahindra": ["XUV700", "Scorpio", "Bolero"],
}

CITIES = ["Pune", "Noida", "Gurgaon", "Bengaluru", "Mumbai", "Delhi", "Hyderabad"]
MECHANIC_STATUSES = ["Available", "On Job", "Off Duty"]
SPECIALTIES = [
    "Engine Repair",
    "Electrical Systems",
    "Brake & Suspension",
    "AC Repair",
    "General Maintenance",
    "Tyre & Wheel",
]


def seed():
    app = create_app()
    with app.app_context():
        print("Dropping and recreating tables...")
        db.drop_all()
        db.create_all()

        print("Creating mechanics...")
        mechanics = []
        for _ in range(25):
            m = Mechanic(
                name=fake.name(),
                specialty=random.choice(SPECIALTIES),
                status=random.choices(MECHANIC_STATUSES, weights=[0.5, 0.35, 0.15])[0],
                rating=round(random.uniform(3.5, 5.0), 1),
                jobs_completed=random.randint(5, 400),
                city=random.choice(CITIES),
            )
            mechanics.append(m)
        db.session.add_all(mechanics)
        db.session.commit()

        print("Creating customers...")
        customers = []
        for _ in range(80):
            c = Customer(
                name=fake.name(),
                phone=fake.phone_number()[:20],
                email=fake.unique.email(),
                city=random.choice(CITIES),
                created_at=fake.date_time_between(start_date="-60d", end_date="now"),
            )
            customers.append(c)
        db.session.add_all(customers)
        db.session.commit()

        print("Creating bookings...")
        statuses_weighted = [
            ("Completed", 0.45),
            ("Pending", 0.12),
            ("Assigned", 0.10),
            ("Mechanic On The Way", 0.08),
            ("In Progress", 0.10),
            ("Cancelled", 0.15),
        ]
        status_choices = [s for s, _ in statuses_weighted]
        status_weights = [w for _, w in statuses_weighted]

        bookings = []
        for _ in range(650):
            make = random.choice(list(VEHICLE_MAKES.keys()))
            model = random.choice(VEHICLE_MAKES[make])
            status = random.choices(status_choices, weights=status_weights)[0]
            customer = random.choice(customers)
            mechanic = None if status == "Pending" else random.choice(mechanics)
            created = fake.date_time_between(start_date="-30d", end_date="now")

            b = Booking(
                customer_id=customer.id,
                mechanic_id=mechanic.id if mechanic else None,
                vehicle_make=make,
                vehicle_model=model,
                service_category=random.choice(SERVICE_CATEGORIES),
                status=status,
                amount=round(random.uniform(400, 8500), 2),
                scheduled_at=created + timedelta(hours=random.randint(1, 48)),
                created_at=created,
                updated_at=created,
            )
            bookings.append(b)
        db.session.add_all(bookings)
        db.session.commit()

        print(f"Done. {len(mechanics)} mechanics, {len(customers)} customers, {len(bookings)} bookings.")


if __name__ == "__main__":
    seed()
