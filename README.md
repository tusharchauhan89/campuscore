# CMS Portal – Full Stack (Frontend + Backend)

College Management System in **one folder**.

```
cms-portal/
├── backend/     → FastAPI + Sqlite
├── frontend/    → React + TypeScript + Tailwind
└── README.md
```

## 1. Start Backend

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary "pydantic[email]" passlib python-multipart
# Edit database.py if your PostgreSQL password/URL is different
uvicorn main:app --reload --port 8000
```

API docs → http://localhost:8000/docs

## 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open → http://localhost:5173

## Login

| Role    | How to login                     |
|---------|----------------------------------|
| Student | Sign up first, then login        |
| Faculty | Use existing faculty credentials |
| Admin   | admin@cms.com / admin123         |

CORS is already enabled for localhost:5173.
