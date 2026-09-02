# Instant Mechanic — Live Operations Dashboard

A live vehicle service operations dashboard built for Instant Mechanic's Full Stack Developer
Intern assignment. It tracks bookings, mechanics, customers and revenue in real time for an
operations team.

## Project Overview

The dashboard gives an operations team four views: a live Overview of key numbers, Analytics
charts for trends, a searchable/filterable Bookings table, and a Mechanics roster with live
status. Data refreshes automatically every 15 seconds via polling, so status changes (e.g.
Pending → Assigned → Completed) show up without a manual page reload.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Recharts, Axios
- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database:** MySQL (via PyMySQL)
- **Seed data:** Faker (500+ bookings, 80 customers, 25 mechanics)

## Architecture

```
React (Vite)  →  Axios (REST, polling every 15s)  →  Flask API  →  SQLAlchemy  →  MySQL
   Frontend                                            Backend       ORM         Database
```

- The frontend never talks to the database directly — everything goes through the Flask REST
  API, which is the single source of truth.
- The "live" behaviour is implemented as **automatic polling** (the Basic tier described in the
  assignment): each page re-fetches its data on a 15-second interval using a shared
  `usePolling` hook, so changing booking status in the database is reflected without a reload.

## Local Setup

### 1. Database

Create a MySQL database:

```sql
CREATE DATABASE instant_mechanic;
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # then edit DB_USER / DB_PASSWORD to match your MySQL setup
python seed.py                 # creates tables and inserts sample data
python app.py                  # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env           # VITE_API_URL=http://localhost:5000
npm run dev                    # runs on http://localhost:5173
```

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default 3306) |
| `DB_NAME` | Database name |
| `FRONTEND_ORIGIN` | Allowed CORS origin for the frontend |

**Frontend (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed Flask API |

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Summary stats + bookings-over-time, status and category breakdowns |
| GET | `/api/bookings` | Paginated bookings list. Query params: `page`, `page_size`, `search`, `status`, `sort_by`, `sort_dir` |
| GET | `/api/bookings/:id` | Single booking detail |
| PATCH | `/api/bookings/:id/status` | Update a booking's status (JSON body: `{"status": "Completed"}`) |
| GET | `/api/mechanics` | All mechanics with current status and last booking |
| GET | `/api/mechanics/:id` | Single mechanic detail |
| GET | `/api/customers` | Paginated customers list |
| GET | `/api/health` | Health check |

## Deployment

- **Frontend:** Deploy `frontend/` to Vercel. Set the `VITE_API_URL` environment variable to
  the deployed backend URL. Build command: `npm run build`, output directory: `dist`.
- **Backend:** Deploy `backend/` to an AWS EC2 instance (or similar). Run behind `gunicorn`
  (e.g. `gunicorn -w 4 -b 0.0.0.0:5000 app:app`) and a reverse proxy such as Nginx. Point the
  MySQL connection at a managed instance (e.g. AWS RDS) or a MySQL server on the same box.
  Update `FRONTEND_ORIGIN` to the deployed Vercel URL.

## AI Usage

- **Tool used:** Claude (Anthropic)
- **What it was used for:** scaffolding the Flask backend (models, routes, seed script),
  scaffolding the React frontend (components, pages, charts, polling logic), and this README.
- **What I reviewed/modified:** _fill this in with what you actually changed — e.g. adjusted
  field names, tuned the seed data ranges, changed the color palette, added/removed an
  endpoint. Be specific — you may be asked to explain any part of this in the next round._
