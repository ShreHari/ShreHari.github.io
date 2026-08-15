/* ============================================================
   SHRE HARI PREM ANANDH — portfolio interactions
   Vanilla JS only. Every block is independent: delete any block
   and the rest keeps working.
   ============================================================ */

(function () {
  "use strict";

  /* localStorage can throw (blocked cookies / private mode) — never let it
     abort the whole IIFE. */
  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* no-op */ }
  }

  /* Reduced-motion: tracked live so an OS-setting flip mid-session is honoured. */
  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = rmQuery.matches;
  if (rmQuery.addEventListener) {
    rmQuery.addEventListener("change", function (e) {
      prefersReducedMotion = e.matches;
      if (e.matches) {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      }
    });
  }

  /* ---------- 1. THEME (lab lights) ---------- */
  /* The theme attribute lives on <html> — set pre-paint by the inline head
     script — so the stylesheet's [data-theme] selectors match immediately. */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stateLabel = document.getElementById("themeState");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (stateLabel) stateLabel.textContent = theme === "dark" ? "OFF" : "ON";
    if (toggle) toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    lsSet("shp-theme", theme);
  }

  const savedTheme = lsGet("shp-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemDark ? "dark" : "paper"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "paper" : "dark");
    });
  }

  /* ---------- 1b. TICKER LOOP ---------- */
  /* The CSS animation translates to -50%, which assumes the track content
     appears twice. Duplicate it once here (the wrapper is aria-hidden). */
  const tickerTrack = document.getElementById("tickerTrack");
  if (tickerTrack) tickerTrack.innerHTML += tickerTrack.innerHTML;

  /* ---------- 2. READING PROGRESS ---------- */
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 3. SCROLL REVEALS ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 4. STAT COUNTERS ---------- */
  const counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- 5. ACTIVE NAV SECTION ---------- */
  const navLinks = document.querySelectorAll(".topnav a[data-section]");
  if (navLinks.length && "IntersectionObserver" in window) {
    const sectionMap = {};
    navLinks.forEach(function (link) {
      const section = document.getElementById(link.dataset.section);
      if (section) sectionMap[link.dataset.section] = link;
    });
    const navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const link = sectionMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -55% 0px" });
    Object.keys(sectionMap).forEach(function (id) {
      navObserver.observe(document.getElementById(id));
    });
  }

  /* ---------- 6. EYEBROW DECODE EFFECT ---------- */
  const decodeLine = document.getElementById("decodeLine");
  if (decodeLine && !prefersReducedMotion) {
    const finalText = decodeLine.textContent;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>";
    let frameCount = 0;
    const totalFrames = 34;
    function scramble() {
      frameCount++;
      const progress = frameCount / totalFrames;
      decodeLine.textContent = finalText
        .split("")
        .map(function (ch, i) {
          if (ch === " " || ch === "·" || ch === ",") return ch;
          if (i / finalText.length < progress) return ch;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");
      if (frameCount < totalFrames) requestAnimationFrame(scramble);
      else decodeLine.textContent = finalText;
    }
    requestAnimationFrame(scramble);
  }

  /* ---------- 7. NEURAL CANVAS (hero background) ---------- */
  const canvas = document.getElementById("neuralCanvas");
  if (canvas && !prefersReducedMotion && window.innerWidth > 760) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width, height, nodes;
    const NODE_COUNT = 55;
    const LINK_DIST = 130;
    const mouse = { x: -9999, y: -9999 };
    let running = true;

    function inkColor() {
      return getComputedStyle(document.body).getPropertyValue("--ink-faint").trim() || "#8a8172";
    }
    function accentColor() {
      return getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#bf3b0b";
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.6
        });
      }
    }

    function step() {
      if (!running || prefersReducedMotion) return;
      ctx.clearRect(0, 0, width, height);
      const ink = inkColor();
      const accent = accentColor();

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // gentle pull toward cursor
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180 && dm > 0.001) {
          n.x += (dxm / dm) * 0.18;
          n.y += (dym / dm) * 0.18;
        }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            ctx.globalAlpha = (1 - d / LINK_DIST) * 0.5;
            ctx.strokeStyle = ink;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dm = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        ctx.fillStyle = dm < 120 ? accent : ink;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    seed();
    requestAnimationFrame(step);

    window.addEventListener("resize", function () { resize(); seed(); });
    canvas.parentElement.addEventListener("mousemove", function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener("mouseleave", function () {
      mouse.x = -9999; mouse.y = -9999;
    });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(step);
    });
  }

  /* ---------- 8. BIBTEX COPY ---------- */
  const copyBtn = document.getElementById("copyBibtex");
  const bibtex = document.getElementById("bibtexBlock");
  const copyStatus = document.getElementById("copyStatus");
  if (copyBtn && bibtex) {
    const idleLabel = copyBtn.textContent;
    function flash(label, announce) {
      copyBtn.textContent = label;
      if (copyStatus && announce) copyStatus.textContent = announce;
      setTimeout(function () {
        copyBtn.textContent = idleLabel;
        if (copyStatus) copyStatus.textContent = "";
      }, 1600);
    }
    function fallbackCopy() {
      // Clipboard API unavailable/refused: select the text so ⌘C works.
      const range = document.createRange();
      range.selectNodeContents(bibtex);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      flash("PRESS ⌘C / CTRL+C", "BibTeX selected — press Ctrl or Cmd C to copy");
    }
    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(bibtex.textContent)
          .then(function () { flash("COPIED ✓", "BibTeX copied to clipboard"); })
          .catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  /* ---------- 9. FOOTER FLOURISHES ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const reviewerEl = document.getElementById("reviewerNo");
  if (reviewerEl) {
    // every visitor becomes the next "reviewer" — stored locally, purely playful
    const n = parseInt(lsGet("shp-reviewer") || "1", 10) + 1;
    lsSet("shp-reviewer", String(n));
    reviewerEl.textContent = String(n);
  }

  /* ---------- 10. CONSOLE EASTER EGG ---------- */
  console.log(
    "%c§ PEER REVIEW INVITED §%c\n\nYou opened the console — that's exactly the energy this portfolio is hiring for.\nFound a bug? Tell me: shrehari66@gmail.com\n\n— Anandh, S.H.P. (2026)",
    "font-family: Georgia, serif; font-size: 16px; font-style: italic; color: #bf3b0b;",
    "font-family: monospace; font-size: 12px; color: #8a8172;"
  );
})();
