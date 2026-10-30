# Interview Trail

Full project: Interview Experience Sharing Platform.

    interview-trail/
      frontend/   React + Vite + Recoil + Tailwind — flat, simple structure
      backend/    Node.js + Express + MongoDB (JWT auth, RBAC) — unchanged

Each half has its own README with folder structure and notes. This file is
just how to get both running together in VS Code.

## Open it in VS Code

1. Unzip this folder anywhere.
2. `code interview-trail` (or File > Open Folder), then open **two**
   integrated terminals (Terminal > Split Terminal) — one per side below.

## 1. Backend (terminal 1)

    cd backend
    npm install
    cp .env.example .env

Edit `backend/.env`:
- `MONGODB_URI` — local `mongod` or a MongoDB Atlas connection string
- `JWT_SECRET` — any long random string

Then:

    npm run dev

Prints `API listening on http://localhost:5001` when it's up.

## 2. Frontend (terminal 2)

    cd frontend
    npm install
    cp .env.example .env
    npm run dev

Opens on `http://localhost:5173`, already pointed at
`http://localhost:5001/api`.

## What to read first

- `frontend/README.md` — the new, flat folder structure and how to extend it
- `backend/README.md` — API endpoint list + how auth/RBAC/voting work
