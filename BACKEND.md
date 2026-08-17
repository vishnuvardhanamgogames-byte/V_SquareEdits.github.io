# Connecting the FastAPI Backend

The site works fully as a static HTML file with no backend (enquiries saved to `localStorage`).
To enable real form submissions and a persistent admin inbox, connect the FastAPI backend.

## Backend API — Endpoint Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET    | `/api/` | — | Health check |
| POST   | `/api/enquiries` | — | Submit contact form enquiry |
| POST   | `/api/auth/login` | — | Admin login → returns JWT + sets cookie |
| POST   | `/api/auth/logout` | — | Clear session cookie |
| GET    | `/api/auth/me` | ✓ | Get current admin user |
| GET    | `/api/admin/enquiries` | ✓ | List all enquiries (newest first) |
| PATCH  | `/api/admin/enquiries/:id` | ✓ | Toggle read/unread |
| DELETE | `/api/admin/enquiries/:id` | ✓ | Delete enquiry |

Auth: `Authorization: Bearer <token>` header OR `access_token` httpOnly cookie.

## Required Environment Variables (backend `.env`)

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
JWT_SECRET=f4a9d2c8e1b7436590ab3d7f2e6c410985bd67a3f9e24c1b8d05a637f4e29c81
ADMIN_EMAIL=admin@frameflow.studio
ADMIN_PASSWORD=FrameFlow@2026
FRONTEND_URL=https://frame-flow-288.preview.emergentagent.com
```

The admin account is **auto-seeded** on startup from `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
If the password in `.env` changes, it's updated automatically on next restart.

## Rate Limiting (built into server.py)

Login is rate-limited to **5 attempts per IP+email** before a **15-minute lockout**.
The admin UI displays the exact error: `"Too many attempts. Try again in 15 minutes."`

## Connecting to the Vanilla Site

Add one `<script>` tag **before** `js/main.js` and `js/admin.js` in both HTML files:

```html
<script>window.FF_API_URL = "https://your-backend-url.com";</script>
```

### What changes when connected:
- **Contact form** → POSTs to `/api/enquiries` (still mirrors to localStorage as backup)
- **Admin login** → authenticates against MongoDB via `/api/auth/login`
- **Admin dashboard** → loads real enquiries from `/api/admin/enquiries`
- **Read/delete** → persist to MongoDB

### Without a backend (default):
- Contact form saves to browser `localStorage`
- Admin panel reads from `localStorage` (demo data seeded on first visit)
- No login required (any credentials accepted in local mode)

## Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

Then set:
```html
<script>window.FF_API_URL = "http://localhost:8001";</script>
```

## Live Preview

The site is deployed at:
`https://frame-flow-288.preview.emergentagent.com`

Admin panel: `https://frame-flow-288.preview.emergentagent.com/admin`  
Default credentials: `admin@frameflow.studio` / `FrameFlow@2026`
