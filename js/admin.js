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
    "logoText": "ALEX MERCER"
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
    "vimeo": "https://vimeo.com/yourhandle"
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
  
  // Refresh tabs on login
  switchTab('enquiries');
}

function switchTab(tabId) {
  const enquiriesBtn = $('tabEnquiriesBtn');
  const editWebsiteBtn = $('tabEditWebsiteBtn');
  const enquiriesContent = $('enquiriesTabContent');
  const editWebsiteContent = $('editWebsiteTabContent');

  if (tabId === 'enquiries') {
    enquiriesBtn.style.color = '#FFF';
    enquiriesBtn.style.borderBottomColor = 'var(--color-accent)';
    editWebsiteBtn.style.color = '#666';
    editWebsiteBtn.style.borderBottomColor = 'transparent';

    enquiriesContent.style.display = 'block';
    editWebsiteContent.style.display = 'none';
    
    updateHeading();
  } else {
    editWebsiteBtn.style.color = '#FFF';
    editWebsiteBtn.style.borderBottomColor = 'var(--color-accent)';
    enquiriesBtn.style.color = '#666';
    enquiriesBtn.style.borderBottomColor = 'transparent';

    enquiriesContent.style.display = 'none';
    editWebsiteContent.style.display = 'block';
    
    $('dashTitle').textContent = 'EDIT WEBSITE CONTENT';
  }
}

function updateHeading() {
  if ($('editWebsiteTabContent').style.display === 'block') {
    $('dashTitle').textContent = 'EDIT WEBSITE CONTENT';
    return;
  }
  const unread = enquiries ? enquiries.filter((e) => !e.read).length : 0;
  $('dashTitle').innerHTML = unread > 0
    ? `PROJECT ENQUIRIES <span class="new-badge">(${unread} NEW)</span>`
    : 'PROJECT ENQUIRIES';
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
}

function populateEditorForm() {
  if (!portfolioData) return;

  // General & Nav
  $('editLogoText').value = portfolioData.nav ? portfolioData.nav.logoText : '';
  $('editContactEmail').value = portfolioData.contact ? portfolioData.contact.email : '';
  $('editInstagram').value = portfolioData.contact ? portfolioData.contact.instagram : '';
  $('editYouTube').value = portfolioData.contact ? portfolioData.contact.youtube : '';
  $('editLinkedIn').value = portfolioData.contact ? portfolioData.contact.linkedin : '';
  $('editVimeo').value = portfolioData.contact ? portfolioData.contact.vimeo : '';

  // Hero
  $('editHeroEyebrow').value = portfolioData.hero ? portfolioData.hero.eyebrow : '';
  $('editHeroHeadline').value = portfolioData.hero ? portfolioData.hero.headlineLines.join(', ') : '';
  $('editHeroSubtext').value = portfolioData.hero ? portfolioData.hero.subtext : '';
  $('editHeroBgImage').value = portfolioData.hero ? (portfolioData.hero.showreelPoster || '') : '';
  $('editHeroShowreel').value = portfolioData.hero ? portfolioData.hero.showreelVideo : '';
  $('editShowreelDuration').value = portfolioData.hero ? portfolioData.hero.showreelDuration : '01:00';

  // About
  $('editAboutHeading').value = portfolioData.about ? portfolioData.about.headingLines.join(', ') : '';
  $('editPortraitCaption').value = portfolioData.about ? portfolioData.about.portraitCaption : '';
  $('editAboutPortraitImage').value = portfolioData.about ? (portfolioData.about.portraitImage || '') : '';
  $('editBioParagraph1').value = portfolioData.about ? portfolioData.about.bioParagraph1 : '';
  $('editBioParagraph2').value = portfolioData.about ? portfolioData.about.bioParagraph2 : '';
  $('editAboutLocation').value = portfolioData.about ? portfolioData.about.location : '';
  $('editAboutExperience').value = portfolioData.about ? portfolioData.about.experience : '';
  $('editAboutSpecialties').value = portfolioData.about ? portfolioData.about.specialties : '';

  // Render project editors list
  renderProjectEditors(portfolioData.projects || []);
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
    card.style.cssText = 'border: 1px solid #1e1e1e; background: #0b0b0b; padding: 24px; display: flex; flex-direction: column; gap: 16px; position: relative;';

    // Safely get breakdown details with raw fallbacks
    const rawBreakdown = p.breakdown || {};
    const stages = ['RAW', 'EDIT', 'COLOR', 'MOTION', 'SOUND', 'FINAL'];
    const stagesHtml = stages.map(s => {
      const stageData = rawBreakdown[s] || { image: '', desc: '' };
      return `
        <div style="border-left: 2px solid #222; padding-left: 12px; margin-top: 8px;">
          <span style="font-size:10px; font-weight:700; color:var(--color-accent); letter-spacing:0.05em;">${s} STAGE</span>
          <div class="form-field" style="margin-top: 6px;">
            <label class="admin-label">Image URL</label>
            <input type="url" class="admin-input stage-${s.toLowerCase()}-image" required value="${escHtml(stageData.image)}" placeholder="https://..." />
          </div>
          <div class="form-field" style="margin-top: 4px;">
            <label class="admin-label">Description</label>
            <input type="text" class="admin-input stage-${s.toLowerCase()}-desc" required value="${escHtml(stageData.desc)}" placeholder="Description of the stage..." />
          </div>
        </div>
      `;
    }).join('\n');

    card.innerHTML = `
      <button type="button" class="btn-delete-project" data-idx="${idx}" style="position: absolute; top: 16px; right: 16px; background: none; border: 1px solid var(--color-accent); color: var(--color-accent); font-weight: bold; font-size: 9px; padding: 4px 8px; letter-spacing:0.05em; cursor: pointer; transition: all 0.2s;">DELETE PROJECT</button>
      
      <h4 class="admin-eyebrow" style="color: #666; font-size:11px;">PROJECT #${idx + 1}</h4>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Title</label>
          <input type="text" class="admin-input p-title" required value="${escHtml(p.title)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Category</label>
          <input type="text" class="admin-input p-category" required value="${escHtml(p.category)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Role</label>
          <input type="text" class="admin-input p-role" required value="${escHtml(p.role)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Software (comma separated)</label>
          <input type="text" class="admin-input p-software" required value="${escHtml(p.software)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Year</label>
          <input type="text" class="admin-input p-year" required value="${escHtml(p.year)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Video URL (direct MP4 link)</label>
          <input type="url" class="admin-input p-video" required value="${escHtml(p.video)}" />
        </div>
        <div class="form-field" style="margin-top: 0;">
          <label class="admin-label">Poster/Thumbnail Image URL</label>
          <input type="url" class="admin-input p-image" required value="${escHtml(p.image)}" />
        </div>
      </div>
      
      <div class="form-field" style="margin-top: 0;">
        <label class="admin-label">Description</label>
        <textarea class="admin-input p-description" style="border: 1px solid var(--color-border2); padding: 8px; background: transparent; min-height: 80px;" required>${escHtml(p.description)}</textarea>
      </div>
      
      <details style="border-top: 1px solid #1c1c1c; padding-top: 12px; margin-top: 4px;">
        <summary style="font-size: 10px; font-weight: 700; color: #555; letter-spacing: 0.1em; cursor: pointer; user-select: none;">EDIT 6-STAGE VIDEO BREAKDOWN</summary>
        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 12px;">
          ${stagesHtml}
        </div>
      </details>
    `;

    container.appendChild(card);
  });
}

function saveLocalPreview() {
  const form = $('websiteEditorForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Construct new portfolio data object
  const updatedData = {
    nav: {
      logoText: $('editLogoText').value.trim()
    },
    hero: {
      eyebrow: $('editHeroEyebrow').value.trim(),
      headlineLines: $('editHeroHeadline').value.split(',').map(s => s.trim()).filter(Boolean),
      subtext: $('editHeroSubtext').value.trim(),
      showreelVideo: $('editHeroShowreel').value.trim(),
      showreelPoster: $('editHeroBgImage').value.trim() || (portfolioData.hero ? portfolioData.hero.showreelPoster : "public/images/projects/hero_workspace.jpg"),
      showreelDuration: $('editShowreelDuration').value.trim()
    },
    marquee: portfolioData.marquee || ["EDIT", "DESIGN", "STORYTELL", "COLOR", "SOUND", "MOTION"],
    about: {
      headingLines: $('editAboutHeading').value.split(',').map(s => s.trim()).filter(Boolean),
      portraitCaption: $('editPortraitCaption').value.trim(),
      portraitImage: $('editAboutPortraitImage').value.trim() || (portfolioData.about ? portfolioData.about.portraitImage : "public/images/profile/profile.jpg"),
      bioParagraph1: $('editBioParagraph1').value.trim(),
      bioParagraph2: $('editBioParagraph2').value.trim(),
      location: $('editAboutLocation').value.trim(),
      experience: $('editAboutExperience').value.trim(),
      specialties: $('editAboutSpecialties').value.trim()
    },
    services: portfolioData.services || [],
    toolkit: portfolioData.toolkit || {},
    process: portfolioData.process || [],
    experienceTimeline: portfolioData.experienceTimeline || [],
    contact: {
      email: $('editContactEmail').value.trim(),
      instagram: $('editInstagram').value.trim(),
      youtube: $('editYouTube').value.trim(),
      linkedin: $('editLinkedIn').value.trim(),
      vimeo: $('editVimeo').value.trim()
    },
    projects: serializeProjects()
  };

  try {
    localStorage.setItem('portfolio_data', JSON.stringify(updatedData));
    portfolioData = updatedData;
    toast('Preview updated successfully! Refresh your home page to see it.');
  } catch (e) {
    toast('Failed to save preview locally.', 'error');
  }
}

function serializeProjects() {
  const cards = $$('.project-editor-card');
  return cards.map((card, idx) => {
    const stages = ['raw', 'edit', 'color', 'motion', 'sound', 'final'];
    const breakdown = {};
    stages.forEach(s => {
      breakdown[s.toUpperCase()] = {
        image: card.querySelector(`.stage-${s}-image`).value.trim(),
        desc: card.querySelector(`.stage-${s}-desc`).value.trim()
      };
    });

    return {
      index: String(idx + 1).padStart(2, '0'),
      title: card.querySelector('.p-title').value.trim(),
      category: card.querySelector('.p-category').value.trim(),
      role: card.querySelector('.p-role').value.trim(),
      software: card.querySelector('.p-software').value.trim(),
      year: card.querySelector('.p-year').value.trim(),
      video: card.querySelector('.p-video').value.trim(),
      image: card.querySelector('.p-image').value.trim(),
      description: card.querySelector('.p-description').value.trim(),
      breakdown
    };
  });
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

  // ── Tabs Switching ─────────────────────────────────────────
  $('tabEnquiriesBtn').addEventListener('click', () => switchTab('enquiries'));
  $('tabEditWebsiteBtn').addEventListener('click', () => switchTab('edit'));

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

  // ── Save Form Submit ───────────────────────────────────────
  $('websiteEditorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveLocalPreview();
  });

  // ── Export JSON ────────────────────────────────────────────
  $('exportDataJsonBtn').addEventListener('click', exportConfigJson);

  // ── Init ───────────────────────────────────────────────────
  if (token) {
    showDashboard();
    loadEnquiries();
    loadCMSData();
  } else {
    showLogin();
  }

});
