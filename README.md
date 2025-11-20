## Pulsepad

The project now runs as a small monorepo:

- `server/` – Express + MongoDB backend (TypeScript).
- `frontend/` – Next.js 15 UI (App Router, Turbopack).

### Prerequisites

- Node.js 18+
- The provided MongoDB connection string:

```
mongodb+srv://eeshalteluri:7io0Q60Xqpasdazi@cluster0.epz3zuf.mongodb.net/?appName=Cluster0
```

### Install

```bash
# from repo root
npm install          # installs server deps + workspace tooling
cd frontend && npm install   # install Next.js deps
```

### Environment Variables

**Server (`.env` at repo root):**

```
MONGODB_URI=mongodb+srv://eeshalteluri:7io0Q60Xqpasdazi@cluster0.epz3zuf.mongodb.net/?appName=Cluster0
API_PORT=4000
API_PREFIX=/api
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=3035488656-55q0ares37learcfunh21njncbvcvma0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=<choose-a-strong-secret>
```

**Frontend (`frontend/.env.local`):**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=3035488656-55q0ares37learcfunh21njncbvcvma0.apps.googleusercontent.com
```

Adjust `CORS_ORIGIN`/`NEXT_PUBLIC_API_BASE_URL` if you serve the UI from a different host.

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

### Notes

- `frontend/src/lib/api.ts` reads `NEXT_PUBLIC_API_BASE_URL`, so changing that env is all that’s needed for different environments.
- The backend seeds MongoDB automatically on startup if a collection is empty, so the shipped sample data is persisted in the database instead of hard-coded JSON.
- Authentication uses Google Identity Services + JWT.
  - Users select a role (Admin / Employee / Client) on the login page and authenticate with Google.
  - The backend validates the Google credential, issues a JWT, and the frontend stores it in a cookie/local storage for subsequent API calls.
  - All API routes are protected by auth/role middleware, and the Next.js middleware guards route access on the client as well.
