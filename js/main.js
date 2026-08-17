/**
 * FrameFlow — Alex Mercer Portfolio
 * main.js
 *
 * Fully dynamic website loading data from data.json or localStorage (CMS mode)
 */

'use strict';

/* ── Global State ────────────────────────────────────────────── */
window.portfolioData = null;

// Fallback defaults to ensure site loads immediately even if data.json is missing
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
    },
    {
      "index": "02",
      "title": "Multifandom Cinematic Edit",
      "category": "Music Editing / Transitions / VFX",
      "role": "Editor / VFX",
      "software": "Premiere Pro, After Effects",
      "year": "2026",
      "description": "A music-driven montage stitched from dozens of sources into one continuous visual flow — match cuts, velocity ramps and seamless masked transitions synced to the track.",
      "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "image": "https://images.unsplash.com/photo-1695192721582-5660bca08424?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwyfHxtdXNpYyUyMHZpZGVvJTIwYWVzdGhldGljfGVufDB8fHx8MTc4NjYxMzY5Mnww&ixlib=rb-4.1.0&q=85",
      "breakdown": {
        "RAW": {
          "image": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
          "desc": "A mix of standard-definition and high-definition sources before aspect-ratio and resolution matching."
        },
        "EDIT": {
          "image": "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80",
          "desc": "Stitching hundreds of clips using match cuts and visual speed ramps to form a continuous visual flow."
        },
        "COLOR": {
          "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
          "desc": "A vibrant, stylized color grade to bring various visual sources into a single coherent visual palette."
        },
        "MOTION": {
          "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
          "desc": "Seamless invisible mask transitions and localized particle/light leak overlay effects."
        },
        "SOUND": {
          "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          "desc": "Precision-synced audio beat mapping and vocal isolation/mixing from source tracks."
        },
        "FINAL": {
          "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
          "desc": "The fully rendered high-frame-rate master with smooth motion-blurred transitions."
        }
      }
    },
    {
      "index": "03",
      "title": "Motion Graphics Advertisement",
      "category": "Editing / Motion Graphics / After Effects",
      "role": "Motion Designer / Editor",
      "software": "After Effects, Premiere Pro, Photoshop",
      "year": "2025",
      "description": "A punchy 30-second product spot built entirely from animated typography, shape systems and rhythm — designed to land the message with the sound off.",
      "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      "image": "https://images.unsplash.com/photo-1532170579297-281918c8ae72?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHw0fHxjaW5lbWF0aWMlMjBwb3J0cmFpdCUyMGRhcmslMjBtb29kfGVufDB8fHx8MTc4NjYxMzY5Mnww&ixlib=rb-4.1.0&q=85",
      "breakdown": {
        "RAW": {
          "image": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
          "desc": "Initial vector layouts and raw storyboard graphics designed in Adobe Illustrator."
        },
        "EDIT": {
          "image": "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80",
          "desc": "Pacing typography overlays and setting up keyframe timings for fluid kinetic animations."
        },
        "COLOR": {
          "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
          "desc": "Adjusting contrast and applying branding color LUTs for visual consistency across products."
        },
        "MOTION": {
          "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
          "desc": "Custom 3D camera paths, vector morphing, and complex shape layer transitions in After Effects."
        },
        "SOUND": {
          "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          "desc": "Synchronized cartoon sound effects, clicks, and a dynamic upbeat background music track."
        },
        "FINAL": {
          "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
          "desc": "The compressed 1080p MP4 final deliverable optimized for web and social media ad placements."
        }
      }
    },
    {
      "index": "04",
      "title": "Social Media Campaign",
      "category": "Short-form Editing / Typography / Sound Design",
      "role": "Editor / Sound Designer",
      "software": "Premiere Pro, After Effects, Audition",
      "year": "2025",
      "description": "A 12-piece short-form series engineered for retention — hooks inside the first second, burned-in kinetic captions and sound design that carries the scroll-stopping energy.",
      "video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      "image": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwZmlsbSUyMGNvbG9yJTIwZ3JhZGluZ3xlbnwwfHx8fDE3ODY2MTM2Nzh8MA&ixlib=rb-4.1.0&q=85",
      "breakdown": {
        "RAW": {
          "image": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
          "desc": "Vertical smartphone clips and raw interview takes captured under varied lighting environments."
        },
        "EDIT": {
          "image": "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80",
          "desc": "Aggressive hook-based pacing to optimize audience retention within the first three seconds."
        },
        "COLOR": {
          "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
          "desc": "High-contrast correction to make the subjects stand out on mobile screens and feeds."
        },
        "MOTION": {
          "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
          "desc": "Bold, branded kinetic captions and pop-up vector elements for increased visual engagement."
        },
        "SOUND": {
          "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
          "desc": "Clean dialogue equalization, noise reduction, and ducked trending background audio tracks."
        },
        "FINAL": {
          "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
          "desc": "Vertical 9:16 final deliverable, optimized and formatted for social platform algorithms."
        }
      }
    }
  ]
};

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   DATA LOADING & POPULATING
   ============================================================ */
async function initPortfolioData() {
  // 1. Try LocalStorage for preview edits
  try {
    const local = localStorage.getItem('portfolio_data');
    if (local) {
      window.portfolioData = JSON.parse(local);
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }

  // 2. Try Fetch data.json
  if (!window.portfolioData) {
    try {
      const res = await fetch('data.json');
      if (res.ok) {
        window.portfolioData = await res.json();
      }
    } catch (e) {
      console.warn('data.json not found, using defaults', e);
    }
  }

  // 3. Fallback to hardcoded defaults
  if (!window.portfolioData) {
    window.portfolioData = DEFAULT_PORTFOLIO_DATA;
  }

  // Apply configs to static text elements in HTML
  applyNavData(window.portfolioData.nav);
  applyHeroData(window.portfolioData.hero);
  applyMarqueeData(window.portfolioData.marquee);
  applyAboutData(window.portfolioData.about);
  applyServicesData(window.portfolioData.services);
  applyToolkitData(window.portfolioData.toolkit);
  applyExperienceData(window.portfolioData.experienceTimeline);
  applyContactData(window.portfolioData.contact);
  
  // Render projects
  renderProjects(window.portfolioData.projects);
}

function applyNavData(nav) {
  if (!nav) return;
  const logo = document.getElementById('nav-logo');
  if (logo) logo.innerHTML = `${escapeHtml(nav.logoText)}<span style="color: var(--color-accent);">.</span>`;
  
  // Dynamically update browser tab title
  document.title = `${nav.logoText} — Video Editor & Motion Designer`;
}

function applyHeroData(hero) {
  if (!hero) return;
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    eyebrow.innerHTML = `<span class="hero-eyebrow-dot" aria-hidden="true"></span>${escapeHtml(hero.eyebrow)}`;
  }
  
  const headline = document.getElementById('hero-headline');
  if (headline) {
    headline.innerHTML = hero.headlineLines.map((line, idx) => {
      const delay = 0.25 + idx * 0.13;
      const isAccent = idx === hero.headlineLines.length - 1;
      return `<span class="hero-line${isAccent ? ' accent-line' : ''}"><span class="hero-line-inner" style="--delay:${delay}s">${escapeHtml(line)}</span></span>`;
    }).join('\n');
    headline.setAttribute('aria-label', hero.headlineLines.join(' '));
  }
  
  const subtext = document.getElementById('hero-subtext');
  if (subtext) subtext.textContent = hero.subtext;
  
  const video = document.getElementById('showreelVideo');
  if (video) {
    video.src = hero.showreelVideo;
    if (hero.showreelPoster) video.poster = hero.showreelPoster;
  }
  
  const duration = document.getElementById('showreel-duration');
  if (duration) duration.textContent = hero.showreelDuration;
}

function applyMarqueeData(marquee) {
  if (!marquee || !marquee.length) return;
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  
  const itemsHtml = marquee.map((word, idx) => {
    const isOutline = idx % 2 === 1;
    return `<span class="marquee-item"><span class="marquee-word${isOutline ? ' marquee-outline' : ''}">${escapeHtml(word)}</span><span class="marquee-sep">•</span></span>`;
  }).join('');
  
  track.innerHTML = itemsHtml + itemsHtml; // duplicate for seamless loop
}

function applyAboutData(about) {
  if (!about) return;
  const heading = document.getElementById('about-heading');
  if (heading) {
    heading.innerHTML = about.headingLines.map((line, idx) => {
      const delay = idx * 0.13;
      return `<span class="line"><span class="line-inner" style="--line-delay:${delay}s">${escapeHtml(line)}</span></span>`;
    }).join('\n');
  }
  
  const img = document.getElementById('about-image');
  if (img) {
    img.src = about.portraitImage;
    img.alt = `Portrait of ${about.portraitCaption.split(' — ')[0]}`;
  }

  const heroAvatarImg = document.getElementById('heroAvatarImg');
  if (heroAvatarImg) {
    heroAvatarImg.src = about.portraitImage;
    heroAvatarImg.alt = `Portrait of ${about.portraitCaption.split(' — ')[0]}`;
  }
  
  const caption = document.getElementById('about-portrait-caption');
  if (caption) caption.textContent = about.portraitCaption;
  
  const bio1 = document.getElementById('about-bio-1');
  if (bio1) bio1.textContent = about.bioParagraph1;
  
  const bio2 = document.getElementById('about-bio-2');
  if (bio2) bio2.textContent = about.bioParagraph2;
  
  const location = document.getElementById('about-location');
  if (location) location.textContent = about.location;
  
  const experience = document.getElementById('about-experience');
  if (experience) experience.textContent = about.experience;
  
  const specialties = document.getElementById('about-specialties');
  if (specialties) specialties.textContent = about.specialties;
}

function applyServicesData(services) {
  if (!services || !services.length) return;
  const list = document.getElementById('services-list');
  if (!list) return;
  
  list.innerHTML = services.map((s, idx) => {
    const delay = idx * 0.05;
    const itemsHtml = s.items.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
    return `
      <div class="service-row reveal" style="--reveal-delay:${delay}s" data-testid="service-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
        <span class="service-row-number">${s.num || String(idx + 1).padStart(2, '0')}</span>
        <h3 class="service-row-title">${escapeHtml(s.title)}</h3>
        <ul class="service-row-items" role="list">
          ${itemsHtml}
        </ul>
      </div>
    `;
  }).join('\n');
}

function applyToolkitData(toolkit) {
  if (!toolkit) return;
  const grid = document.getElementById('software-grid');
  if (!grid) return;
  
  const categories = [
    { key: 'editing', label: 'EDITING', testId: 'software-editing' },
    { key: 'motion', label: 'MOTION', testId: 'software-motion' },
    { key: 'design', label: 'DESIGN', testId: 'software-design' },
    { key: 'threeD', label: '3D', testId: 'software-3d' },
    { key: 'audio', label: 'AUDIO', testId: 'software-audio' }
  ];
  
  grid.innerHTML = categories.map(cat => {
    const tools = toolkit[cat.key] || [];
    const toolsHtml = tools.map(t => `<li>${escapeHtml(t)}</li>`).join('\n');
    return `
      <div class="software-card" data-testid="${cat.testId}">
        <span class="software-cat">${cat.label}</span>
        <ul class="software-tools">
          ${toolsHtml}
        </ul>
      </div>
    `;
  }).join('\n');
}

function applyExperienceData(timeline) {
  if (!timeline || !timeline.length) return;
  const container = document.getElementById('experience-timeline');
  if (!container) return;
  
  container.innerHTML = timeline.map((item, idx) => {
    const delay = idx * 0.06;
    return `
      <div class="timeline-item reveal" style="--reveal-delay:${delay}s">
        <div class="timeline-year">${escapeHtml(item.year)}</div>
        <div class="timeline-role-wrap">
          <h3 class="timeline-role">${escapeHtml(item.role)}</h3>
          <p class="timeline-place">${escapeHtml(item.place)}</p>
        </div>
        <p class="timeline-desc">${escapeHtml(item.desc)}</p>
      </div>
    `;
  }).join('\n');
}

function applyContactData(contact) {
  if (!contact) return;
  
  const emailText = document.getElementById('contact-email');
  if (emailText) emailText.textContent = contact.email;
  
  const socials = ['instagram', 'youtube', 'linkedin', 'vimeo'];
  socials.forEach(s => {
    const url = contact[s];
    if (!url) return;
    
    const link = document.getElementById(`social-${s}`);
    if (link) link.href = url;
    
    const footLink = document.getElementById(`footer-social-${s}`);
    if (footLink) footLink.href = url;
  });
  
  // Footer Brand Name / Titles
  const footerName = document.getElementById('footer-name');
  if (footerName) {
    const name = window.portfolioData.nav ? window.portfolioData.nav.logoText : 'ALEX MERCER';
    footerName.innerHTML = `&copy; ${new Date().getFullYear()} ${escapeHtml(name)}`;
  }
  
  const footerTitle = document.getElementById('footer-title');
  if (footerTitle) {
    const title = window.portfolioData.hero ? window.portfolioData.hero.eyebrow.split(' — ')[1] || window.portfolioData.hero.eyebrow : 'VIDEO EDITOR / MOTION DESIGNER';
    footerTitle.textContent = title;
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-list');
  if (!container) return;
  container.innerHTML = '';
  
  projects.forEach((p, idx) => {
    const btn = document.createElement('button');
    btn.className = 'project-row reveal';
    btn.setAttribute('data-testid', `project-card-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
    btn.setAttribute('data-cursor', 'VIEW');
    btn.setAttribute('data-project', idx);
    btn.setAttribute('aria-label', `View project: ${p.title}`);
    btn.style.setProperty('--reveal-delay', `${idx * 0.05}s`);
    
    btn.innerHTML = `
      <span class="project-row-index">${p.index || String(idx + 1).padStart(2, '0')}</span>

      <div class="project-row-image-wrap">
        <div class="project-row-image-inner">
          <img
            src="${p.image || ''}"
            alt="${p.title}"
            loading="lazy"
            class="project-row-img"
          />
        </div>
        <span class="project-row-redline" aria-hidden="true"></span>
      </div>

      <div class="project-row-info">
        <h3 class="project-row-title">${escapeHtml(p.title)}</h3>
        <p class="project-row-category">${escapeHtml(p.category)}</p>
      </div>

      <div class="project-row-meta">
        <span class="project-row-year">${escapeHtml(p.year)}</span>
        <svg class="project-row-arrow" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
      </div>
    `;
    container.appendChild(btn);
  });
}

/* ============================================================
   1. LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function startLenis() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
  }

  startLenis();
}

/* ============================================================
   1b. HERO PARALLAX + FADE ON SCROLL + MASK REVEAL TRIGGER
   ============================================================ */
function initHero() {
  const heroBg      = document.getElementById('heroBg');
  const heroContent = document.getElementById('heroContent');
  const hero        = document.getElementById('top');

  // Trigger mask reveal on next frame
  requestAnimationFrame(() => {
    $$('.hero-line-inner').forEach((el) => el.classList.add('run'));
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    if (!hero) return;
    const heroH   = hero.offsetHeight;
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / heroH, 1);

    // Parallax: bg moves at 22% of scroll distance
    if (heroBg) {
      heroBg.style.transform = `translateY(${progress * 22}%)`;
    }

    // Fade: content opacity 1→0 over first 75% of hero height
    if (heroContent) {
      const fadeProgress = Math.min(scrollY / (heroH * 0.75), 1);
      heroContent.style.opacity = String(1 - fadeProgress);
    }
  }, { passive: true });
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const fine    = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Clean old label if re-running
  const oldLabel = cursor.querySelector('.cursor-label');
  if (oldLabel) oldLabel.remove();

  const label = document.createElement('span');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');
  cursor.appendChild(label);

  document.documentElement.classList.add('custom-cursor-on');

  let mouseX = -100, mouseY = -100;
  let curX   = -100, curY   = -100;
  let velX   = 0,    velY   = 0;

  const stiffness = 520, damping = 42, mass = 0.5;
  const dt = 1 / 60;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  (function loop() {
    const ax = (-stiffness * (curX - mouseX) - damping * velX) / mass;
    const ay = (-stiffness * (curY - mouseY) - damping * velY) / mass;
    velX += ax * dt;
    velY += ay * dt;
    curX += velX * dt;
    curY += velY * dt;

    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest?.('[data-cursor]');
    const cursorLabel = target ? target.getAttribute('data-cursor') : null;

    if (cursorLabel) {
      cursor.classList.add('is-hovering');
      label.textContent = cursorLabel;
    } else if (e.target.closest('a, button, [role="tab"], input, select, textarea, .process-card, .service-card')) {
      cursor.classList.add('is-hovering');
      label.textContent = '';
    } else {
      cursor.classList.remove('is-hovering');
      label.textContent = '';
    }
  });
}

/* ============================================================
   2 & 3. SMOOTH SCROLL + NAV OPACITY ON SCROLL
   ============================================================ */
function initNav() {
  const nav         = $('#nav');
  const hamburger   = $('#navHamburger');
  const drawer      = $('#navDrawer');

  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -(nav ? nav.getBoundingClientRect().height : 72) });
    } else {
      const navHeight = nav ? nav.getBoundingClientRect().height : 72;
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  // Use event delegation for all hash links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const targetId = hash.slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(targetId);
    closeDrawer();
  });

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    // Clear old listeners by cloning
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    newHamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

/* ============================================================
   4. INTERSECTIONOBSERVER — REVEAL + MASKED HEADING ANIMATIONS
   ============================================================ */
function initReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        el.querySelectorAll('.line-inner').forEach((inner) => {
          inner.style.transform = 'translateY(0%)';
        });

        observer.unobserve(el);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));

  $$('.section-label').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(44px)';
    el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';

    const labelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          labelObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    labelObserver.observe(el);
  });
}

/* ============================================================
   4b. PROJECT MODAL
   ============================================================ */
function initProjectModal() {
  const modal     = $('#projectModal');
  const backdrop  = $('#modalBackdrop');
  const closeBtn  = $('#modalClose');
  const modalVideo = $('#modalVideo');
  const tabs       = $$('.breakdown-tab');

  if (!modal) return;

  let currentProjectIdx = 0;

  function renderBreakdown(tab) {
    const projects = window.portfolioData.projects;
    const p = projects[currentProjectIdx];
    const data = p && p.breakdown ? p.breakdown[tab] : null;
    const mediaCol = $('#modalBreakdownMedia');
    const descCol = $('#modalBreakdownDesc');
    if (!data || !mediaCol || !descCol) return;

    mediaCol.innerHTML = `
      <div class="breakdown-image-wrap">
        <img src="${data.image}" alt="${tab} stage" class="breakdown-image" />
        <span class="breakdown-stage-label">${tab}</span>
      </div>
    `;
    descCol.textContent = data.desc;
  }

function getEmbedUrl(url) {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }
  return '';
}

  function openModal(idx) {
    const projects = window.portfolioData.projects;
    const p = projects[idx];
    if (!p) return;

    currentProjectIdx = idx;

    const modalIdxTag = $('#modalIndexTag');
    if (modalIdxTag) modalIdxTag.textContent = 'PROJECT ' + (p.index || String(idx + 1).padStart(2, '0'));
    $('#modalTitle').textContent       = p.title;
    $('#modalCategory').textContent    = p.category;
    $('#modalDescription').textContent = p.description;
    $('#modalRole').textContent        = p.role;
    $('#modalSoftware').textContent    = p.software;
    $('#modalYear').textContent        = p.year;

    const embedVideo = $('#modalEmbedVideo');
    if (modalVideo && embedVideo) {
      const embedUrl = getEmbedUrl(p.video);
      if (embedUrl) {
        modalVideo.style.display = 'none';
        modalVideo.src = '';
        
        embedVideo.style.display = 'block';
        embedVideo.src = embedUrl;
      } else {
        embedVideo.style.display = 'none';
        embedVideo.src = '';
        
        modalVideo.style.display = 'block';
        modalVideo.src = p.video;
        modalVideo.load();
      }
    } else if (modalVideo) {
      modalVideo.src = p.video;
      modalVideo.load();
    }

    tabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === 'RAW');
    });
    renderBreakdown('RAW');

    modal.hidden    = false;
    backdrop.hidden = false;

    requestAnimationFrame(() => {
      modal.classList.add('open');
      backdrop.classList.add('open');
    });

    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    backdrop.classList.remove('open');

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }

    const embedVideo = $('#modalEmbedVideo');
    if (embedVideo) {
      embedVideo.src = '';
    }

    setTimeout(() => {
      modal.hidden    = true;
      backdrop.hidden = true;
      document.body.style.overflow = '';
    }, 400);
  }

  // Use event delegation for project rows click so dynamic load works
  document.addEventListener('click', (e) => {
    const row = e.target.closest('.project-row');
    if (row) {
      const idx = parseInt(row.dataset.project, 10);
      openModal(idx);
    }
  });

  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      tabs.forEach((btn) => btn.classList.remove('active'));
      tabBtn.classList.add('active');
      const tabName = tabBtn.dataset.tab;
      renderBreakdown(tabName);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ============================================================
   5. PROCESS STEPS
   ============================================================ */
function initProcess() {
  const cards  = $$('.process-card');
  const descEl = $('#processDescText');

  if (!cards.length || !descEl) return;

  const steps = window.portfolioData.process;

  function setActiveStep(index) {
    cards.forEach((card, i) => {
      const isActive = i === index;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    descEl.classList.add('fade-out');
    setTimeout(() => {
      const { title, description } = steps[index] || steps[0];
      descEl.innerHTML = `<span class="process-desc-title">${escapeHtml(title)}</span>${escapeHtml(description)}`;
      descEl.classList.remove('fade-out');
    }, 220);
  }

  // Clear and update title text for steps based on config
  cards.forEach((card, i) => {
    const stepData = steps[i];
    if (stepData) {
      const titleSpan = card.querySelector('.process-card-title');
      if (titleSpan) titleSpan.textContent = stepData.title;
    }
  });

  cards.forEach((card) => {
    const idx = parseInt(card.dataset.step, 10);
    card.addEventListener('mouseenter', () => setActiveStep(idx));
    card.addEventListener('focus',      () => setActiveStep(idx));
    card.addEventListener('click',      () => setActiveStep(idx));
  });
}

/* ============================================================
   6. SHOWREEL PLAYER
   ============================================================ */
function initShowreelPlayer() {
  const wrap       = $('#videoWrap');
  const video      = $('#showreelVideo');
  const bigPlay    = $('#videoBigPlay');
  const errorState = $('#videoError');
  const labelDot   = $('#videoLabelDot');
  const progressWrap = $('#videoProgress');
  const progressFill = $('#videoProgressFill');
  const timeEl       = $('#videoTime');
  const toggleBtn    = $('#videoToggleBtn');
  const muteBtn      = $('#videoMuteBtn');
  const fsBtn        = $('#videoFullscreenBtn');
  const showreelBtn  = $('#showreelBtn');
  const workSection  = $('#work');

  if (!video || !wrap) return;

  const iconPlay  = toggleBtn?.querySelector('.icon-play');
  const iconPause = toggleBtn?.querySelector('.icon-pause');
  const iconVolOn  = muteBtn?.querySelector('.icon-vol-on');
  const iconVolOff = muteBtn?.querySelector('.icon-vol-off');

  let seeking = false;

  function fmt(s) {
    if (!s || !isFinite(s)) return '00:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  function setPlaying(p) {
    wrap.classList.toggle('is-playing', p);
    if (iconPlay)  iconPlay.hidden  = p;
    if (iconPause) iconPause.hidden = !p;
    if (labelDot)  labelDot.hidden  = !p;
    if (toggleBtn) toggleBtn.setAttribute('aria-label', p ? 'Pause' : 'Play');
  }

  function updateProgress() {
    if (!video.duration || seeking) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressWrap) progressWrap.setAttribute('aria-valuenow', Math.round(pct));
    if (timeEl) {
      timeEl.innerHTML = `${fmt(video.currentTime)} <span class="video-time-total">/ ${fmt(video.duration)}</span>`;
    }
  }

  function seekTo(clientX) {
    if (!progressWrap || !video.duration) return;
    const rect  = progressWrap.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    updateProgress();
  }

  function scrollToWork() {
    if (!workSection) return;
    const nav  = $('#nav');
    const navH = nav ? nav.getBoundingClientRect().height : 72;
    if (window.__lenis) {
      window.__lenis.scrollTo(workSection, { offset: -navH });
    } else {
      window.scrollTo({ top: workSection.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  }

  function startVideo() {
    video.muted = false;
    video.play().catch(() => {});
  }

  if (showreelBtn) {
    showreelBtn.addEventListener('click', () => {
      scrollToWork();
      setTimeout(() => window.dispatchEvent(new Event('play-showreel')), 900);
    });
  }

  window.addEventListener('play-showreel', startVideo, { once: true });

  [bigPlay, video].forEach((el) => {
    if (el) el.addEventListener('click', () => {
      if (video.paused) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  });

  video.addEventListener('play',    () => setPlaying(true));
  video.addEventListener('pause',   () => setPlaying(false));
  video.addEventListener('ended',   () => setPlaying(false));
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', () => {
    if (timeEl) timeEl.innerHTML = `00:00 <span class="video-time-total">/ ${fmt(video.duration)}</span>`;
  });
  video.addEventListener('error', () => {
    if (errorState) errorState.hidden = false;
    if (bigPlay)    bigPlay.hidden    = true;
  });

  if (progressWrap) {
    progressWrap.addEventListener('pointerdown', (e) => {
      seeking = true;
      progressWrap.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    });
    progressWrap.addEventListener('pointermove', (e) => { if (seeking) seekTo(e.clientX); });
    progressWrap.addEventListener('pointerup',   () => { seeking = false; });

    progressWrap.addEventListener('keydown', (e) => {
      if (!video.duration) return;
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
      if (e.key === 'ArrowLeft')  video.currentTime = Math.max(0, video.currentTime - 5);
      updateProgress();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (iconVolOn)  iconVolOn.hidden  = video.muted;
      if (iconVolOff) iconVolOff.hidden = !video.muted;
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      video.paused ? video.play().catch(() => {}) : video.pause();
    });
  }

  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else wrap.requestFullscreen?.();
    });
  }
}

/* ============================================================
   7. COPY EMAIL BUTTON
   ============================================================ */
function initCopyEmail() {
  const btn       = document.getElementById('copyEmailBtn');
  const iconCopy  = btn ? btn.querySelector('.icon-copy')  : null;
  const iconCheck = btn ? btn.querySelector('.icon-check') : null;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const email = btn.querySelector('.email-text')?.textContent?.trim();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    if (iconCopy)  iconCopy.hidden  = true;
    if (iconCheck) iconCheck.hidden = false;
    btn.classList.add('copied');

    showCopyToast();

    setTimeout(() => {
      if (iconCopy)  iconCopy.hidden  = false;
      if (iconCheck) iconCheck.hidden = true;
      btn.classList.remove('copied');
    }, 2000);
  });

  function showCopyToast() {
    const container = document.getElementById('toastContainer');
    const target = container || document.body;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:24px; right:24px; z-index:9999;
      background:#1a1a1a; border:1px solid #2a2a2a;
      border-left:3px solid #FF3B30;
      color:#F5F5F5; font-family:'Manrope',sans-serif;
      font-size:13px; font-weight:600; letter-spacing:0.04em;
      padding:14px 20px; min-width:220px;
      animation: toastSlide 0.3s cubic-bezier(0.22,1,0.36,1) both;
    `;
    el.textContent = 'Email copied to clipboard.';
    target.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

/* ============================================================
   8. SOUND BUTTON TOGGLE
   ============================================================ */
function initSound() {
  const soundBtn = $('#soundBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isOn = soundBtn.getAttribute('aria-pressed') === 'true';
    soundBtn.setAttribute('aria-pressed', (!isOn).toString());

    const video = $('.showreel-video');
    if (video) {
      video.muted = isOn;
    }

    const textNode = [...soundBtn.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = isOn ? ' SOUND OFF' : ' SOUND ON';
    } else {
      soundBtn.lastChild.textContent = isOn ? ' SOUND OFF' : ' SOUND ON';
    }
  });
}

/* ============================================================
   9. CONTACT FORM
   ============================================================ */
function initForm() {
  const form       = $('#contactForm');
  const successMsg = $('#formSuccess');
  const submitBtn  = form ? form.querySelector('.btn-contact-submit') : null;
  const submitText = submitBtn ? submitBtn.querySelector('.btn-submit-text') : null;

  if (!form || !successMsg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (submitText) submitText.textContent = 'SENDING…';
    if (submitBtn)  submitBtn.disabled = true;

    const payload = {
      name:         form.querySelector('#contact-name')?.value  || '',
      email:        form.querySelector('#contact-email')?.value || '',
      project_type: form.querySelector('#contact-type')?.value  || 'Other',
      message:      form.querySelector('#contact-message')?.value || '',
    };

    const apiBase = (window.FF_API_URL || '').replace(/\/$/, '');

    const apiCall = apiBase
      ? fetch(`${apiBase}/api/enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); })
      : Promise.resolve();

    apiCall
      .catch(() => {}) 
      .then(() => {
        if (typeof window.FF_saveEnquiry === 'function') {
          window.FF_saveEnquiry(payload);
        } else {
          try {
            const list = JSON.parse(localStorage.getItem('ff_enquiries') || '[]');
            list.unshift({
              id: 'local-' + Date.now(),
              ...payload,
              read: false,
              created_at: new Date().toISOString(),
            });
            localStorage.setItem('ff_enquiries', JSON.stringify(list));
          } catch (_) {}
        }

        successMsg.classList.add('visible');
        form.reset();
        if (submitText) submitText.textContent = 'START A PROJECT';
        if (submitBtn)  submitBtn.disabled = false;
        setTimeout(() => successMsg.classList.remove('visible'), 5000);
      });
  });
}

/* ============================================================
   9b. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.querySelector('[data-testid="back-to-top-btn"]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ============================================================
   10. ACTIVE NAV LINK
   ============================================================ */
function initActiveNavLink() {
  const navLinks = $$('.nav-link');
  const sections = navLinks
    .map((link) => {
      const hash = link.getAttribute('href');
      const id   = hash ? hash.slice(1) : null;
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id   = entry.target.id;
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + id;
            link.style.opacity = isActive ? '1' : '';
            link.style.color   = isActive ? 'var(--color-accent)' : '';
          });
        }
      });
    },
    {
      threshold: 0.35,
    }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ============================================================
   10b. PROFILE MOUSE PARALLAX
   ============================================================ */
function initProfileParallax() {
  const wrapper = document.getElementById('heroAvatarWrapper');
  const img = document.getElementById('heroAvatarImg');
  if (!wrapper || !img) return;

  // Tap/click toggles colorful/grayscale modes (supports touch & cursor devices)
  wrapper.addEventListener('click', () => {
    img.classList.toggle('colorful');
  });

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  let request = null;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const moveX = (x / (rect.width / 2)) * 3.5;
    const moveY = (y / (rect.height / 2)) * 3.5;

    if (request) cancelAnimationFrame(request);
    request = requestAnimationFrame(() => {
      img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.03)`;
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    if (request) cancelAnimationFrame(request);
    request = requestAnimationFrame(() => {
      img.style.transform = 'translate(0px, 0px) scale(1)';
    });
  });
}

/* ============================================================
   INIT MASTER CONTROL ON DOM LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  // Load dynamic data first
  await initPortfolioData();

  // Initialize Lenis scroll first
  initLenis();

  // Initialize other visual components
  initHero();
  initCursor();
  initNav();
  initReveal();
  initProjectModal();
  initProcess();
  initShowreelPlayer();
  initCopyEmail();
  initSound();
  initForm();
  initBackToTop();
  initActiveNavLink();
  initProfileParallax();
});
