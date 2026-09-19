# SportDB Frontend

A frontend app for browsing sports data (leagues, teams, previous matches and standings) from TheSportsDB, with user login and a per-user list of favorite teams. The app talks only to the **Sport API (Laravel)** and never calls TheSportsDB directly.

**Tech stack:** React 19, TypeScript, Vite, Redux Toolkit, React Router, Tailwind CSS 4, shadcn/ui.

---

## Branches in this repository

This repository has **2 branches**:

| Branch | Description |
|---|---|
| `master` | Main branch. Authentication uses an **API token** (Bearer token). |
| `refactor_v2` | Refactored version. Uses **fetch** to handle authentication via **cookies**. |

Choose a branch before running the app:

```bash
# main branch (API token based)
git checkout master

# refactor branch (fetch 'include' + cookies)
git checkout refactor_v2
```

After switching branches, run `npm install` again because the dependencies may differ.

---

## Prerequisites

- **Node.js** 20.19 or newer (or 22.12+), as required by Vite.
- **npm** (installed with Node.js).
- **Git**.
- The **Sport API (Laravel) backend** running at `http://localhost:8000` (see below).

Check your installed versions:

```bash
node -v
npm -v
```

---

## Installation

1. Clone the repository and enter the folder:

   ```bash
   git clone <repository-url>
   cd frontend-sportdb
   ```

2. Choose a branch (`master` or `refactor_v2`):

   ```bash
   git checkout master
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create your environment file from the provided example:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```

5. Set `.env` to your backend address:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

   Whenever `.env` changes, **restart** Vite so the new value is picked up.

---

## Running the app

### 1. Start the backend first

In the Laravel project (Sport API) folder:

```bash
php artisan serve
```

The backend runs at `http://localhost:8000`. If the browser blocks requests because of CORS, make sure the frontend origin `http://localhost:5174` is allowed by the backend (and matches `FRONTEND_URL` in the backend `.env`, if the backend uses it).

### 2. Start the frontend (development mode)

```bash
npm run dev
```

Open `http://localhost:5174` in your browser. Use `localhost`, not `127.0.0.1`, so the origin matches the one the backend allows.

---

## Other commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Type-check with TypeScript, then create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally for checking. |
| `npm run lint` | Run ESLint. |

> Redux DevTools only works in development mode (`npm run dev`), not in a `build` or `preview` output.

---

## App pages

**Public (no login)**

| Route | Content |
|---|---|
| `/` | Pick a sport and view its list of leagues (name and logo). |
| `/leagues/:leagueId` | Teams in the league and its standings. |
| `/teams/:teamId` | Team details, previous matches (times in WIB) and standings. |
| `/login`, `/register` | Log in and sign up. |

**Private (login required)**

| Route | Content |
|---|---|
| `/profile` | Short user profile. |
| `/favorites` | Favorite teams; add and remove them, stored in the backend database. |

Opening a private page while logged out redirects to `/login`. After signing up, the user is sent to the login form first.

---

## Folder structure

```
src/
  components/   UI components (common, layout, league, team, ui)
  config/       environment configuration
  layouts/      page layouts
  lib/          helpers (WIB time formatting, etc.)
  pages/        one page per route
  routes/       router and ProtectedRoute
  services/     HTTP client and API calls
  store/        Redux store, slices, hooks, selectors
  types/        TypeScript types for API responses
```

---

## Notes

- Match times from the API (`match_time_wib`) are already in WIB and are shown as-is with a "WIB" label, with no browser timezone conversion.
- Logos (`strBadge`) are often `null` on the TheSportsDB free tier, so the app shows a placeholder image.
- TheSportsDB free tier limit: 30 requests per minute. Loaded data is kept in Redux so it is not fetched again.
- Standings exist only for featured soccer leagues, and previous matches show home games only.
