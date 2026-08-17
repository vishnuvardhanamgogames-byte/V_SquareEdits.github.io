# HOW TO REPLACE THE PLACEHOLDER MEDIA (no coding needed)

Everything visual on this site is a placeholder you can swap with your own files.
You only ever edit **files in the `public/` folder** and **one text file**: `js/main.js`
(for contact form config) or directly in `index.html` for text content.

## Folder map

```
public/
├── videos/
│   └── showreel.mp4         ← your main showreel (drop it here)
├── images/
│   ├── profile/
│   │   └── profile.jpg      ← your portrait (vertical, ~900×1200 px)
│   └── projects/
│       ├── project_01.jpg   ← project thumbnails (landscape, 16:9)
│       ├── project_02.jpg
│       ├── project_03.jpg
│       └── project_04.jpg
└── icons/                   ← favicon, apple-touch-icon, etc.
```

## Step-by-step

### 1 — Showreel video
Export your reel as MP4 (H.264, under ~50 MB), name it `showreel.mp4`,
drop it into `public/videos/`.

Then open `index.html`, find the comment `<!-- VIDEO: drop your showreel here -->`,
and replace the placeholder block with:

```html
<video
  src="public/videos/showreel.mp4"
  class="showreel-video"
  autoplay muted loop playsinline
  poster="public/images/projects/project_01.jpg"
></video>
```

### 2 — Project thumbnails
Save your poster frames as JPG/WebP into `public/images/projects/`
keeping the same file names (`project_01.jpg` … `project_04.jpg`).

In `index.html` find each `.project-image` div and add your image as a background:

```html
<div class="project-image" style="background-image:url('public/images/projects/project_01.jpg'); background-size:cover; background-position:center;">
```

Or simply replace the CSS gradient classes (`gradient-01` … `gradient-04`) with
`<img>` tags inside each `.project-image` div.

### 3 — Your portrait
Replace `public/images/profile/profile.jpg` with your own photo.

In `index.html` find `.portrait-shape` and add:

```html
<div class="portrait-shape">
  <img src="public/images/profile/profile.jpg" alt="Alex Mercer" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

### 4 — Name, bio, email, socials
All text lives directly in `index.html`. Search for these placeholders and replace:

| Placeholder | Replace with |
|---|---|
| `ALEX MERCER` | Your name |
| `hello@yourname.com` | Your email address |
| `Your City, Country` | Your location |
| `yourhandle` (×4 social links) | Your actual handles |
| Bio paragraph | Your own bio text |

### 5 — Project titles & tags
Find the four `<article class="project-card">` blocks in `index.html` and
update the `.project-title`, `.tag` spans, and `.project-year` for each project.

### 6 — Experience entries
Find the `.timeline-item` blocks and update year, role, company, and description.

## Tips
- **Keep videos compressed**: HandBrake → H.264 → "Web Optimised" preset. Target under 50 MB.
- **Images**: JPG or WebP, ~1600 px wide is plenty. Use [Squoosh](https://squoosh.app) to compress.
- **Favicon**: drop a `favicon.ico` or `favicon.svg` into `public/icons/` and add to `<head>`:
  `<link rel="icon" href="public/icons/favicon.svg" />`
- The site works by opening `index.html` directly in a browser — no build step needed.
