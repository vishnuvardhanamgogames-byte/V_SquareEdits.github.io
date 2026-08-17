/**
 * FrameFlow — Admin Panel
 * admin.js
 *
 * Mirrors the React Admin.jsx behaviour:
 *  - Login form → stores token in localStorage as "ff_token"
 *  - Dashboard: load, refresh, logout, mark read/unread, delete
 *  - API calls go to process.env.REACT_APP_BACKEND_URL equivalent,
 *    configured via window.FF_API_URL (set in a <script> block or
 *    by editing the constant below).
 *
 * For local/static use the admin stores enquiries in localStorage
 * as a fallback when no backend URL is configured — useful for
 * demo and testing before connecting a real API.
 */

'use strict';

/* ── Config ──────────────────────────────────────────────────── */
// Set your backend URL here, or via a global before this script:
//   <script>window.FF_API_URL = "https://your-backend.com";</script>
const API_BASE = (window.FF_API_URL || '').replace(/\/$/, '');
const USE_LOCAL = !API_BASE; // fallback to localStorage when no API configured

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);

function toast(message, type = 'success') {
  const container = $('toastContainer');
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
let enquiries = null; // null = not loaded yet

/* ── SVG icons (inline, matching lucide shapes) ─────────────── */
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
   LOCAL STORAGE FALLBACK (demo / no-backend mode)
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
    // Seed some demo data if empty so the dashboard isn't blank
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
      {
        id: 'demo-2',
        name: 'Sam Rivera',
        email: 'sam@studio.io',
        project_type: 'Motion Graphics',
        message: 'We need animated lower thirds and a title sequence for a brand documentary. Roughly 8 minutes total.',
        read: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
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
    credentials: 'include', // send httpOnly cookie alongside Bearer token
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
   VIEWS
   ============================================================ */
function showLogin() {
  $('loginPage').hidden  = false;
  $('dashboard').hidden  = true;
}

function showDashboard() {
  $('loginPage').hidden  = true;
  $('dashboard').hidden  = false;
}

/* ── Update dashboard heading with unread count ─────────────── */
function updateHeading() {
  const unread = enquiries ? enquiries.filter((e) => !e.read).length : 0;
  $('dashTitle').innerHTML = unread > 0
    ? `PROJECT ENQUIRIES <span class="new-badge">(${unread} NEW)</span>`
    : 'PROJECT ENQUIRIES';
}

/* ── Render a single enquiry card ───────────────────────────── */
function renderCard(e) {
  const card = document.createElement('li');
  card.className = `enquiry-card${e.read ? '' : ' unread'}`;
  card.setAttribute('data-testid', `enquiry-${e.id}`);
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
        <button
          class="btn-card"
          data-action="toggle-read"
          data-testid="enquiry-read-${e.id}"
          aria-label="${e.read ? 'Mark as unread' : 'Mark as read'}"
          title="${e.read ? 'Mark as unread' : 'Mark as read'}"
        >
          ${e.read ? ICON.mail : ICON.mailOpen}
        </button>
        <button
          class="btn-card delete"
          data-action="delete"
          data-testid="enquiry-delete-${e.id}"
          aria-label="Delete enquiry"
          title="Delete"
        >
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

/* ── Render the full enquiry list ───────────────────────────── */
function renderList() {
  const container = $('enquiryList');
  container.innerHTML = '';

  if (enquiries === null) {
    container.innerHTML = '<p class="loading-state">Loading…</p>';
    return;
  }

  if (enquiries.length === 0) {
    container.innerHTML = '<p class="empty-state" data-testid="admin-empty">No enquiries yet — they\'ll appear here when someone uses the contact form.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.style.cssText = 'display:flex;flex-direction:column;gap:12px;list-style:none;padding:0;margin:0;';
  enquiries.forEach((e) => ul.appendChild(renderCard(e)));
  container.appendChild(ul);

  updateHeading();
}

/* ============================================================
   DATA ACTIONS
   ============================================================ */
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
   AUTH
   ============================================================ */
async function login(email, password) {
  const btn = $('loginBtn');
  const errEl = $('loginError');
  errEl.textContent = '';
  btn.textContent = 'SIGNING IN...';
  btn.disabled = true;

  // Local / demo mode: accept the configured credentials or any non-empty input
  if (USE_LOCAL) {
    await new Promise((r) => setTimeout(r, 500));
    // Accept the real admin credentials or any input in demo mode
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
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // send/receive httpOnly cookie
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // Exact error strings from server.py
      const detail = typeof body.detail === 'string' ? body.detail : 'Login failed.';
      throw new Error(detail);
    }
    const data = await res.json();
    token = data.access_token;
    localStorage.setItem('ff_token', token);
    showDashboard();
    loadEnquiries();
  } catch (err) {
    errEl.textContent = err.message || 'Login failed.';
  } finally {
    btn.textContent = 'SIGN IN';
    btn.disabled = false;
  }
}

function logout() {
  // Fire-and-forget logout endpoint
  if (!USE_LOCAL && token) {
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem('ff_token');
  token = '';
  enquiries = null;
  showLogin();
}

/* ============================================================
   CONTACT FORM BRIDGE
   Enquiries submitted on index.html are saved to localStorage
   under "ff_enquiries" so they show up in the admin panel
   (when running without a backend).
   ============================================================ */
function saveEnquiryLocally({ name, email, projectType, project_type, message }) {
  const list = LOCAL.load();
  list.unshift({
    id: 'local-' + Date.now(),
    name,
    email,
    project_type: project_type || projectType || 'Other',
    message,
    read: false,
    created_at: new Date().toISOString(),
  });
  LOCAL.save(list);
}

// Expose so index.html's form handler can call it
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

  // ── Refresh ────────────────────────────────────────────────
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

  // ── Init: show dashboard if already logged in ──────────────
  if (token) {
    showDashboard();
    loadEnquiries();
  } else {
    showLogin();
  }

});
