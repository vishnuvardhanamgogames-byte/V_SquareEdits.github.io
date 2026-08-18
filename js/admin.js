/**
 * FrameFlow — Admin Panel & CMS Editor
 * admin.js
 */

'use strict';

/* ── Config ──────────────────────────────────────────────────── */
const API_BASE = (window.FF_API_URL || '').replace(/\/$/, '');
const USE_LOCAL = !API_BASE; // fallback to localStorage when no API configured

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function toast(message, type = 'success') {
  const container = $('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

/* ── State ───────────────────────────────────────────────────── */
let token     = localStorage.getItem('ff_token') || '';
let enquiries = null; 
let portfolioData = null; // Hold dynamic site configuration

// Fallback defaults for Admin CMS
const DEFAULT_PORTFOLIO_DATA = {
  "nav": {
    "logoText": "ALEX MERCER",
    "logoImage": ""
  },
  "hero": {
    "eyebrow": "VIDEO EDITOR — MOTION • STORY • IMPACT",
    "headlineLines": ["CUTTING", "STORIES INTO", "MOTION."],
    "subtext": "Video Editor & Motion Designer specializing in cinematic edits, social content, motion graphics and visual storytelling.",
    "showreelVideo": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "showreelPoster": "public/images/projects/hero_workspace.jpg",
    "showreelDuration": "01:00"
  },
  "marquee": ["EDIT", "DESIGN", "STORYTELL", "COLOR", "SOUND", "MOTION"],
  "about": {
    "name": "ALEX MERCER",
    "availability": "Available for work",
    "cv": "",
    "headingLines": ["BEHIND", "THE EDIT"],
    "portraitCaption": "ALEX MERCER — VIDEO EDITOR & MOTION DESIGNER",
    "portraitImage": "public/images/profile/profile.jpg",
    "bioParagraph1": "I'm a video editor focused on transforming raw footage into engaging visual stories. The timeline is where I think — pacing, rhythm and emotion are decided frame by frame.",
    "bioParagraph2": "My work combines editing, motion graphics, visual effects, sound design and color to create videos that are visually strong and emotionally engaging. If it doesn't serve the story, it doesn't make the cut.",
    "location": "Your City, Country",
    "experience": "4+ Years",
    "specialties": "Cinematic Edits / Motion Graphics / Color"
  },
  "services": [
    {
      "num": "01",
      "title": "VIDEO EDITING",
      "items": ["Cinematic Editing", "YouTube Editing", "Short-form Content", "Commercial Editing", "Trailer Editing"]
    },
    {
      "num": "02",
      "title": "MOTION GRAPHICS",
      "items": ["Animated Typography", "Logo Animation", "UI Animation", "Transitions", "Infographics"]
    },
    {
      "num": "03",
      "title": "VISUAL EFFECTS",
      "items": ["Compositing", "Green Screen", "Tracking", "Rotoscoping", "Screen Replacement"]
    },
    {
      "num": "04",
      "title": "COLOR",
      "items": ["Color Correction", "Color Grading", "Look Development"]
    },
    {
      "num": "05",
      "title": "SOUND",
      "items": ["Sound Design", "SFX", "Music Editing", "Audio Mixing"]
    }
  ],
  "toolkit": {
    "editing": ["Premiere Pro", "DaVinci Resolve"],
    "motion": ["After Effects"],
    "design": ["Photoshop", "Illustrator"],
    "threeD": ["Blender"],
    "audio": ["Audition"]
  },
  "process": [
    { "title": "RAW FOOTAGE", "description": "Ingesting and logging every clip. Nothing gets lost, everything gets marked." },
    { "title": "SELECTS",     "description": "Pulling the strongest moments — the takes with genuine energy." },
    { "title": "ROUGH CUT",   "description": "Establishing structure, pacing and narrative flow." },
    { "title": "FINE CUT",    "description": "Trimming to the frame. Rhythm becomes intention." },
    { "title": "MOTION",      "description": "Adding typography, transitions and visual effects." },
    { "title": "COLOR",       "description": "Creating consistency and developing the final visual mood." },
    { "title": "SOUND",       "description": "Sound design, SFX and music mixed for impact." },
    { "title": "FINAL",       "description": "Mastered, exported and delivered for every platform." }
  ],
  "experienceTimeline": [
    {
      "year": "2026",
      "role": "VIDEO EDITOR",
      "place": "FREELANCE",
      "desc": "Leading end-to-end edits for brand and creator clients — from raw footage to final delivery."
    },
    {
      "year": "2025",
      "role": "MOTION DESIGN",
      "place": "STUDIO PROJECTS",
      "desc": "Animated typography, title sequences and motion systems for campaigns."
    },
    {
      "year": "2024",
      "role": "VIDEO EDITING",
      "place": "FREELANCE",
      "desc": "Short-form content, music edits and personal cinematic projects."
    }
  ],
  "contact": {
    "email": "hello@yourname.com",
    "instagram": "https://instagram.com/yourhandle",
    "youtube": "https://youtube.com/@yourhandle",
    "linkedin": "https://linkedin.com/in/yourhandle",
    "vimeo": "https://vimeo.com/yourhandle",
    "github": "https://github.com/vishnuvardhanamgogames-byte",
    "x": "https://x.com/yourhandle",
    "artstation": "https://artstation.com/yourhandle"
  },
  "projects": [
    {
      "index": "01",
      "title": "Cinematic Trailer Edit",
      "category": "Editing / Color Grading / Sound Design",
      "role": "Editor / Colorist",
      "software": "Premiere Pro, DaVinci Resolve, Audition",
      "year": "2026",
      "description": "A high-energy trailer cut built around rhythm and restraint — every beat mapped to the music, every transition earned. Graded for a cold, filmic finish with deep blacks and controlled highlights.",
      "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "image": "https://images.unsplash.com/photo-1771038396898-50c5bbbbfa67?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxzcG9ydHMlMjBjYXIlMjBjb21tZXJjaWFsJTIwY2luZW1hdGljfGVufDB8fHx8MTc4NjYxMzY5Mnww&ixlib=rb-4.1.0&q=85",
      "breakdown": {
        "RAW": {
          "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
          "desc": "Flat S-Log3 footage straight from the camera, preserving all shadow and highlight details for grading."
        },
        "EDIT": {
          "image": "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80",
          "desc": "Pacing edit matching high-impact cuts and narrative transitions to the trailer's sound design."
        },
        "COLOR": {
          "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
          "desc": "A cold cinematic color grade with styled steel-blue midtones and clean, rolled highlights."
        },
        "MOTION": {
          "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
          "desc": "Kinetic tracked titles and kinetic text overlays positioned in 3D space."
        },
        "SOUND": {
          "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          "desc": "Sub-bass impacts, risers, and detailed ambient sound design built from raw foley libraries."
        },
        "FINAL": {
          "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
          "desc": "The fully mastered 4K export, completed with theater-ready audio mixing and grading."
        }
      }
    }
  ],
  "certifications": [
    {
      "title": "Adobe Certified Professional - After Effects",
      "issuer": "Adobe",
      "year": "2025",
      "link": "https://adobe.com"
    },
    {
      "title": "DaVinci Resolve Certified Editor",
      "issuer": "Blackmagic Design",
      "year": "2024",
      "link": "https://blackmagicdesign.com"
    }
  ]
};

/* ── SVG icons ──────────────────────────────────────────────── */
const ICON = {
  mailOpen: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9 6 9-6"/>
    <path d="M21 9V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9"/>
    <polyline points="3 9 12 3 21 9"/>
  </svg>`,
  mail: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>`,
};

/* ============================================================
   LOCAL STORAGE ENQUIRIES FALLBACK
   ============================================================ */
const LOCAL = {
  key: 'ff_enquiries',
  load() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  seed() {
    const existing = this.load();
    if (existing.length) return;
    const demo = [
      {
        id: 'demo-1',
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        project_type: 'Cinematic Edit',
        message: 'Hi! I have a short film trailer that needs editing and color grading. Timeline is 3 weeks. Would love to chat.',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    this.save(demo);
  },
};

/* ============================================================
   API HELPERS
   ============================================================ */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

/* ============================================================
   VIEWS CONTROL
   ============================================================ */
function showLogin() {
  $('loginPage').style.display = 'flex';
  $('dashboard').style.display = 'none';
}

function showDashboard() {
  $('loginPage').style.display = 'none';
  $('dashboard').style.display = 'block';
  
  // Default to profile tab on login
  switchTab('profile');
}

function switchTab(tabId) {
  // Update tab buttons
  const allBtns = document.querySelectorAll('.dash-tab-btn');
  allBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update panes
  const allPanes = document.querySelectorAll('.tab-pane');
  allPanes.forEach(pane => {
    pane.style.display = pane.id === `pane-${tabId}` ? 'block' : 'none';
  });

  // Load enquiries when that tab is opened
  if (tabId === 'enquiries') {
    updateHeading();
  }
}

function updateHeading() {
  const unread = enquiries ? enquiries.filter((e) => !e.read).length : 0;
  const heading = document.getElementById('dashTitle');
  if (heading) {
    heading.innerHTML = unread > 0
      ? `Admin Dashboard <span class="new-badge">(${unread} NEW)</span>`
      : 'Admin Dashboard';
  }
}

/* ============================================================
   ENQUIRIES INBOX RENDERING
   ============================================================ */
function renderCard(e) {
  const card = document.createElement('li');
  card.className = `enquiry-card${e.read ? '' : ' unread'}`;
  card.dataset.id = e.id;

  card.innerHTML = `
    <div class="card-top">
      <div>
        <p class="card-meta-name">
          ${!e.read ? '<span class="unread-dot" aria-label="Unread"></span>' : ''}
          ${escHtml(e.name)}
          <span class="card-email">${escHtml(e.email)}</span>
        </p>
        <p class="card-sub">${escHtml(e.project_type)} — ${fmtDate(e.created_at)}</p>
      </div>
      <div class="card-btns">
        <button class="btn-card" data-action="toggle-read" aria-label="${e.read ? 'Mark as unread' : 'Mark as read'}" title="${e.read ? 'Mark as unread' : 'Mark as read'}">
          ${e.read ? ICON.mail : ICON.mailOpen}
        </button>
        <button class="btn-card delete" data-action="delete" aria-label="Delete enquiry" title="Delete">
          ${ICON.trash}
        </button>
      </div>
    </div>
    <p class="card-body">${escHtml(e.message)}</p>
  `;

  return card;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderList() {
  const container = $('enquiryList');
  container.innerHTML = '';

  if (enquiries === null) {
    container.innerHTML = '<p class="loading-state">Loading…</p>';
    return;
  }

  if (enquiries.length === 0) {
    container.innerHTML = '<p class="empty-state">No enquiries yet — they\'ll appear here when someone uses the contact form.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.style.cssText = 'display:flex;flex-direction:column;gap:12px;list-style:none;padding:0;margin:0;';
  enquiries.forEach((e) => ul.appendChild(renderCard(e)));
  container.appendChild(ul);

  updateHeading();
}

async function loadEnquiries() {
  if (USE_LOCAL) {
    LOCAL.seed();
    enquiries = LOCAL.load();
    renderList();
    return;
  }

  try {
    enquiries = await apiFetch('/admin/enquiries');
    renderList();
  } catch {
    enquiries = [];
    renderList();
  }
}

async function toggleRead(id) {
  if (USE_LOCAL) {
    enquiries = enquiries.map((e) =>
      e.id === id ? { ...e, read: !e.read } : e
    );
    LOCAL.save(enquiries);
    renderList();
    return;
  }

  try {
    const updated = await apiFetch(`/admin/enquiries/${id}`, { method: 'PATCH' });
    enquiries = enquiries.map((e) => (e.id === id ? updated : e));
    renderList();
  } catch {
    toast('Failed to update enquiry.', 'error');
  }
}

async function deleteEnquiry(id) {
  if (USE_LOCAL) {
    enquiries = enquiries.filter((e) => e.id !== id);
    LOCAL.save(enquiries);
    renderList();
    toast('Enquiry deleted.');
    return;
  }

  try {
    await apiFetch(`/admin/enquiries/${id}`, { method: 'DELETE' });
    enquiries = enquiries.filter((e) => e.id !== id);
    renderList();
    toast('Enquiry deleted.');
  } catch {
    toast('Failed to delete enquiry.', 'error');
  }
}

/* ============================================================
   CMS WEBSITE EDITOR CONTROL
   ============================================================ */
async function loadCMSData() {
  // 1. LocalStorage
  try {
    const local = localStorage.getItem('portfolio_data');
    if (local) {
      portfolioData = JSON.parse(local);
    }
  } catch (_) {}

  // 2. Fetch data.json
  if (!portfolioData) {
    try {
      const res = await fetch('data.json');
      if (res.ok) {
        portfolioData = await res.json();
      }
    } catch (_) {}
  }

  // 3. Fallback
  if (!portfolioData) {
    portfolioData = DEFAULT_PORTFOLIO_DATA;
  }

  populateEditorForm();
  // Re-wire drop zones after values are set so existing images show as previews
  setTimeout(() => initImageDropZones(), 0);
}

function populateEditorForm() {
  if (!portfolioData) return;

  // GitHub token
  const ghEl = $('editGithubToken');
  if (ghEl) ghEl.value = localStorage.getItem('ff_gh_token') || '';

  // Profile tab — Name (mapped from nav.logoText)
  const nameEl = $('editName');
  if (nameEl) nameEl.value = portfolioData.nav ? portfolioData.nav.logoText : '';

  // Contact
  const emailEl = $('editContactEmail');
  if (emailEl) emailEl.value = portfolioData.contact ? portfolioData.contact.email : '';

  const igEl = $('editInstagram');
  if (igEl) igEl.value = portfolioData.contact ? (portfolioData.contact.instagram || '') : '';

  const ytEl = $('editYouTube');
  if (ytEl) ytEl.value = portfolioData.contact ? (portfolioData.contact.youtube || '') : '';

  const liEl = $('editLinkedIn');
  if (liEl) liEl.value = portfolioData.contact ? (portfolioData.contact.linkedin || '') : '';

  const vimeoEl = $('editVimeo');
  if (vimeoEl) vimeoEl.value = portfolioData.contact ? (portfolioData.contact.vimeo || '') : '';

  const ghSocialEl = $('editGitHub');
  if (ghSocialEl) ghSocialEl.value = portfolioData.contact ? (portfolioData.contact.github || '') : '';

  const xEl = $('editX');
  if (xEl) xEl.value = portfolioData.contact ? (portfolioData.contact.x || '') : '';

  const artEl = $('editArtStation');
  if (artEl) artEl.value = portfolioData.contact ? (portfolioData.contact.artstation || '') : '';

  // Availability
  const availEl = $('editAvailability');
  if (availEl) availEl.value = portfolioData.hero ? (portfolioData.hero.availability || '') : '';

  // Hero
  const eyebrowEl = $('editHeroEyebrow');
  if (eyebrowEl) eyebrowEl.value = portfolioData.hero ? portfolioData.hero.eyebrow : '';

  const subtextEl = $('editHeroSubtext');
  if (subtextEl) subtextEl.value = portfolioData.hero ? portfolioData.hero.subtext : '';

  const heroBgEl = $('editHeroBgImage');
  if (heroBgEl) heroBgEl.value = portfolioData.hero ? (portfolioData.hero.showreelPoster || '') : '';

  const showreelEl = $('editHeroShowreel');
  if (showreelEl) showreelEl.value = portfolioData.hero ? portfolioData.hero.showreelVideo : '';

  const durationEl = $('editShowreelDuration');
  if (durationEl) durationEl.value = portfolioData.hero ? portfolioData.hero.showreelDuration : '01:00';

  // Portrait image
  const portraitImgEl = $('editAboutPortraitImage');
  if (portraitImgEl) portraitImgEl.value = portfolioData.about ? (portfolioData.about.portraitImage || '') : '';

  // About tab
  const aboutHeadEl = $('editAboutHeading');
  if (aboutHeadEl) aboutHeadEl.value = portfolioData.about ? portfolioData.about.headingLines.join(', ') : '';

  const captionEl = $('editPortraitCaption');
  if (captionEl) captionEl.value = portfolioData.about ? portfolioData.about.portraitCaption : '';

  const bio1El = $('editBioParagraph1');
  if (bio1El) bio1El.value = portfolioData.about ? portfolioData.about.bioParagraph1 : '';

  const bio2El = $('editBioParagraph2');
  if (bio2El) bio2El.value = portfolioData.about ? portfolioData.about.bioParagraph2 : '';

  const locEl = $('editAboutLocation');
  if (locEl) locEl.value = portfolioData.about ? portfolioData.about.location : '';

  const expEl = $('editAboutExperience');
  if (expEl) expEl.value = portfolioData.about ? portfolioData.about.experience : '';

  const specEl = $('editAboutSpecialties');
  if (specEl) specEl.value = portfolioData.about ? portfolioData.about.specialties : '';

  // Render dynamic lists
  renderProjectEditors(portfolioData.projects || []);
  renderExperienceEditors(portfolioData.experienceTimeline || []);
  renderServicesEditors(portfolioData.services || []);
  renderToolkitEditor(portfolioData.toolkit || {});
}

function renderProjectEditors(projects) {
  const container = $('projectsEditorList');
  container.innerHTML = '';

  if (projects.length === 0) {
    container.innerHTML = '<p style="font-size:12px; color:#666;">No projects added yet.</p>';
    return;
  }

  projects.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'project-editor-card';

    // Safely get breakdown details with raw fallbacks
    const rawBreakdown = p.breakdown || {};
    const stages = ['RAW', 'EDIT', 'COLOR', 'MOTION', 'SOUND', 'FINAL'];
    const stagesHtml = stages.map(s => {
      const stageData = rawBreakdown[s] || { image: '', desc: '' };
      return `
        <div style="border-left: 2px solid #222; padding-left: 12px; margin-top: 8px;">
          <span style="font-size:10px; font-weight:700; color:var(--color-accent); letter-spacing:0.05em;">${s} STAGE</span>
          <div class="form-field" style="margin-top: 6px;">
            <label class="admin-label">Stage Image</label>
            <div class="img-drop-zone" data-target="stage-${s.toLowerCase()}-image" role="button" tabindex="0" aria-label="Upload ${s} stage image">
              <input type="file" accept="image/*" aria-label="Choose ${s} stage image file" />
              <svg class="img-drop-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="img-drop-label"><span>Choose a file</span> or drag it here</p>
              ${stageData.image ? `<img class="img-drop-preview visible" src="${escHtml(stageData.image)}" alt="${s} stage preview" />` : `<img class="img-drop-preview" alt="${s} stage preview" />`}
              <button type="button" class="img-drop-clear${stageData.image ? ' visible' : ''}">✕ REMOVE</button>
            </div>
            <input type="hidden" class="stage-${s.toLowerCase()}-image" value="${escHtml(stageData.image)}" />
          </div>
          <div class="form-field" style="margin-top: 4px;">
            <label class="admin-label">Description</label>
            <input type="text" class="admin-input stage-${s.toLowerCase()}-desc" required value="${escHtml(stageData.desc)}" placeholder="Description of the stage..." />
          </div>
        </div>
      `;
    }).join('\n');

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span class="admin-eyebrow" style="font-size:10px; letter-spacing:0.1em; color:var(--color-accent);">PROJECT #${idx + 1}</span>
        <button type="button" class="btn-pill-danger btn-delete-project" data-idx="${idx}">DELETE</button>
      </div>

      <div class="form-grid-2">
        <div class="form-field">
          <label class="admin-label">Title</label>
          <input type="text" class="admin-input p-title" value="${escHtml(p.title)}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Category</label>
          <input type="text" class="admin-input p-category" value="${escHtml(p.category)}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Role</label>
          <input type="text" class="admin-input p-role" value="${escHtml(p.role)}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Software (comma separated)</label>
          <input type="text" class="admin-input p-software" value="${escHtml(p.software)}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Year</label>
          <input type="text" class="admin-input p-year" value="${escHtml(p.year)}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Video URL (MP4 / stream)</label>
          <input type="url" class="admin-input p-video" value="${escHtml(p.video)}" />
        </div>
      </div>

      <div class="form-field">
        <label class="admin-label">Poster / Thumbnail Image</label>
        <div class="img-drop-zone" data-target="p-image" role="button" tabindex="0" aria-label="Upload project thumbnail">
          <input type="file" accept="image/*" aria-label="Choose project thumbnail file" />
          <svg class="img-drop-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p class="img-drop-label"><span>Choose a file</span> or drag it here</p>
          ${p.image ? `<img class="img-drop-preview visible" src="${escHtml(p.image)}" alt="Project thumbnail preview" />` : `<img class="img-drop-preview" alt="Project thumbnail preview" />`}
          <button type="button" class="img-drop-clear${p.image ? ' visible' : ''}">✕ REMOVE</button>
        </div>
        <input type="hidden" class="p-image" value="${escHtml(p.image || '')}" />
      </div>

      <div class="form-field">
        <label class="admin-label">Description</label>
        <textarea class="admin-input p-description" style="min-height:80px;">${escHtml(p.description)}</textarea>
      </div>

      <details style="border-top:1px solid var(--color-border); padding-top:14px; margin-top:4px;">
        <summary>▸ EDIT 6-STAGE VIDEO BREAKDOWN</summary>
        <div style="display:flex; flex-direction:column; gap:16px; margin-top:14px;">
          ${stagesHtml}
        </div>
      </details>
    `;

    container.appendChild(card);
    initImageDropZones(card); // wire drop zones for this project card
  });
}

/* ── Experience Editor ────────────────────────────────────── */
function renderExperienceEditors(timeline) {
  const container = $('experienceEditorList');
  if (!container) return;
  container.innerHTML = '';

  if (!timeline.length) {
    container.innerHTML = '<p style="font-size:12px; color:#555;">No experience entries yet.</p>';
    return;
  }

  timeline.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'project-editor-card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size:10px; font-weight:700; color:var(--color-accent); letter-spacing:0.08em;">ENTRY #${idx + 1}</span>
        <button type="button" class="btn-pill-danger btn-delete-experience" data-idx="${idx}">DELETE</button>
      </div>
      <div class="form-grid-2">
        <div class="form-field">
          <label class="admin-label">Year</label>
          <input type="text" class="admin-input exp-year" value="${escHtml(item.year || '')}" placeholder="2026" />
        </div>
        <div class="form-field">
          <label class="admin-label">Role</label>
          <input type="text" class="admin-input exp-role" value="${escHtml(item.role || '')}" placeholder="VIDEO EDITOR" />
        </div>
      </div>
      <div class="form-field">
        <label class="admin-label">Place / Company</label>
        <input type="text" class="admin-input exp-place" value="${escHtml(item.place || '')}" placeholder="FREELANCE" />
      </div>
      <div class="form-field">
        <label class="admin-label">Description</label>
        <textarea class="admin-input exp-desc" style="min-height: 70px;">${escHtml(item.desc || '')}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── Services Editor ─────────────────────────────────────── */
function renderServicesEditors(services) {
  const container = $('servicesEditorList');
  if (!container) return;
  container.innerHTML = '';

  services.forEach((s, idx) => {
    const div = document.createElement('div');
    div.style.cssText = 'border-bottom: 1px solid #1e1e1e; padding-bottom: 16px; display: flex; flex-direction: column; gap: 10px;';
    div.innerHTML = `
      <div class="form-grid-2">
        <div class="form-field">
          <label class="admin-label">Service Title</label>
          <input type="text" class="admin-input svc-title" value="${escHtml(s.title || '')}" />
        </div>
        <div class="form-field">
          <label class="admin-label">Items (comma separated)</label>
          <input type="text" class="admin-input svc-items" value="${escHtml((s.items || []).join(', '))}" />
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

/* ── Toolkit Editor ──────────────────────────────────────── */
function renderToolkitEditor(toolkit) {
  const container = $('toolkitEditorGrid');
  if (!container) return;
  container.innerHTML = '';

  const cats = [
    { key: 'editing', label: 'Editing' },
    { key: 'motion',  label: 'Motion' },
    { key: 'design',  label: 'Design' },
    { key: 'threeD',  label: '3D' },
    { key: 'audio',   label: 'Audio' },
  ];

  cats.forEach(cat => {
    const val = (toolkit[cat.key] || []).join(', ');
    const div = document.createElement('div');
    div.className = 'form-field';
    div.innerHTML = `
      <label class="admin-label">${cat.label} Tools (comma separated)</label>
      <input type="text" class="admin-input toolkit-${cat.key}" value="${escHtml(val)}" placeholder="e.g. Premiere Pro, DaVinci Resolve" />
    `;
    container.appendChild(div);
  });
}


/* ============================================================
   STORAGE HELPERS
   ============================================================ */

/**
 * Returns a deep copy of data with base64 data URLs replaced by empty strings.
 * Base64 images are too large for GitHub API — store URLs only.
 */
function stripBase64ForStorage(data) {
  const json = JSON.stringify(data);
  const stripped = json.replace(/"data:[^"]{0,20};base64,[^"]+"/g, '""');
  try {
    return JSON.parse(stripped);
  } catch {
    return data;
  }
}

/**
 * Compress an image File to a JPEG data URL at reduced quality/size.
 */
function compressImage(file, maxWidth = 800, quality = 0.72) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function saveLocalPreview() {
  // ── Get GitHub token (required) ────────────────────────────
  const ghToken = localStorage.getItem('ff_gh_token') || '';

  if (!ghToken) {
    // Show the token setup panel instead of saving
    showTokenSetup();
    return;
  }

  // Disable all save buttons while publishing
  setSaveButtonsState(true);

  const val = (id) => { const el = $(id); return el ? el.value.trim() : ''; };

  // Serialize services
  const svcCards = document.querySelectorAll('#servicesEditorList > div');
  const services = Array.from(svcCards).map((card, idx) => ({
    num: String(idx + 1).padStart(2, '0'),
    title: card.querySelector('.svc-title') ? card.querySelector('.svc-title').value.trim() : '',
    items: card.querySelector('.svc-items') ? card.querySelector('.svc-items').value.split(',').map(s => s.trim()).filter(Boolean) : []
  }));

  // Serialize toolkit
  const toolkit = {};
  ['editing','motion','design','threeD','audio'].forEach(k => {
    const el = document.querySelector(`.toolkit-${k}`);
    toolkit[k] = el ? el.value.split(',').map(s => s.trim()).filter(Boolean) : (portfolioData.toolkit ? portfolioData.toolkit[k] || [] : []);
  });

  // Serialize experience
  const expCards = document.querySelectorAll('#experienceEditorList .project-editor-card');
  const experienceTimeline = Array.from(expCards).map(card => ({
    year:  card.querySelector('.exp-year')  ? card.querySelector('.exp-year').value.trim()  : '',
    role:  card.querySelector('.exp-role')  ? card.querySelector('.exp-role').value.trim()  : '',
    place: card.querySelector('.exp-place') ? card.querySelector('.exp-place').value.trim() : '',
    desc:  card.querySelector('.exp-desc')  ? card.querySelector('.exp-desc').value.trim()  : '',
  }));

  // Build updated data object
  const updatedData = {
    nav: { logoText: val('editName') || (portfolioData.nav ? portfolioData.nav.logoText : '') },
    hero: {
      eyebrow: val('editHeroEyebrow'),
      headlineLines: portfolioData.hero ? portfolioData.hero.headlineLines : ['CUTTING', 'STORIES INTO', 'MOTION.'],
      subtext: val('editHeroSubtext'),
      availability: val('editAvailability'),
      showreelVideo: val('editHeroShowreel'),
      showreelPoster: val('editHeroBgImage') || (portfolioData.hero ? portfolioData.hero.showreelPoster : ''),
      showreelDuration: val('editShowreelDuration') || '01:00'
    },
    marquee: portfolioData.marquee || ['EDIT', 'DESIGN', 'STORYTELL', 'COLOR', 'SOUND', 'MOTION'],
    about: {
      headingLines: val('editAboutHeading').split(',').map(s => s.trim()).filter(Boolean),
      portraitCaption: val('editPortraitCaption'),
      portraitImage: val('editAboutPortraitImage') || (portfolioData.about ? portfolioData.about.portraitImage : ''),
      bioParagraph1: val('editBioParagraph1'),
      bioParagraph2: val('editBioParagraph2'),
      location: val('editAboutLocation'),
      experience: val('editAboutExperience'),
      specialties: val('editAboutSpecialties')
    },
    services: services.length ? services : (portfolioData.services || []),
    toolkit,
    process: portfolioData.process || [],
    experienceTimeline: experienceTimeline.length ? experienceTimeline : (portfolioData.experienceTimeline || []),
    contact: {
      email:      val('editContactEmail'),
      instagram:  val('editInstagram'),
      youtube:    val('editYouTube'),
      linkedin:   val('editLinkedIn'),
      vimeo:      val('editVimeo'),
      github:     val('editGitHub'),
      x:          val('editX'),
      artstation: val('editArtStation')
    },
    projects: serializeProjects()
  };

  // Strip base64 images (too large for GitHub API) — keep URLs only
  const publishData = stripBase64ForStorage(updatedData);
  portfolioData = updatedData; // keep in memory

  // Push directly to GitHub
  await publishToGithub(publishData, ghToken);

  setSaveButtonsState(false);
}

function setSaveButtonsState(disabled) {
  document.querySelectorAll('.btn-pill-save').forEach(btn => {
    btn.disabled = disabled;
    btn.textContent = disabled ? 'PUBLISHING…' : btn.getAttribute('data-label') || btn.textContent.replace('PUBLISHING…', '') || 'SAVE';
  });
}

function showTokenSetup() {
  // Scroll to token bar and highlight it
  const bar = $('tokenBar');
  if (bar) {
    bar.scrollIntoView({ behavior: 'smooth' });
    bar.style.borderColor = 'var(--color-accent)';
    setTimeout(() => { bar.style.borderColor = ''; }, 2500);
  }
  const input = $('editGithubToken');
  if (input) input.focus();
  toast('Paste your GitHub token first to enable publishing.', 'error');
}

async function publishToGithub(updatedData, token) {
  const statusAlert = $('publishStatusAlert');
  if (statusAlert) statusAlert.style.display = 'none';

  try {
    const owner = 'vishnuvardhanamgogames-byte';
    const repo  = 'V_SquareEdits.github.io';
    const path  = 'data.json';

    // 1. Get current SHA of data.json
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } }
    );

    if (!getRes.ok) throw new Error(`GitHub error ${getRes.status} — check your token.`);

    const { sha } = await getRes.json();

    // 2. Write new content
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(updatedData, null, 2))));

    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update portfolio via Admin CMS',
          content: contentBase64,
          sha,
          branch: 'main'
        })
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      throw new Error(err.message || `GitHub write failed (${putRes.status})`);
    }

    toast('🚀 Published! Live site updates in ~1 minute.');
    if (statusAlert) {
      statusAlert.style.display = 'block';
      statusAlert.scrollIntoView({ behavior: 'smooth' });
    }

  } catch (err) {
    console.error(err);
    toast(err.message || 'Failed to publish to GitHub.', 'error');
  }
}


function serializeProjects() {
  // Only grab project cards inside #projectsEditorList to avoid grabbing experience cards
  const cards = $$('#projectsEditorList .project-editor-card');
  return cards.map((card, idx) => {
    const stages = ['raw', 'edit', 'color', 'motion', 'sound', 'final'];
    const breakdown = {};
    stages.forEach(s => {
      const imgEl = card.querySelector(`.stage-${s}-image`);
      const descEl = card.querySelector(`.stage-${s}-desc`);
      breakdown[s.toUpperCase()] = {
        image: imgEl ? imgEl.value.trim() : '',
        desc:  descEl ? descEl.value.trim() : ''
      };
    });

    return {
      index: String(idx + 1).padStart(2, '0'),
      title:       card.querySelector('.p-title')       ? card.querySelector('.p-title').value.trim()       : '',
      category:    card.querySelector('.p-category')    ? card.querySelector('.p-category').value.trim()    : '',
      role:        card.querySelector('.p-role')        ? card.querySelector('.p-role').value.trim()        : '',
      software:    card.querySelector('.p-software')    ? card.querySelector('.p-software').value.trim()    : '',
      year:        card.querySelector('.p-year')        ? card.querySelector('.p-year').value.trim()        : '',
      video:       card.querySelector('.p-video')       ? card.querySelector('.p-video').value.trim()       : '',
      image:       card.querySelector('.p-image')       ? card.querySelector('.p-image').value.trim()       : '',
      description: card.querySelector('.p-description') ? card.querySelector('.p-description').value.trim() : '',
      breakdown
    };
  });
}

function serializeExperience() {
  const cards = $$('#experienceEditorList .project-editor-card');
  return cards.map(card => ({
    year:  card.querySelector('.exp-year')  ? card.querySelector('.exp-year').value.trim()  : '',
    role:  card.querySelector('.exp-role')  ? card.querySelector('.exp-role').value.trim()  : '',
    place: card.querySelector('.exp-place') ? card.querySelector('.exp-place').value.trim() : '',
    desc:  card.querySelector('.exp-desc')  ? card.querySelector('.exp-desc').value.trim()  : '',
  }));
}


function exportConfigJson() {
  // First, serialize current values
  saveLocalPreview();

  if (!portfolioData) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  
  toast('Config file data.json downloaded.');
}

/* ============================================================
   AUTH CONTROL
   ============================================================ */
async function login(email, password) {
  const btn = $('loginBtn');
  const errEl = $('loginError');
  errEl.textContent = '';
  btn.textContent = 'SIGNING IN...';
  btn.disabled = true;

  if (USE_LOCAL) {
    await new Promise((r) => setTimeout(r, 500));
    const validEmail    = 'admin@frameflow.studio';
    const validPassword = 'FrameFlow@2026';
    if (email !== validEmail || password !== validPassword) {
      errEl.textContent = 'Invalid email or password';
      btn.textContent = 'SIGN IN';
      btn.disabled = false;
      return;
    }
    token = 'local-token';
    localStorage.setItem('ff_token', token);
    btn.textContent = 'SIGN IN';
    btn.disabled = false;
    showDashboard();
    loadEnquiries();
    loadCMSData();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const detail = typeof body.detail === 'string' ? body.detail : 'Login failed.';
      throw new Error(detail);
    }
    const data = await res.json();
    token = data.access_token;
    localStorage.setItem('ff_token', token);
    showDashboard();
    loadEnquiries();
    loadCMSData();
  } catch (err) {
    errEl.textContent = err.message || 'Login failed.';
  } finally {
    btn.textContent = 'SIGN IN';
    btn.disabled = false;
  }
}

function logout() {
  if (!USE_LOCAL && token) {
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem('ff_token');
  token = '';
  enquiries = null;
  portfolioData = null;
  showLogin();
}

function saveEnquiryLocally(payload) {
  const list = LOCAL.load();
  list.unshift({
    id: 'local-' + Date.now(),
    ...payload,
    read: false,
    created_at: new Date().toISOString(),
  });
  LOCAL.save(list);
}

window.FF_saveEnquiry = saveEnquiryLocally;

/* ============================================================
   DRAG & DROP IMAGE UPLOAD HELPER
   ============================================================ */

/**
 * Bind a drag-and-drop upload zone.
 * @param {HTMLElement} zone  - the .img-drop-zone element
 * @param {HTMLInputElement} hiddenInput - the hidden input that stores the value
 */
function bindDropZone(zone, hiddenInput) {
  if (!zone || !hiddenInput) return;

  const fileInput  = zone.querySelector('input[type="file"]');
  const preview    = zone.querySelector('.img-drop-preview');
  const clearBtn   = zone.querySelector('.img-drop-clear');

  function applyImage(src) {
    hiddenInput.value = src;
    if (preview) {
      preview.src = src;
      preview.classList.add('visible');
    }
    if (clearBtn) clearBtn.classList.add('visible');
  }

  function clearImage() {
    hiddenInput.value = '';
    if (preview) {
      preview.src = '';
      preview.classList.remove('visible');
    }
    if (clearBtn) clearBtn.classList.remove('visible');
    if (fileInput) fileInput.value = '';
  }

  // Populate preview if hidden input already has a value (on form load)
  if (hiddenInput.value) {
    if (preview) {
      preview.src = hiddenInput.value;
      preview.classList.add('visible');
    }
    if (clearBtn) clearBtn.classList.add('visible');
  }

  // File chosen via the native picker
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      compressImage(file).then(applyImage);
    });
  }

  // Drag events
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', (e) => {
    if (!zone.contains(e.relatedTarget)) {
      zone.classList.remove('drag-over');
    }
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      compressImage(file).then(applyImage);
    } else {
      toast('Please drop an image file.', 'error');
    }
  });

  // Keyboard accessibility
  zone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (fileInput) fileInput.click();
    }
  });

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearImage();
    });
  }
}

function readFileAsDataURL(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}

/**
 * Wire up all drop zones in a given container (or document).
 * For zones with data-target, finds the hidden input by class within the same card.
 */
function initImageDropZones(container) {
  const root = container || document;

  // Fixed zones by ID
  const fixedZones = [
    { zoneId: 'dropHeroBg',   inputId: 'editHeroBgImage'       },
    { zoneId: 'dropPortrait', inputId: 'editAboutPortraitImage' },
  ];

  fixedZones.forEach(({ zoneId, inputId }) => {
    const zone  = root.getElementById ? root.getElementById(zoneId) : null;
    const input = root.getElementById ? root.getElementById(inputId) : null;
    if (zone && input) bindDropZone(zone, input);
  });

  // Dynamic zones via data-target (project cards & stage images)
  const dynamicZones = (container || document).querySelectorAll('.img-drop-zone[data-target]');
  dynamicZones.forEach((zone) => {
    const targetClass = zone.dataset.target;
    // The hidden input is a sibling or within the same form-field
    const parent = zone.closest('.form-field') || zone.parentElement;
    const input  = parent ? parent.querySelector(`.${targetClass}`) : null;
    if (input) bindDropZone(zone, input);
  });
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Login form ──────────────────────────────────────────────
  $('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = $('loginForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const email    = $('adminEmail').value.trim();
    const password = $('adminPassword').value;
    login(email, password);
  });

  // ── Logout ─────────────────────────────────────────────────
  $('logoutBtn').addEventListener('click', logout);

  // ── Token bar: save token & update UI ─────────────────────
  function updateTokenBar() {
    const saved = localStorage.getItem('ff_gh_token') || '';
    const label = $('tokenBarLabel');
    const input = $('editGithubToken');
    if (saved) {
      if (label) { label.textContent = '✓ GitHub token saved — saves publish live automatically'; label.style.color = 'var(--color-accent)'; }
      if (input) input.value = saved;
    } else {
      if (label) { label.textContent = 'GitHub token not set — paste your token to enable live publishing'; label.style.color = '#A0A0A0'; }
    }
  }

  const saveTokenBtn = $('saveTokenBtn');
  if (saveTokenBtn) {
    saveTokenBtn.addEventListener('click', () => {
      const input = $('editGithubToken');
      const t = input ? input.value.trim() : '';
      if (!t) { toast('Paste your GitHub token first.', 'error'); return; }
      localStorage.setItem('ff_gh_token', t);
      updateTokenBar();
      toast('✓ Token saved! Every save now publishes live to GitHub.');
    });
  }

  updateTokenBar();

  // ── Refresh enquiries ──────────────────────────────────────
  $('refreshBtn').addEventListener('click', () => {
    enquiries = null;
    renderList();
    loadEnquiries();
  });

  // ── Enquiry list actions (delegated) ───────────────────────
  $('enquiryList').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-action]');
    if (!btn) return;
    const card = btn.closest('[data-id]');
    if (!card) return;
    const id = card.dataset.id;

    if (btn.dataset.action === 'toggle-read') toggleRead(id);
    if (btn.dataset.action === 'delete')      deleteEnquiry(id);
  });

  // ── Tabs Switching (delegated to all .dash-tab-btn) ───────
  document.querySelectorAll('.dash-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId) switchTab(tabId);
    });
  });

  // ── Add New Project ────────────────────────────────────────
  $('addNewProjectBtn').addEventListener('click', () => {
    const currentProj = serializeProjects();
    const newProj = {
      index: String(currentProj.length + 1).padStart(2, '0'),
      title: 'New Cinematic Project',
      category: 'Editing / Color / VFX',
      role: 'Editor',
      software: 'Premiere Pro',
      year: new Date().getFullYear().toString(),
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      image: 'https://images.unsplash.com/photo-1758553026412-bc1da0ebd366?crop=entropy&cs=srgb&fm=jpg&q=80',
      description: 'Explain the details of your edit and story.',
      breakdown: {
        RAW: { image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80', desc: 'Raw footage desc.' },
        EDIT: { image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80', desc: 'Editing desc.' },
        COLOR: { image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80', desc: 'Color grading desc.' },
        MOTION: { image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80', desc: 'Motion graphics desc.' },
        SOUND: { image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80', desc: 'Sound design desc.' },
        FINAL: { image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80', desc: 'Final render desc.' }
      }
    };
    currentProj.push(newProj);
    portfolioData.projects = currentProj;
    renderProjectEditors(currentProj);
    toast('New project card added at bottom.');
  });

  // ── Delete Project (delegated) ─────────────────────────────
  $('projectsEditorList').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete-project');
    if (!btn) return;
    
    if (confirm('Are you sure you want to delete this project?')) {
      const currentProj = serializeProjects();
      const deleteIdx = parseInt(btn.dataset.idx, 10);
      currentProj.splice(deleteIdx, 1);
      portfolioData.projects = currentProj;
      renderProjectEditors(currentProj);
      toast('Project deleted.');
    }
  });

  // ── Reset to Server Database ─────────────────────────────
  $('resetToDefaultBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to discard your local preview and reset all details from your GitHub database?')) {
      try {
        const res = await fetch(`data.json?v=${Date.now()}`);
        if (res.ok) {
          const freshData = await res.json();
          localStorage.setItem('portfolio_data', JSON.stringify(freshData));
          portfolioData = freshData;
          populateEditorForm();
          setTimeout(() => initImageDropZones(), 0);
          toast('Successfully reset and synced all details from GitHub!');
        } else {
          throw new Error('Failed to retrieve data.json from server.');
        }
      } catch (err) {
        console.error(err);
        toast('Failed to sync details from GitHub.', 'error');
      }
    }
  });

  // ── Save Form Submit ───────────────────────────────────────
  $('websiteEditorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveLocalPreview();
  });

  // ── Add New Experience ─────────────────────────────────────
  const addExpBtn = $('addNewExperienceBtn');
  if (addExpBtn) {
    addExpBtn.addEventListener('click', () => {
      const current = serializeExperience();
      current.push({ year: new Date().getFullYear().toString(), role: 'NEW ROLE', place: 'COMPANY / CLIENT', desc: 'Describe your responsibilities here.' });
      portfolioData.experienceTimeline = current;
      renderExperienceEditors(current);
      toast('New experience entry added.');
    });
  }

  // ── Delete Experience (delegated) ─────────────────────────
  const expList = $('experienceEditorList');
  if (expList) {
    expList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-experience');
      if (!btn) return;
      if (confirm('Delete this experience entry?')) {
        const current = serializeExperience();
        current.splice(parseInt(btn.dataset.idx, 10), 1);
        portfolioData.experienceTimeline = current;
        renderExperienceEditors(current);
        toast('Experience entry deleted.');
      }
    });
  }

  // ── Init ───────────────────────────────────────────────────
  initImageDropZones(); // wire up fixed drop zones (portrait, hero bg)

  if (token) {
    showDashboard();
    loadEnquiries();
    loadCMSData();
  } else {
    showLogin();
  }

});
