# ReDraft - Professional Version-Controlled CMS

ReDraft is a minimalist, professional CMS designed for authors who value version control, focus, and permanence. Built with Node.js, Express, PostgreSQL, and React.

## 🚀 Live Demo
- **Frontend**: [https://redraft-frontend.vercel.app](https://redraft-frontend.vercel.app)
- **Backend API**: [https://redraft-backend.onrender.com](https://redraft-backend.onrender.com)

## 🔑 Seeded Credentials
Use these accounts to explore the author dashboard:
1. **Email**: `ae@demo.com`lic | **Password**: `password123`
2. **Email**: `bob@demo.com` | **Password**: `password123`

## ✨ Core Features
- **Foundation**: JWT Authentication, Author Dashboard, Rich Text Editing (Tiptap).
- **Versioning**: Every save creates an immutable snapshot. Never lose a draft again.
- **Visual Diff**: Compare any two versions of a post with word-level precision.
- **FTS Search**: Blazing fast PostgreSQL full-text search with relevance ranking and term highlighting.
- **Restore (Bonus)**: Roll back to any previous version instantly (creates a new version snapshot).

## 🛠️ Local Setup

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

## 🏗️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, Zustand.
- **Backend**: Node.js, Express, Sequelize ORM, JWT, PostgreSQL.
- **Editor**: Tiptap (ProseMirror).

## 📄 Documentation
- [DECISIONS.md](./DECISIONS.md): Architectural choices and rationale.
- [assignment.md](./assignment.md): Project requirements.
