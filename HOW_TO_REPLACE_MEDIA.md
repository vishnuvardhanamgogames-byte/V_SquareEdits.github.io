# HOW TO REPLACE THE PLACEHOLDER MEDIA (no coding needed)

Everything visual on this site is a placeholder you can swap with your own files.
To customize the content, you only need to edit **files in the assets folders** and **one data block** in `js/main.js`.

## Folder map

```
WEB/
├── public/
│   ├── videos/                  ← PUT YOUR VIDEOS HERE (MP4, compressed)
│   │   └── showreel.mp4         ← your main showreel
│   └── images/
│       ├── profile/
│       │   └── profile.jpg      ← your portrait (vertical, ~900x1200)
│       └── projects/
│           ├── hero_workspace.jpg   ← hero background image
│           ├── project_01.jpg       ← project thumbnails (landscape, 16:9)
│           ├── project_02.jpg
│           ├── project_03.jpg
│           ├── project_04.jpg
│           ├── grade_before.jpg     ← color-grading comparison pair
│           └── grade_after.jpg
└── js/
    └── main.js                  ← EDIT THIS FILE FOR TEXT DATA
```

## Step-by-step

1. **Showreel**: export your reel as MP4 (H.264, under ~50 MB), name it `showreel.mp4`, drop it into `public/videos/`. Then open `js/main.js` and change the video path in the showreel configuration if necessary.

2. **Project thumbnails**: save your poster frames into `public/images/projects/` (keep the same file names to change nothing else, or add new names and update each project's `thumbnail` property inside `js/main.js`).

3. **Project videos**: drop MP4s in `public/videos/`, then set each project's `video` value inside the `projects` array in `js/main.js`.

4. **Your photo**: replace `public/images/profile/profile.jpg`.

5. **Name, email, socials, bio, services, experience**: all live at the top of `js/main.js` or in the markup of `index.html`. Edit the text, save, done — the site updates instantly on reload.

## Tips
- Keep videos compressed (HandBrake: H.264, \"Web\" preset). Big files = slow site.
- Images: JPG/WebP, around 1600px wide is plenty.
- The admin inbox for contact-form enquiries is at `admin.html` (saves to local browser storage by default when not connected to a backend).
