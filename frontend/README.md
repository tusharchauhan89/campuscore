# CMS Portal – Frontend

Modern React + TypeScript frontend for the College Management System backend.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **React Router v7**
- **Axios**
- **Lucide React** (icons)

## Features

### Student
- Login / Signup
- Dashboard (attendance %, results, fees, library fine, notices)
- Attendance history + summary
- Marks / Results
- Fees status
- Library (issued books, history, request book)
- Notices
- Profile & password update

### Faculty
- Login
- Dashboard
- View students
- Mark attendance
- Add marks

### Admin
- Login (demo: `admin@cms.com` / `admin123`)
- Dashboard overview
- Manage students (list + delete)
- Manage faculty (list + delete)
- Approve/Reject book requests
- Create notices
- View all fees

## Setup

```bash
cd cms-frontend
npm install
```

Create a `.env` file (optional):

```
VITE_API_URL=http://localhost:8000
```

Start the backend first (from the `hub` folder):

```bash
# Make sure PostgreSQL is running and DATABASE_URL is correct
uvicorn main:app --reload --port 8000
```

Then start the frontend:

```bash
npm run dev
```

Open http://localhost:5173

## Important Backend Note

CORS has been added to your FastAPI backend so the frontend can call it from `localhost:5173`.

## Project Structure

```
src/
  api/client.ts       → All API calls
  context/AuthContext → Auth state + localStorage
  layouts/            → Sidebar layout
  pages/
    student/          → Student screens
    faculty/          → Faculty screens
    admin/            → Admin screens
  types/              → TypeScript interfaces
```

## Default Admin Credentials

- Email: `admin@cms.com`
- Password: `admin123`

(There is no real admin auth in the backend yet – this is a simple frontend check.)
