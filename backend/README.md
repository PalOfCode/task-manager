# Task Manager Backend

Node.js + Express + SQLite backend for the Task Manager project.

## Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.

```bash
npm start
```

API: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## Endpoints

Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

Tasks: `GET/POST /api/tasks`, `PUT/DELETE /api/tasks/:id`, `DELETE /api/tasks`

Profile: `GET/PUT /api/profile`, `PUT /api/profile/password`

Settings: `GET/PUT /api/settings`

Protected routes require `Authorization: Bearer <token>`.

## Important

Your existing frontend currently uses LocalStorage. The next step is to replace those LocalStorage operations with `fetch()` calls to this API. Passwords are hashed in the backend with bcrypt and authenticated with JWT.
