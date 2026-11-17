/* Luztech IT Solutions — site behaviour
   ==================================================================
   EDIT YOUR BUSINESS DETAILS HERE. Every page reads them from here.
   Leave a value as "" to hide it (e.g. no Instagram yet).
   ================================================================== */
const LUZTECH = {
  // WhatsApp number: international format, digits only. 082 123 4567 -> "27821234567"
  whatsapp: "27787760198",
  // Phone number for calls, written the way people should see it
  phone: "078 776 0198",
  email: "gordon@luztech.co.za",
  // Where Luztech is based
  area: "Kelvin, Sandton, 2090",
  // Working hours, e.g. "Mon–Fri 8:00–17:00, Sat 8:00–13:00"
  hours: "Mon–Sun, 6am–6pm",
  // Links (leave "" to hide)
  googleReviews: "",   // Google Business Profile review link
  facebook: "",
  instagram: ""
};

(function () {
  const waUrl = (msg) =>
    "https://wa.me/" + LUZTECH.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");

  /* ---- Fill in business details ---- */
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = LUZTECH[el.dataset.cfg];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-cfg-href]").forEach((el) => {
    const key = el.dataset.cfgHref;
    const v = LUZTECH[key];
    if (!v) return;
    if (String(v).startsWith("[")) return;
    if (key === "phone") el.href = "tel:" + v.replace(/[^\d+]/g, "");
    else if (key === "email") el.href = "mailto:" + v;
    else { el.href = v; el.target = "_blank"; el.rel = "noopener"; }
  });
  document.querySelectorAll("[data-cfg-optional]").forEach((el) => {
    if (!LUZTECH[el.dataset.cfgOptional]) el.hidden = true;
  });

  /* ---- WhatsApp links with their own pre-filled message ---- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waUrl(a.getAttribute("data-wa") || "Hi Luztech, I'd like some help with my IT.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---- Count WhatsApp clicks in Google Analytics (if installed) ---- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="https://wa.me/"]');
    if (a && typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", { page_path: location.pathname, link_text: a.textContent.trim().slice(0, 60) });
    }
  });

  /* ---- Mobile menu ---- */
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
    });
  }

  /* ---- Home: pick what you need, get a pre-filled WhatsApp ---- */
  const picker = document.querySelector("[data-picker]");
  if (picker) {
    const go = picker.querySelector("[data-picker-go]");
    const note = picker.querySelector("[data-picker-note]");
    const update = () => {
      const picked = [...picker.querySelectorAll('.chip[aria-pressed="true"]')].map((c) => c.dataset.need);
      let msg;
      if (picked.length === 0) {
        msg = "Hi Luztech, I'd like a quote. Here's what I need help with: ";
        note.textContent = "Pick one or more, or just tap the button.";
      } else {
        msg = "Hi Luztech, I'd like a quote for: " + picked.join(", ") + ".\nMy area: ";
        note.textContent = picked.length + " selected. Your message is ready to send.";
      }
      go.href = waUrl(msg);
    };
    picker.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chip.setAttribute("aria-pressed", chip.getAttribute("aria-pressed") === "true" ? "false" : "true");
        update();
      });
    });
    update();
  }

  /* ---- Home: soft light that follows the pointer ---- */
  const hero = document.querySelector(".hero");
  const scene = document.querySelector(".scene");
  if (hero && scene) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const set = (clientX, clientY) => {
      const h = hero.getBoundingClientRect();
      hero.style.setProperty("--x", ((clientX - h.left) / h.width) * 100 + "%");
      hero.style.setProperty("--y", ((clientY - h.top) / h.height) * 100 + "%");
      const s = scene.getBoundingClientRect();
      scene.style.setProperty("--sx", ((clientX - s.left) / s.width) * 100 + "%");
      scene.style.setProperty("--sy", ((clientY - s.top) / s.height) * 100 + "%");
    };
    if (!reduce) {
      let raf = 0, moved = false, t = 0;
      if (finePointer) {
        hero.addEventListener("pointermove", (e) => {
          moved = true;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => set(e.clientX, e.clientY));
        });
      }
      const sweep = () => {
        if (moved) return;
        t += 0.006;
        const s = scene.getBoundingClientRect();
        set(s.left + s.width * (0.5 + 0.34 * Math.cos(t)), s.top + s.height * (0.5 + 0.28 * Math.sin(t * 1.7)));
        requestAnimationFrame(sweep);
      };
      requestAnimationFrame(sweep);
    }
  }

  /* ---- Contact: build the WhatsApp message from the form ---- */
  const form = document.querySelector("[data-quote-form]");
  if (form) {
    const out = document.querySelector("[data-preview]");
    const send = document.querySelector("[data-send]");
    const val = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
    const build = () => {
      const lines = ["Hi Luztech, I'd like a quote."];
      if (val("name")) lines.push("Name: " + val("name"));
      if (val("type")) lines.push("For: " + val("type"));
      if (val("service")) lines.push("Service: " + val("service"));
      if (val("area")) lines.push("Area: " + val("area"));
      if (val("details")) lines.push("", val("details"));
      const msg = lines.join("\n");
      out.textContent = msg;
      send.href = waUrl(msg);
    };
    try {
      const pre = new URLSearchParams(location.search).get("service");
      if (pre && form.elements.service) form.elements.service.value = pre;
    } catch (e) {}
    form.addEventListener("input", build);
    form.addEventListener("change", build);
    form.addEventListener("submit", (e) => { e.preventDefault(); send.click(); });
    build();
  }

  /* ---- Camera quote helper ---- */
  const wiz = document.querySelector("[data-wizard]");
  if (wiz) {
    const steps = [...wiz.querySelectorAll(".step")];
    const back = wiz.querySelector("[data-back]");
    const next = wiz.querySelector("[data-next]");
    const send = wiz.querySelector("[data-wizard-send]");
    const bar = wiz.querySelector(".progress-bar span");
    const txt = wiz.querySelector(".progress-text");
    const err = wiz.querySelector(".wizard-error");
    const summary = wiz.querySelector("[data-summary]");
    let i = 0;

    const answers = () => {
      const get = (name) => [...wiz.querySelectorAll(`[name="${name}"]:checked`)].map((x) => x.value);
      const field = (name) => (wiz.querySelector(`[name="${name}"]`) || {}).value?.trim() || "";
      return {
        Property: get("place").join(""),
        Cameras: get("count").join(""),
        "Must-haves": get("needs").join(", ") || "Not sure yet",
        "Current system": get("existing").join(""),
        Name: field("w-name"),
        Area: field("w-area"),
        "Best time to visit": field("w-time"),
        Notes: field("w-notes")
      };
    };
    const message = (a) => {
      const lines = ["Hi Luztech, I'd like a quote for security cameras."];
      Object.entries(a).forEach(([k, v]) => { if (v) lines.push(k + ": " + v); });
      return lines.join("\n");
    };
    const valid = () => {
      const step = steps[i];
      const req = step.dataset.required;
      if (!req) return true;
      return !!step.querySelector(`[name="${req}"]:checked`);
    };
    const show = (initial) => {
      steps.forEach((s, n) => (s.hidden = n !== i));
      back.disabled = i === 0;
      const last = i === steps.length - 1;
      next.hidden = last;
      send.hidden = !last;
      bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      txt.textContent = "Step " + (i + 1) + " of " + steps.length;
      err.hidden = true;
      if (last) {
        const a = answers();
        summary.innerHTML = "";
        Object.entries(a).forEach(([k, v]) => {
          if (!v) return;
          const d = document.createElement("div");
          const dt = document.createElement("dt"); dt.textContent = k;
          const dd = document.createElement("dd"); dd.textContent = v;
          d.append(dt, dd); summary.append(d);
        });
        send.href = waUrl(message(a));
      }
      if (initial) return;
      const focusTarget = steps[i].querySelector("legend");
      if (focusTarget) { focusTarget.setAttribute("tabindex", "-1"); focusTarget.focus({ preventScroll: true }); }
      if (wiz.getBoundingClientRect().top < 0) wiz.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    next.addEventListener("click", () => {
      if (!valid()) { err.hidden = false; return; }
      i = Math.min(i + 1, steps.length - 1); show();
    });
    back.addEventListener("click", () => { i = Math.max(i - 1, 0); show(); });
    wiz.addEventListener("change", () => { err.hidden = true; });
    show(true);
  }

  /* ---- Reading progress line under the header ---- */
  const line = document.querySelector(".progress-line");
  if (line) {
    const upd = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      line.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ---- Motion ---- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // header tightens after scrolling a little
  const head = document.querySelector(".site-head");
  if (head) {
    const onScroll = () => head.classList.toggle("scrolled", scrollY > 20);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // big headlines: split into words that rise in one by one
  document.querySelectorAll(".page-hero h1, .svc-hero h1").forEach((h) => {
    if (h.children.length) return;
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(" ");
    h.classList.add("rise-words");
  });

  // fade things up as they scroll into view, a little staggered
  const groups = [
    ".section-head", ".tiles > .tile", ".r-steps > li", ".dl-cards > .dl-card", ".steps > li", ".points > div",
    ".work-grid > .job", ".reviews > .review", ".client-feature", ".about-strip > *", ".ticks > li", ".prices", ".price-note",
    ".faq > details", ".related > a", ".who > div", ".facts > div", ".etym > div", ".story-body > *",
    ".contact-grid > *", ".cta-band .wrap > *", ".unsure", ".wizard", ".two-col > div:first-child",
    ".svc-hero .photo", ".story-side .photo", ".cam-gallery > figure", ".section-foot", ".diff > div:first-child"
  ];
  const targets = new Set();
  groups.forEach((sel) => document.querySelectorAll(sel).forEach((el) => targets.add(el)));
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => targets.has(c));
      const idx = Math.max(0, sibs.indexOf(el));
      el.style.setProperty("--d", Math.min(idx, 5) * 0.09 + "s");
      el.classList.add("reveal");
      io.observe(el);
    });
  } else {
    targets.forEach((el) => el.classList.add("in"));
  }

  // WhatsApp button: a small nudge after a few seconds, then every 25s
  const fab = document.querySelector(".wa-fab");
  if (fab && !reduceMotion) {
    const nudge = () => { fab.classList.remove("nudge"); void fab.offsetWidth; fab.classList.add("nudge"); };
    setTimeout(nudge, 4000);
    setInterval(nudge, 25000);
  }

  /* ---- Home page photo frames ---- */
  const collage = document.querySelector("[data-collage]");
  if (collage) {
    const frames = [...collage.querySelectorAll(".slides")];
    const DUR = 6000;
    frames.forEach((fr) => {
      fr.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => img.remove()));
    });
    if (!reduceMotion) {
      frames.forEach((fr, n) => {
        fr.style.setProperty("--dur", DUR / 1000 + "s");
        let i = 0, paused = false;
        const pans = ["pan-l", "pan-r"];
        const show = () => {
          const imgs = [...fr.querySelectorAll("img")];
          if (imgs.length < 2) return;
          imgs.forEach((im) => im.classList.remove("on", "pan-l", "pan-r"));
          const cur = imgs[i % imgs.length];
          cur.classList.add("on", pans[(i + n) % 2]);
          const label = fr.querySelector(".chip-label");
          const txt = label && label.querySelector("span");
          if (txt && cur.dataset.label && txt.textContent !== cur.dataset.label) {
            label.classList.add("swap");
            setTimeout(() => { txt.textContent = cur.dataset.label; label.classList.remove("swap"); }, 380);
          }
          fr.classList.remove("tick"); void fr.offsetWidth; fr.classList.add("tick");
        };
        fr.addEventListener("mouseenter", () => (paused = true));
        fr.addEventListener("mouseleave", () => (paused = false));
        // start after the intro animation, each frame a little after the last
        setTimeout(() => {
          show();
          setInterval(() => { if (!paused && !document.hidden) { i++; show(); } }, DUR);
        }, 2200 + n * 1700);
      });
      // depth: frames float a little with the mouse
      const heroEl = document.querySelector(".hero");
      if (heroEl && window.matchMedia("(pointer: fine)").matches) {
        let raf = 0;
        heroEl.addEventListener("pointermove", (e) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const r = collage.getBoundingClientRect();
            collage.style.setProperty("--mx", ((e.clientX - (r.left + r.width / 2)) / r.width).toFixed(3));
            collage.style.setProperty("--my", ((e.clientY - (r.top + r.height / 2)) / r.height).toFixed(3));
          });
        });
        heroEl.addEventListener("pointerleave", () => { collage.style.setProperty("--mx", 0); collage.style.setProperty("--my", 0); });
      }
    }
  }

  /* ---- Gordon's portrait drifts gently while scrolling ---- */
  const portrait = document.querySelector(".about-strip > .photo img");
  if (portrait && !reduceMotion) {
    const drift = () => {
      const r = portrait.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;  // -1..1
      if (portrait.parentElement.classList.contains("in")) portrait.style.transform = `scale(1.08) translateY(${(p * -4).toFixed(2)}%)`;
    };
    addEventListener("scroll", () => requestAnimationFrame(drift), { passive: true });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
