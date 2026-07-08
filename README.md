# Memora Web

Spaced-repetition flashcard app. **React 19 + Vite 8 + React Router 7 + TypeScript + MUI.**

Migrated from Next.js 16 App Router. Backend: [memora-api](../memora-api) (Express, port `3001`).

## Requirements

- Node.js 20+
- Running `memora-api` on `http://localhost:3001`

## Quick start

```bash
cp .env.example .env
# Fill in VITE_FIREBASE_* if you need push notifications

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Generate Firebase SW + Vite dev server (`:3000`, proxies `/api` → API) |
| `npm run build` | Typecheck + production build to `dist/` (includes PWA service worker) |
| `npm run preview` | Serve `dist/` locally with API proxy (prod-like) |
| `npm run lint` | ESLint (TypeScript + React Hooks) |

## Environment variables

Copy `.env.example` → `.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend URL for Vite dev/preview proxy (`/api/*` → this host) |
| `VITE_FIREBASE_*` | Firebase client config + FCM (see `.env.example`) |

Client API calls use same-origin `/api` (axios `baseURL: "/api"`, `withCredentials: true`). Auth refresh token is an httpOnly cookie.

## Production deploy

### Vercel (recommended)

The repo includes `vercel.json` + `middleware.ts` (Edge proxy `/api` → backend).

1. **Import** the `memora-web` repo in [Vercel](https://vercel.com) (or reconnect existing project).
2. **Project Settings → General**
   - Framework Preset: **Vite** (auto from `vercel.json`)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `.` (repo root is `memora-web`)
3. **Project Settings → Environment Variables** (Production + Preview):

   | Variable | Example | Notes |
   |----------|---------|-------|
   | `VITE_API_URL` | `https://your-api.up.railway.app` | `/api` proxy target + direct Socket.IO URL in production |
   | `VITE_FIREBASE_*` | see `.env.example` | Build + `generate-sw.js` |

4. **Redeploy** after changing env vars.

Auth cookies work because the browser calls same-origin `/api`; middleware forwards to the API (like old `next.config.ts` rewrites). **No CORS changes needed** for normal app traffic.

Socket.IO connects **directly** to `VITE_API_URL` in production (not through Vercel). Set `CORS_URL` on memora-api to your Vercel origin (e.g. `https://memora-web-olive.vercel.app`).

If you ever call the API **directly** from the browser (without `/api` proxy), set `CORS_URL` on memora-api to your exact Vercel URL and keep cookies `Secure` + `SameSite=None`.

### Self-hosted (nginx)

1. **Build**

   ```bash
   npm run build
   ```

2. **Serve static files** from `dist/` (nginx example in `deploy/nginx.conf`)

3. **Reverse-proxy `/api`** to memora-api on the same origin (required for auth cookies):

   ```
   https://app.example.com/        → dist/
   https://app.example.com/api/*   → memora-api:3001/*
   ```

4. **PWA + push** — see [deploy/PWA.md](deploy/PWA.md)

## Project structure

```
memora-web/
├── index.html              # App shell + metadata
├── vite.config.ts          # Vite, PWA, /api proxy
├── src/
│   ├── main.tsx            # Entry
│   ├── App.tsx             # BrowserRouter
│   ├── AppProviders.tsx    # Theme, Query, Auth, FCM, …
│   ├── router.tsx          # React Router routes
│   ├── sw.ts               # PWA service worker (Workbox + FCM)
│   ├── components/         # UI pages & widgets
│   ├── context/            # Auth, Theme, Notifications
│   ├── hooks/              # useFCM, useFolderSort
│   ├── lib/                # axios, firebase
│   ├── providers/          # React Query, notistack
│   ├── routes/             # API paths, ROUTES, query keys
│   ├── schemas/            # Zod validation
│   ├── services/           # API clients
│   └── theme/              # MUI theme
├── public/                 # Static assets, manifest, FCM SW template
├── scripts/generate-sw.js  # Builds firebase-messaging-sw.js from .env
└── deploy/                 # nginx.conf, PWA docs
```

## vs Next.js (what changed)

| Next.js | Vite |
|---------|------|
| App Router `src/app/**/page.tsx` | `src/router.tsx` + `*.client.tsx` |
| `next/navigation`, `next/link` | `react-router-dom` |
| `next.config.ts` rewrites | Vite dev proxy + Vercel `middleware.ts` / nginx |
| `@ducanh2912/next-pwa` | `vite-plugin-pwa` (`injectManifest`) |
| `NEXT_PUBLIC_*` | `VITE_*` + `import.meta.env` |
| Server Components / metadata | SPA + `index.html` meta tags |
| `"use client"` everywhere | Not needed |

Business logic (`components`, `services`, `schemas`, `context`, …) is unchanged.
