# ReDraft - Professional Version-Controlled CMS

ReDraft is a minimalist, professional CMS designed for authors who value version control, focus, and permanence. Built with Node.js, Express, PostgreSQL, and React.

## 🚀 Live Demo
- **Frontend**: [https://redraft-frontend.vercel.app](https://redraft-frontend.vercel.app)
- **Backend API**: [https://redraft-a20q.onrender.com](https://redraft-a20q.onrender.com)
- **Health Check**: [https://redraft-a20q.onrender.com/health](https://redraft-a20q.onrender.com/health)

> **Note**: The backend is hosted on Render's free tier. If the service is inactive, the first request may take 20-50 seconds to spin up.

## 🔑 Seeded Credentials
Use these accounts to explore the author dashboard:
1. **Email**: `alice@demo.com` | **Password**: `password123`
2. **Email**: `bob@demo.com` | **Password**: `password123`

## ✨ Core Features
- **Foundation**: JWT Authentication, Author Dashboard, Rich Text Editing (Tiptap).
- **Versioning**: Every save creates an immutable snapshot. Never lose a draft again.
- **Visual Diff**: Compare any two versions of a post with word-level precision.
- **FTS Search**: Blazing fast PostgreSQL full-text search with relevance ranking and term highlighting.
- **Restore (Bonus)**: Roll back to any previous version instantly (creates a new version snapshot).

## ⚡ Quick Start with Docker
The easiest way to run the entire stack (Postgres + Backend + Frontend) is via Docker Compose.
```bash
docker-compose up --build
```
*Access the frontend at `http://localhost:5173` and the backend at `http://localhost:3000`.*

## 🛠️ Local Setup (Manual)

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Create a PostgreSQL database named `redraft`.

### 2. Backend Configuration
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your DATABASE_URL and JWT_SECRET
npm run db:migrate
npm run db:seed
npm run dev
```

### 3. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```

## 📋 Environment Configuration

### Backend (.env)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/redraft` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_key` |
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend (.env)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |

## 📂 Project Structure
```text
/backend
├── src/controllers  # HTTP route handlers
├── src/services     # Business logic (Diff, Search, Post)
├── src/middleware   # JWT Auth & Error handling
├── src/models       # Sequelize models & associations
└── src/migrations   # Database schema versioning
/frontend
├── src/api          # Typed Axios client & services
├── src/components   # Shared UI components
├── src/pages        # Route-level view components
├── src/store        # State management (Zustand)
└── src/types        # Shared TypeScript interfaces
```

## 🏗️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, Zustand.
- **Backend**: Node.js, Express, Sequelize ORM, JWT, PostgreSQL.
- **Editor**: Tiptap (ProseMirror).

## 📄 Documentation
- [DECISIONS.md](./DECISIONS.md): Architectural choices and rationale.
- [assignment.md](./assignment.md): Project requirements.
