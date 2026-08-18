# V_SquareEdits — Complete Project Documentation

> **For AI tools, developers, and collaborators.**
> This document describes every aspect of the project as it currently exists.
> Last updated: August 2026

---

## 1. Project Overview

V_SquareEdits is a **fully static, serverless video editor portfolio website** with a built-in CMS admin panel. The owner is **Vishnuvardhan Anga**, a video editor and motion designer.

- **Live site:** https://vishnuvardhanamgogames-byte.github.io/V_SquareEdits.github.io/
- **Admin panel:** https://vishnuvardhanamgogames-byte.github.io/V_SquareEdits.github.io/admin.html
- **GitHub repo:** https://github.com/vishnuvardhanamgogames-byte/V_SquareEdits.github.io
- **Local dev path:** `C:\Users\vishn\Desktop\Web02\`
- **Hosting:** GitHub Pages (branch: `main`)

No build step, no Node.js, no bundler. Pure HTML + CSS + vanilla JavaScript.

---

## 2. File Structure

```
Web02/
├── index.html              # Main portfolio website
├── admin.html              # Admin CMS dashboard
├── data.json               # Single source of truth for all content
├── BACKEND.md              # Optional FastAPI backend documentation
├── PROJECT_DOCS.md         # This file
├── HOW_TO_REPLACE_MEDIA.md # Media replacement guide
├── .gitignore
│
├── css/
│   ├── style.css           # Main site styles
│   └── admin.css           # Admin panel styles
│
├── js/
│   ├── main.js             # Main site logic (data loading + all UI)
│   └── admin.js            # Admin panel logic (CMS + GitHub publish)
│
└── public/
    ├── images/
    │   ├── profile/
    │   │   └── profile.jpg         # Local profile photo (fallback)
    │   └── projects/
    │       └── README.md
    ├── icons/                       # Favicon (empty, needs population)
    └── videos/                      # Local videos (empty, use URLs)
```

---

## 3. How the CMS Works (Data Flow)

```
Admin Panel (admin.html)
        │
        │  User edits fields, drops images (uploaded to Imgur)
        │
        ▼
  saveLocalPreview()
        │
        │  Serializes all form fields into a JSON object
        │
        ▼
  publishToGithub(data, token)
        │
        │  GitHub API PUT → updates data.json in the repo
        │
        ▼
  GitHub Pages rebuilds (~1 minute)
        │
        ▼
  index.html loads
        │
        │  fetch('data.json?v=timestamp')   ← always fresh, cache-busted
        │
        ▼
  initPortfolioData() → applies all data to the DOM
```

**Key principle:** `data.json` is the single source of truth. The site reads it fresh on every load. localStorage is only a fallback if the fetch fails (offline mode).

---

## 4. data.json — Full Schema

All content is controlled through this file. Below is the complete schema with field descriptions.

```json
{
  "nav": {
    "logoText": "string — Name shown in navbar and browser tab title"
  },

  "hero": {
    "eyebrow": "string — Small text above headline (e.g. 'VIDEO EDITOR — MOTION • STORY • IMPACT')",
    "headlineLines": ["array of strings — Each item is one line of the big headline"],
    "subtext": "string — Paragraph below the headline",
    "availability": "string — e.g. 'Available for work' or '2026'",
    "showreelVideo": "string — Direct MP4 URL or YouTube/Vimeo URL for the showreel player",
    "showreelPoster": "string — Thumbnail/poster image URL for the video player",
    "showreelDuration": "string — Displayed duration e.g. '01:00'"
  },

  "marquee": ["array of strings — Words shown in the scrolling ticker between sections"],

  "about": {
    "headingLines": ["array of strings — Lines of the 'BEHIND THE EDIT' heading"],
    "portraitCaption": "string — Caption below the portrait image",
    "portraitImage": "string — URL to portrait photo (Imgur URL or external URL)",
    "bioParagraph1": "string — First bio paragraph",
    "bioParagraph2": "string — Second bio paragraph",
    "location": "string — e.g. 'Hyderabad, India'",
    "experience": "string — e.g. '4+ Years'",
    "specialties": "string — e.g. 'Cinematic Edits / Motion Graphics / Color'"
  },

  "services": [
    {
      "num": "string — Display number e.g. '01'",
      "title": "string — Service name e.g. 'VIDEO EDITING'",
      "items": ["array of strings — Sub-skills listed under the service"]
    }
  ],

  "toolkit": {
    "editing": ["array of strings — e.g. ['Premiere Pro', 'DaVinci Resolve']"],
    "motion":  ["array of strings — e.g. ['After Effects']"],
    "design":  ["array of strings — e.g. ['Photoshop', 'Illustrator']"],
    "threeD":  ["array of strings — e.g. ['Blender']"],
    "audio":   ["array of strings — e.g. ['Audition']"]
  },

  "process": [
    {
      "title": "string — Step name e.g. 'RAW FOOTAGE'",
      "description": "string — What happens in this step"
    }
  ],

  "experienceTimeline": [
    {
      "year": "string — e.g. '2026'",
      "role": "string — e.g. 'VIDEO EDITOR'",
      "place": "string — e.g. 'FREELANCE'",
      "desc": "string — Description of the role"
    }
  ],

  "contact": {
    "email": "string — Contact email address",
    "instagram": "string — Full Instagram URL",
    "youtube": "string — Full YouTube URL",
    "linkedin": "string — Full LinkedIn URL",
    "vimeo": "string — Full Vimeo URL",
    "github": "string — Full GitHub profile URL",
    "x": "string — Full X (Twitter) URL",
    "artstation": "string — Full ArtStation URL"
  },

  "projects": [
    {
      "index": "string — Display number e.g. '01'",
      "title": "string — Project title",
      "category": "string — e.g. 'Editing / Color Grading / Sound Design'",
      "role": "string — e.g. 'Editor / Colorist'",
      "software": "string — Comma-separated tools used",
      "year": "string — e.g. '2026'",
      "video": "string — Direct MP4 URL, or YouTube/Vimeo URL",
      "image": "string — Thumbnail image URL (Imgur or external)",
      "description": "string — Project description paragraph",
      "breakdown": {
        "RAW":    { "image": "string — URL", "desc": "string — Stage description" },
        "EDIT":   { "image": "string — URL", "desc": "string — Stage description" },
        "COLOR":  { "image": "string — URL", "desc": "string — Stage description" },
        "MOTION": { "image": "string — URL", "desc": "string — Stage description" },
        "SOUND":  { "image": "string — URL", "desc": "string — Stage description" },
        "FINAL":  { "image": "string — URL", "desc": "string — Stage description" }
      }
    }
  ]
}
```

---

## 5. Main Site (index.html + main.js)

### Sections (in order)

| Section | ID | Description |
|---|---|---|
| Navigation | `#nav` | Fixed top bar with logo + links + mobile hamburger |
| Hero | `#top` | Full-screen with parallax bg, animated headline, play showreel button |
| Showreel | `#work` | Custom HTML5 video player with controls |
| Marquee | — | Scrolling ticker strip |
| Selected Work | `#selected-work` | List of project rows, click opens modal |
| Project Modal | `#projectModal` | Full-screen overlay with video + 6-stage breakdown tabs |
| About | `#about` | Portrait + bio text + facts grid |
| Services | `#services` | Numbered service rows |
| Toolkit | `#toolkit` | Software grid (Editing, Motion, Design, 3D, Audio) |
| Process | `#process` | Interactive step cards |
| Experience | `#experience` | Timeline entries |
| Contact | `#contact` | Email copy button + social links + contact form |
| Footer | — | Copyright + social links |

### Key JavaScript Functions (main.js)

| Function | Purpose |
|---|---|
| `initPortfolioData()` | Fetches `data.json` (cache-busted), falls back to localStorage, then defaults |
| `applyNavData(nav)` | Updates logo text and browser tab title |
| `applyHeroData(hero)` | Injects headline lines, subtext, video src, poster |
| `applyAboutData(about)` | Sets portrait image, bio paragraphs, caption, facts |
| `applyServicesData(services)` | Renders all service rows dynamically |
| `applyToolkitData(toolkit)` | Renders software grid cards |
| `applyExperienceData(timeline)` | Renders timeline entries |
| `applyContactData(contact)` | Sets email, social links, footer text |
| `renderProjects(projects)` | Renders clickable project row buttons |
| `initHero()` | Parallax scroll + content fade + mask reveal animation trigger |
| `initCursor()` | Spring-physics custom cursor with label |
| `initNav()` | Scroll opacity, smooth scroll, mobile drawer |
| `initReveal()` | IntersectionObserver scroll reveal animations |
| `initProjectModal()` | Opens/closes project modal, tab breakdown, YouTube/Vimeo embed support |
| `initProcess()` | Interactive process step hover/click |
| `initShowreelPlayer()` | Full custom video player (play/pause/seek/mute/fullscreen) |
| `initCopyEmail()` | Clipboard copy for email button |
| `initForm()` | Contact form submit (localStorage fallback + optional API) |

### Video Embed Support
The project modal auto-detects YouTube and Vimeo URLs via `getEmbedUrl()` and renders them in an `<iframe>` with autoplay. Direct MP4 URLs use the native `<video>` element.

---

## 6. Admin Panel (admin.html + admin.js)

### Login
- **URL:** `/admin.html`
- **Email:** `admin@frameflow.studio`
- **Password:** `FrameFlow@2026`
- Credentials are hardcoded in `admin.js` inside the `login()` function.
- Auth token stored in `localStorage` under key `ff_token`.

### Dashboard Tabs

| Tab | Pane ID | Editable Fields |
|---|---|---|
| Profile | `#pane-profile` | Name, Availability, Location, Email, Headline, Bio, Portrait Image, Website Logo, CV, Social Links |
| About | `#pane-about` | About heading lines, Portrait caption, Bio paragraphs, Experience stat, Specialties stat |
| Experience | `#pane-experience` | Timeline entries (Year, Role, Place, Description) — add/delete |
| Skills | `#pane-skills` | Services list (title + items), Software toolkit (5 categories) |
| Certifications | `#pane-certifications` | Certification entries — add/delete (UI present, serialization pending) |
| Projects | `#pane-projects` | Showreel video/poster, all project cards with 6-stage breakdown — add/delete |
| Enquiries | `#pane-enquiries` | Read/unread/delete contact form submissions |

### GitHub Publish Flow

1. User pastes GitHub Personal Access Token (PAT) in the token bar
2. Token saved to `localStorage` under key `ff_gh_token`
3. On any Save button click → `saveLocalPreview()` is called
4. If no token → `showTokenSetup()` highlights the token bar
5. If token exists → `publishToGithub(data, token)` runs:
   - GET `https://api.github.com/repos/vishnuvardhanamgogames-byte/V_SquareEdits.github.io/contents/data.json` → retrieves current `sha`
   - PUT same URL with new Base64-encoded content + `sha` → commits to `main` branch
   - On success: clears `localStorage.portfolio_data` to prevent stale cache
6. GitHub Pages rebuilds in ~1 minute

### Image Upload (Imgur)

All images uploaded via drag-and-drop go through Imgur's anonymous upload API:

- **Imgur Client ID:** `546c25a59c58ad7`
- **API endpoint:** `POST https://api.imgur.com/3/image`
- Returns a permanent public URL like `https://i.imgur.com/xxxxx.jpg`
- This URL is stored in the hidden input and saved to `data.json`
- No base64 stored anywhere — images are always external URLs

### Key Admin JS Functions

| Function | Purpose |
|---|---|
| `loadCMSData()` | Fetches fresh `data.json` (cache-busted), populates all form fields |
| `populateEditorForm()` | Maps `portfolioData` fields to all form inputs |
| `saveLocalPreview()` | Serializes all form fields, calls `publishToGithub()` |
| `publishToGithub(data, token)` | GitHub API PUT to update `data.json` live |
| `renderProjectEditors(projects)` | Dynamically renders all project editor cards |
| `renderExperienceEditors(timeline)` | Renders experience entry cards |
| `renderServicesEditors(services)` | Renders service title+items editors |
| `renderToolkitEditor(toolkit)` | Renders 5 toolkit category inputs |
| `serializeProjects()` | Reads all project editor card inputs into an array |
| `serializeExperience()` | Reads all experience editor card inputs into an array |
| `uploadToImgur(file)` | Uploads image File to Imgur, returns public URL |
| `handleImageFile(file, zone, cb)` | Manages upload state, calls `uploadToImgur`, shows preview |
| `bindDropZone(zone, hiddenInput)` | Wires up all drag-drop/file-picker events on a zone |
| `initImageDropZones(container)` | Initialises all drop zones on page or within a card |
| `switchTab(tabId)` | Shows correct tab pane, updates active button |
| `updateTokenBar()` | Shows green "token saved" or red "not set" state |

---

## 7. CSS Architecture

### style.css (Main Site)

- CSS custom properties defined in `:root`
- **Accent color:** `#FF3B30` (red)
- **Background:** `#080808`
- **Text:** `#F5F5F5`
- **Muted:** `#A0A0A0`
- **Borders:** `#1e1e1e` / `#2a2a2a`
- **Display font:** `Bebas Neue` (headings)
- **Body font:** `Manrope` (all other text)
- Uses `clamp()` for responsive font sizes
- Scroll reveal via `.reveal` / `.visible` classes toggled by IntersectionObserver
- Mask-reveal animation for headline text via `.hero-line-inner` / `.run` classes

### admin.css (Admin Panel)

Shares the same color palette as the main site:
- **Accent:** `#FF3B30` (red — same as main site)
- **Background:** `#080808`
- **Card surface:** `#0f0f0f`
- **Inputs:** `#1a1a1a` background, `8px` border-radius (more rounded than main site)
- **Tab buttons:** pill-shaped (`border-radius: 99px`), active tab filled red
- Key classes: `.dash-tab-btn`, `.dash-content-card`, `.btn-pill-save`, `.btn-pill-danger`, `.img-drop-zone`, `.project-editor-card`, `.enquiry-card`

---

## 8. External Services & Dependencies

| Service | Usage | Notes |
|---|---|---|
| **GitHub API** | Save content changes to `data.json` | Requires PAT with `contents: write` permission |
| **GitHub Pages** | Hosting the live site | Auto-deploys from `main` branch on every commit |
| **Imgur API** | Host uploaded images permanently | Anonymous upload, Client ID: `546c25a59c58ad7` |
| **Google Fonts** | `Bebas Neue` + `Manrope` | Loaded via `<link>` in both HTML files |
| **Lenis** | Smooth scroll library | Loaded from CDN in `index.html` |
| **Unsplash** | Default project thumbnail images | Used in fallback/demo data only |
| **Google Cloud Storage** | Sample showreel + project videos | Demo MP4s only, replace with real content |

### Optional FastAPI Backend
A Python FastAPI backend exists (documented in `BACKEND.md`) for persistent enquiry storage via MongoDB. Currently **not connected** — the site runs fully in static/localStorage mode. To connect: add `<script>window.FF_API_URL = "https://your-backend-url.com";</script>` before the JS scripts in both HTML files.

---

## 9. Admin Credentials

| Field | Value |
|---|---|
| Admin Email | `admin@frameflow.studio` |
| Admin Password | `FrameFlow@2026` |
| Location in code | `admin.js` → `login()` function, lines with `validEmail` / `validPassword` |
| GitHub Repo Owner | `vishnuvardhanamgogames-byte` |
| GitHub Repo Name | `V_SquareEdits.github.io` |

> ⚠️ These credentials are public since the repo is public. Change them before making the admin URL public.

---

## 10. How to Make Changes (Quick Reference)

### Change text content
1. Open admin panel → log in → edit the relevant tab → Save
2. Wait ~1 minute → refresh the live site

### Add a new project
1. Admin → Projects tab → **+ ADD NEW PROJECT**
2. Fill in title, category, role, year, video URL
3. Drag-drop a thumbnail image (auto-uploads to Imgur)
4. Fill in 6-stage breakdown → Save

### Change profile photo / portrait
1. Admin → Profile tab → drag image onto "Profile Image" zone
2. Zone shows "Uploading…" then preview appears
3. Click Save → published to GitHub

### Add a new social link
1. Admin → Profile tab → scroll to Social Links section
2. Paste the full URL → Save

### Change showreel video
1. Admin → Projects tab → "Main Showreel Video Settings"
2. Paste direct MP4 URL or YouTube/Vimeo URL → Save

### Edit raw data.json directly
The file is at `C:\Users\vishn\Desktop\Web02\data.json` locally and at the GitHub repo root. Any valid JSON edit pushed to `main` will be reflected on the live site.

---

## 11. Known Limitations & Notes for AI Tools

- **No build step** — all JS is vanilla ES6+, no modules, no TypeScript
- **No test suite** — `data-testid` attributes exist on elements for future testing
- **Image uploads** go to Imgur anonymously — images are public and have no expiry but Imgur may rate-limit heavy usage
- **GitHub PAT** is stored in browser `localStorage` under `ff_gh_token` — it persists across sessions on the same device/browser
- **Certifications tab** has UI (add/delete buttons, `#certificationsEditorList`) but the `serializeProjects()` equivalent for certifications is not yet implemented in `saveLocalPreview()` — data is not serialized on save
- **`data.json` must be valid JSON** — a syntax error will break the entire site (it falls back to hardcoded defaults)
- **The `process` section** in `data.json` is not editable from the admin panel — only editable by directly modifying `data.json`
- **`headlineLines` in hero** is not editable from the admin panel — it preserves whatever is in `data.json`
- The admin panel reads `data.json` fresh on every login — no stale data issues
- After a successful GitHub publish, `localStorage.portfolio_data` is cleared intentionally
- `main.js` always fetches `data.json?v={timestamp}` to bypass CDN/browser cache

---

## 12. localStorage Keys Reference

| Key | Used By | Contents |
|---|---|---|
| `ff_token` | admin.js | Admin session token (value: `'local-token'` in offline mode) |
| `ff_gh_token` | admin.js | GitHub Personal Access Token for publishing |
| `ff_enquiries` | admin.js, main.js | Array of contact form submissions (JSON) |
| `portfolio_data` | main.js | Cached portfolio data (cleared after GitHub publish) |
