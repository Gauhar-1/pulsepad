## Pulsepad

The project now runs as a small monorepo:

- `server/` – Express + MongoDB backend (TypeScript).
- `frontend/` – Next.js 15 UI (App Router, Turbopack).

### Prerequisites

- Node.js 18+
- The provided MongoDB connection string:

### Install

```bash
# from repo root
npm install          # installs server deps + workspace tooling
cd frontend && npm install   # install Next.js deps
```

### Running Locally

```bash
# Terminal 1
npm run server:dev

# Terminal 2
npm run frontend:dev
```

The API lives at `http://localhost:4000/api`, and the Next.js app defaults to `http://localhost:3000`.

### Production Builds

```bash
# Backend
npm run server:build
npm run server:start

# Frontend
npm run frontend:build
npm run frontend:start
```
