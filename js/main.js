/**
 * FrameFlow — Alex Mercer Portfolio
 * main.js
 *
 * Features:
 *  1. Lenis smooth scroll (respects prefers-reduced-motion)
 *  2. Custom cursor — 8px solid circle, mix-blend-difference, expands on video/projects
 *  3. Smooth scroll for nav links
 *  4. Nav background opacity on scroll
 *  5. IntersectionObserver fade-in-up animations
 *  6. Process steps: hover/click to change active step + description
 *  7. Showreel play button: toggles "playing" state
 *  8. Sound button: toggles aria-pressed
 *  9. Form submission: prevent default + show confirmation
 * 10. Mobile nav drawer toggle
 * 11. Active nav link highlight based on scroll position
 */

'use strict';

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. LENIS SMOOTH SCROLL
   ============================================================ */
(function initLenis() {
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
})();


/* ============================================================
   1b. HERO PARALLAX + FADE ON SCROLL + MASK REVEAL TRIGGER
   ============================================================ */
(function initHero() {
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
})();

/* ============================================================
   2. CUSTOM CURSOR — matches CustomCursor.jsx
      - pointer: fine check (not hover: hover)
      - spring physics: stiffness 520, damping 42, mass 0.5
      - 12px default, 88px expanded
      - reads data-cursor attribute for label text
      - adds .custom-cursor-on to <html> for cursor:none
   ============================================================ */
(function initCursor() {
  const fine    = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Inject label span
  const label = document.createElement('span');
  label.className = 'cursor-label';
  label.setAttribute('aria-hidden', 'true');
  cursor.appendChild(label);

  // Add class to html so CSS sets cursor:none everywhere
  document.documentElement.classList.add('custom-cursor-on');

  // Spring state — approximate framer-motion spring(stiffness:520, damping:42, mass:0.5)
  // Critically-damped approximation: higher alpha = stiffer/faster
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
    // Spring integration (Euler)
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

  // Read data-cursor attribute on hovered element (matches React impl)
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
})();


/* ============================================================
   2 & 3. SMOOTH SCROLL + NAV OPACITY ON SCROLL
   ============================================================ */
(function initNav() {
  const nav         = $('#nav');
  const hamburger   = $('#navHamburger');
  const drawer      = $('#navDrawer');
  const drawerLinks = $$('.drawer-link');

  // -- Smooth scroll for all in-page anchor links --
  function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Use Lenis if available, otherwise native
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -(nav ? nav.getBoundingClientRect().height : 72) });
    } else {
      const navHeight = nav ? nav.getBoundingClientRect().height : 72;
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

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

    // Close mobile drawer if open
    closeDrawer();
  });

  // -- Nav background opacity on scroll --
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // -- Mobile hamburger --
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  // Close drawer when a link is clicked (handled in click delegation above)
  // Also close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
})();


/* ============================================================
/* ============================================================
   4. INTERSECTIONOBSERVER — REVEAL + MASKED HEADING ANIMATIONS
      Matches Framer Motion's FadeUp (opacity+y) and
      MaskedLines (clip from y:115%) from Reveal.jsx
   ============================================================ */
(function initReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('visible');

        // If heading has .line-inner children, trigger their mask reveal
        el.querySelectorAll('.line-inner').forEach((inner) => {
          inner.style.transform = 'translateY(0%)';
        });

        observer.unobserve(el);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px', // matches viewport: { margin: "-60px" }
    }
  );

  elements.forEach((el) => observer.observe(el));

  // Also observe section-label elements for FadeUp
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
})();


/* ============================================================
   4b. PROJECT MODAL — open/close + populate from portfolio data
   ============================================================ */
(function initProjectModal() {
  // Project data matching portfolio.js
  const projects = [
    {
      index: '01',
      title: 'Cinematic Trailer Edit',
      category: 'Editing / Color Grading / Sound Design',
      role: 'Editor / Colorist',
      software: 'Premiere Pro, DaVinci Resolve, Audition',
      year: '2026',
      description: 'A high-energy trailer cut built around rhythm and restraint — every beat mapped to the music, every transition earned. Graded for a cold, filmic finish with deep blacks and controlled highlights.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      breakdown: {
        RAW: {
          image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
          desc: 'Flat S-Log3 footage straight from the camera, preserving all shadow and highlight details for grading.'
        },
        EDIT: {
          image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80',
          desc: "Pacing edit matching high-impact cuts and narrative transitions to the trailer's sound design."
        },
        COLOR: {
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
          desc: 'A cold cinematic color grade with styled steel-blue midtones and clean, rolled highlights.'
        },
        MOTION: {
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          desc: 'Minimalist tracked titles and kinetic text overlays positioned in 3D space.'
        },
        SOUND: {
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
          desc: 'Sub-bass impacts, risers, and detailed ambient sound design built from raw foley libraries.'
        },
        FINAL: {
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          desc: 'The fully mastered 4K export, completed with theater-ready audio mixing and grading.'
        }
      }
    },
    {
      index: '02',
      title: 'Multifandom Cinematic Edit',
      category: 'Music Editing / Transitions / VFX',
      role: 'Editor / VFX',
      software: 'Premiere Pro, After Effects',
      year: '2026',
      description: 'A music-driven montage stitched from dozens of sources into one continuous visual flow — match cuts, velocity ramps and seamless masked transitions synced to the track.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      breakdown: {
        RAW: {
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
          desc: 'A mix of standard-definition and high-definition sources before aspect-ratio and resolution matching.'
        },
        EDIT: {
          image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80',
          desc: 'Stitching hundreds of clips using match cuts and visual speed ramps to form a continuous visual flow.'
        },
        COLOR: {
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
          desc: 'A vibrant, stylized color grade to bring various visual sources into a single coherent visual palette.'
        },
        MOTION: {
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          desc: 'Seamless invisible mask transitions and localized particle/light leak overlay effects.'
        },
        SOUND: {
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
          desc: 'Precision-synced audio beat mapping and vocal isolation/mixing from source tracks.'
        },
        FINAL: {
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          desc: 'The fully rendered high-frame-rate master with smooth motion-blurred transitions.'
        }
      }
    },
    {
      index: '03',
      title: 'Motion Graphics Advertisement',
      category: 'Editing / Motion Graphics / After Effects',
      role: 'Motion Designer / Editor',
      software: 'After Effects, Premiere Pro, Photoshop',
      year: '2025',
      description: 'A punchy 30-second product spot built entirely from animated typography, shape systems and rhythm — designed to land the message with the sound off.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      breakdown: {
        RAW: {
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
          desc: 'Initial vector layouts and raw storyboard graphics designed in Adobe Illustrator.'
        },
        EDIT: {
          image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80',
          desc: 'Pacing typography overlays and setting up keyframe timings for fluid kinetic animations.'
        },
        COLOR: {
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
          desc: 'Adjusting contrast and applying branding color LUTs for visual consistency across products.'
        },
        MOTION: {
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          desc: 'Custom 3D camera paths, vector morphing, and complex shape layer transitions in After Effects.'
        },
        SOUND: {
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
          desc: 'Synchronized cartoon sound effects, clicks, and a dynamic upbeat background music track.'
        },
        FINAL: {
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          desc: 'The compressed 1080p MP4 final deliverable optimized for web and social media ad placements.'
        }
      }
    },
    {
      index: '04',
      title: 'Social Media Campaign',
      category: 'Short-form Editing / Typography / Sound Design',
      role: 'Editor / Sound Designer',
      software: 'Premiere Pro, After Effects, Audition',
      year: '2025',
      description: 'A 12-piece short-form series engineered for retention — hooks inside the first second, burned-in kinetic captions and sound design that carries the scroll-stopping energy.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      breakdown: {
        RAW: {
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
          desc: 'Vertical smartphone clips and raw interview takes captured under varied lighting environments.'
        },
        EDIT: {
          image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80',
          desc: 'Aggressive hook-based pacing to optimize audience retention within the first three seconds.'
        },
        COLOR: {
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
          desc: 'High-contrast correction to make the subjects stand out on mobile screens and feeds.'
        },
        MOTION: {
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          desc: 'Bold, branded kinetic captions and pop-up vector elements for increased visual engagement.'
        },
        SOUND: {
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
          desc: 'Clean dialogue equalization, noise reduction, and ducked trending background audio tracks.'
        },
        FINAL: {
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
          desc: 'Vertical 9:16 final deliverable, optimized and formatted for social platform algorithms.'
        }
      }
    },
  ];

  const modal     = $('#projectModal');
  const backdrop  = $('#modalBackdrop');
  const closeBtn  = $('#modalClose');
  const modalVideo = $('#modalVideo');
  const tabs       = $$('.breakdown-tab');

  if (!modal) return;

  let currentProjectIdx = 0;

  function renderBreakdown(tab) {
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

  function openModal(idx) {
    const p = projects[idx];
    if (!p) return;

    currentProjectIdx = idx;

    // Populate fields
    const modalIdxTag = $('#modalIndexTag');
    if (modalIdxTag) modalIdxTag.textContent = 'PROJECT ' + p.index;
    $('#modalTitle').textContent       = p.title;
    $('#modalCategory').textContent    = p.category;
    $('#modalDescription').textContent = p.description;
    $('#modalRole').textContent        = p.role;
    $('#modalSoftware').textContent    = p.software;
    $('#modalYear').textContent        = p.year;

    if (modalVideo) {
      modalVideo.src = p.video;
      modalVideo.load();
    }

    // Reset tabs to RAW
    tabs.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === 'RAW');
    });
    renderBreakdown('RAW');

    modal.hidden    = false;
    backdrop.hidden = false;

    // Animate in next frame
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

    // Hide after transition
    setTimeout(() => {
      modal.hidden    = true;
      backdrop.hidden = true;
      document.body.style.overflow = '';
    }, 400);
  }

  // Wire up project rows
  $$('.project-row').forEach((row) => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.dataset.project, 10);
      openModal(idx);
    });
  });

  // Wire up breakdown tabs
  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      tabs.forEach((btn) => btn.classList.remove('active'));
      tabBtn.classList.add('active');
      const tabName = tabBtn.dataset.tab;
      renderBreakdown(tabName);
    });
  });

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Backdrop click to close
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();


/* ============================================================
   5. PROCESS STEPS — HOVER/CLICK TO CHANGE ACTIVE + DESCRIPTION
   ============================================================ */
(function initProcess() {
  const cards  = $$('.process-card');
  const descEl = $('#processDescText');

  if (!cards.length || !descEl) return;

  // step index → { title, description } — from portfolio.js data
  const steps = [
    { title: 'RAW FOOTAGE', description: 'Ingesting and logging every clip. Nothing gets lost, everything gets marked.' },
    { title: 'SELECTS',     description: 'Pulling the strongest moments — the takes with genuine energy.' },
    { title: 'ROUGH CUT',   description: 'Establishing structure, pacing and narrative flow.' },
    { title: 'FINE CUT',    description: 'Trimming to the frame. Rhythm becomes intention.' },
    { title: 'MOTION',      description: 'Adding typography, transitions and visual effects.' },
    { title: 'COLOR',       description: 'Creating consistency and developing the final visual mood.' },
    { title: 'SOUND',       description: 'Sound design, SFX and music mixed for impact.' },
    { title: 'FINAL',       description: 'Mastered, exported and delivered for every platform.' },
  ];

  function setActiveStep(index) {
    cards.forEach((card, i) => {
      const isActive = i === index;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Fade out → swap content → fade in
    descEl.classList.add('fade-out');
    setTimeout(() => {
      const { title, description } = steps[index] || steps[0];
      descEl.innerHTML = `<span class="process-desc-title">${title}</span>${description}`;
      descEl.classList.remove('fade-out');
    }, 220);
  }

  cards.forEach((card) => {
    const idx = parseInt(card.dataset.step, 10);
    // Both hover and click activate the step (matching React component)
    card.addEventListener('mouseenter', () => setActiveStep(idx));
    card.addEventListener('focus',      () => setActiveStep(idx));
    card.addEventListener('click',      () => setActiveStep(idx));
  });
})();


/* ============================================================
   6. SHOWREEL PLAYER — full ShowreelPlayer.jsx equivalent
      - Big play overlay
      - Pointer-drag seek with scrubber thumb
      - Arrow key seeking
      - Play/Pause icons swap
      - Mute/Unmute with Volume icons
      - Fullscreen
      - Error state
      - play-showreel custom event
   ============================================================ */
(function initShowreelPlayer() {
  const wrap       = $('#videoWrap');
  const video      = $('#showreelVideo');
  const bigPlay    = $('#videoBigPlay');
  const errorState = $('#videoError');
  const labelDot   = $('#videoLabelDot');
  const progressWrap = $('#videoProgress');
  const progressFill = $('#videoProgressFill');
  const thumb        = $('#videoThumb');
  const timeEl       = $('#videoTime');
  const toggleBtn    = $('#videoToggleBtn');
  const muteBtn      = $('#videoMuteBtn');
  const fsBtn        = $('#videoFullscreenBtn');
  const showreelBtn  = $('#showreelBtn');
  const workSection  = $('#work');

  if (!video || !wrap) return;

  // Icons
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

  // Hero button
  if (showreelBtn) {
    showreelBtn.addEventListener('click', () => {
      scrollToWork();
      setTimeout(() => window.dispatchEvent(new Event('play-showreel')), 900);
    });
  }

  // play-showreel event
  window.addEventListener('play-showreel', startVideo, { once: true });

  // Big play overlay + video click → toggle
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

  // Video events
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

  // Progress bar — pointer drag + click
  if (progressWrap) {
    progressWrap.addEventListener('pointerdown', (e) => {
      seeking = true;
      progressWrap.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    });
    progressWrap.addEventListener('pointermove', (e) => { if (seeking) seekTo(e.clientX); });
    progressWrap.addEventListener('pointerup',   () => { seeking = false; });

    // Arrow key seeking
    progressWrap.addEventListener('keydown', (e) => {
      if (!video.duration) return;
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
      if (e.key === 'ArrowLeft')  video.currentTime = Math.max(0, video.currentTime - 5);
      updateProgress();
    });
  }

  // Mute toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (iconVolOn)  iconVolOn.hidden  = video.muted;
      if (iconVolOff) iconVolOff.hidden = !video.muted;
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    });
  }

  // Toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      video.paused ? video.play().catch(() => {}) : video.pause();
    });
  }

  // Fullscreen
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else wrap.requestFullscreen?.();
    });
  }
})();


/* ============================================================
   7. COPY EMAIL BUTTON
   ============================================================ */
(function initCopyEmail() {
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
      // Fallback for browsers that block clipboard without HTTPS
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    // Swap icons and add copied state
    if (iconCopy)  iconCopy.hidden  = true;
    if (iconCheck) iconCheck.hidden = false;
    btn.classList.add('copied');

    // Toast
    showCopyToast();

    setTimeout(() => {
      if (iconCopy)  iconCopy.hidden  = false;
      if (iconCheck) iconCheck.hidden = true;
      btn.classList.remove('copied');
    }, 2000);
  });

  function showCopyToast() {
    // Reuse admin toast if available, otherwise create a simple one
    const container = document.getElementById('toastContainer');
    const target = container || document.body;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; bottom:24px; right:24px; z-index:9999;
      background:#1a1a1a; border:1px solid #2a2a2a;
      border-left:3px solid #22c55e;
      color:#F5F5F5; font-family:'Manrope',sans-serif;
      font-size:13px; font-weight:600; letter-spacing:0.04em;
      padding:14px 20px; min-width:220px;
      animation: toastSlide 0.3s cubic-bezier(0.22,1,0.36,1) both;
    `;
    el.textContent = 'Email copied to clipboard.';
    target.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
})();


/* ============================================================
   8. SOUND BUTTON TOGGLE
   ============================================================ */
(function initSound() {
  const soundBtn = $('#soundBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const isOn = soundBtn.getAttribute('aria-pressed') === 'true';
    soundBtn.setAttribute('aria-pressed', (!isOn).toString());

    // Update real video muted state
    const video = $('.showreel-video');
    if (video) {
      video.muted = isOn;
    }

    // Update label text (keeps icon, replaces text node)
    const textNode = [...soundBtn.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = isOn ? ' SOUND OFF' : ' SOUND ON';
    } else {
      soundBtn.lastChild.textContent = isOn ? ' SOUND OFF' : ' SOUND ON';
    }
  });
})();


/* ============================================================
   9. CONTACT FORM — PREVENT DEFAULT + SHOW CONFIRMATION
   ============================================================ */
(function initForm() {
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

    // Use real API when FF_API_URL is configured, otherwise save locally
    const apiBase = (window.FF_API_URL || '').replace(/\/$/, '');

    const apiCall = apiBase
      ? fetch(`${apiBase}/api/enquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); })
      : Promise.resolve();

    apiCall
      .catch(() => {}) // always fall through to local save
      .then(() => {
        // Always mirror to localStorage so admin panel sees it
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
})();


/* ============================================================
   9. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.querySelector('[data-testid="back-to-top-btn"]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();


/* ============================================================
   10. ACTIVE NAV LINK — HIGHLIGHT BASED ON SCROLL POSITION
   ============================================================ */
(function initActiveNavLink() {
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
})();
