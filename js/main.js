/* ============================================================
   Kelvo — interactions
   ============================================================ */
(function () {
  "use strict";

  /* --------------------------------------------------------
     LOADER — reveal home page, slide up after a beat
     -------------------------------------------------------- */
  const loader = document.getElementById("loader");
  const WEBHOOK =
    "https://hook.eu2.make.com/5ekq5f5jfvx41e30d3y6famhmcqhxv9q";

  function hideLoader() {
    document.body.classList.remove("is-loading");
    if (loader) {
      loader.classList.add("is-done");
      loader.addEventListener(
        "transitionend",
        () => loader.remove(),
        { once: true }
      );
    }
  }

  document.body.classList.add("is-loading");
  // Show "kelvo" briefly, then slide up. Account for fonts loading.
  const started = performance.now();
  const minShow = 1400; // ms the word stays visible
  const finish = () => {
    const elapsed = performance.now() - started;
    setTimeout(hideLoader, Math.max(0, minShow - elapsed));
  };
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish, { once: true });

  // Failsafe: never trap the user behind a stuck loader
  setTimeout(hideLoader, 4000);

  /* --------------------------------------------------------
     NAV — scrolled state + mobile menu
     -------------------------------------------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* --------------------------------------------------------
     REVEAL on scroll
     -------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            // slight stagger for grouped items
            setTimeout(() => e.target.classList.add("is-in"), (i % 4) * 70);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* --------------------------------------------------------
     LOGO TICKER
     Drop image files in /assets/logos/ and list them here.
     The list is duplicated once for a seamless loop.
     -------------------------------------------------------- */
  const LOGOS = [
    { src: "assets/logos/northpeak.svg", alt: "Northpeak" },
    { src: "assets/logos/lumina.svg", alt: "Lumina" },
    { src: "assets/logos/vertex.svg", alt: "Vertex" },
    { src: "assets/logos/halcyon.svg", alt: "Halcyon" },
    { src: "assets/logos/meridian.svg", alt: "Meridian" },
    { src: "assets/logos/cobalt.svg", alt: "Cobalt" },
  ];

  const track = document.getElementById("tickerTrack");
  if (track) {
    const buildItem = (logo) => {
      const img = document.createElement("img");
      img.src = logo.src;
      img.alt = logo.alt;
      img.className = "ticker__logo";
      img.loading = "lazy";
      // Graceful fallback if a logo file is missing: show the wordmark
      img.addEventListener("error", () => {
        const span = document.createElement("span");
        span.className = "ticker__name";
        span.textContent = logo.alt;
        img.replaceWith(span);
      });
      return img;
    };

    const fragment = document.createDocumentFragment();
    // two passes for seamless infinite scroll
    for (let pass = 0; pass < 2; pass++) {
      LOGOS.forEach((logo) => fragment.appendChild(buildItem(logo)));
    }
    track.appendChild(fragment);
  }

  /* --------------------------------------------------------
     STATS — count up when scrolled into view
     -------------------------------------------------------- */
  const statEls = document.querySelectorAll(".stat__number");
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateStat = (el) => {
    const target = parseFloat(el.dataset.target || "0");
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = parseFloat(el.dataset.duration || "1500");

    // "stays still" — no count-up, just show the final value
    if (!duration || duration <= 0) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const value = Math.round(target * easeOut(p));
      el.textContent = prefix + value + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && statEls.length) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateStat(e.target);
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach((el) => sio.observe(el));
  } else {
    statEls.forEach((el) => (el.textContent = (el.dataset.prefix || "") + el.dataset.target + (el.dataset.suffix || "")));
  }

  /* --------------------------------------------------------
     FORM — "we don't have a website" toggle + JSON to webhook
     -------------------------------------------------------- */
  const form = document.getElementById("inquireForm");
  const noSite = document.getElementById("noSite");
  const website = document.getElementById("website");

  if (noSite && website) {
    const sync = () => {
      const off = noSite.checked;
      website.disabled = off;
      if (off) {
        website.dataset.prev = website.value;
        website.value = "";
      } else if (website.dataset.prev != null) {
        website.value = website.dataset.prev;
      }
    };
    noSite.addEventListener("change", sync);
    sync();
  }

  const getSelect = (name) => {
    const el = form.querySelector(`select[name="${name}"]`);
    return el ? el.value.trim() : "";
  };

  // "Other" → reveal a text input to specify
  function wireOtherReveal() {
    form.querySelectorAll("select[data-reveal-other]").forEach((sel) => {
      const target = form.querySelector("#" + sel.dataset.revealOther);
      if (!target) return;
      const sync = () => {
        const isOther = sel.value === "Other";
        target.hidden = !isOther;
        if (!isOther) target.value = "";
      };
      sel.addEventListener("change", sync);
      sync();
    });
  }

  // combine a select value with its "Other" specification
  const withOther = (value, otherId) => {
    if (value !== "Other") return value;
    const spec = (form.querySelector("#" + otherId)?.value || "").trim();
    return spec ? `Other — ${spec}` : "Other";
  };

  if (form) {
    wireOtherReveal();

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const note = document.getElementById("formNote");
      const btn = document.getElementById("submitBtn");
      note.className = "form__note";
      note.textContent = "";

      // basic validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        industry: form.industry.value.trim(),
        website: noSite && noSite.checked ? "No website yet" : form.website.value.trim(),
        lookingFor: withOther(getSelect("lookingFor"), "otherLooking"),
        goal: withOther(getSelect("goal"), "otherGoal"),
        budget: getSelect("budget"),
        timeline: getSelect("timeline"),
        details: form.details.value.trim(),
        submittedAt: new Date().toISOString(),
      };

      btn.disabled = true;
      btn.textContent = "Sending…";
      note.textContent = "Sending your inquiry…";

      try {
        await fetch(WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "no-cors",
        });
        // no-cors yields an opaque response; assume success on resolve.
        form.hidden = true;
        const conf = document.getElementById("confirmation");
        conf.hidden = false;
        conf.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (err) {
        note.className = "form__note is-error";
        note.textContent =
          "Something went wrong sending your inquiry. Please try again or email us directly.";
        btn.disabled = false;
        btn.textContent = "Send inquiry";
      }
    });
  }

  const resetBtn = document.getElementById("resetForm");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      document.getElementById("confirmation").hidden = true;
      document.getElementById("formNote").textContent = "";
      // re-sync the "Other" reveals after reset
      form.querySelectorAll("select[data-reveal-other]").forEach((sel) =>
        sel.dispatchEvent(new Event("change"))
      );
    });
  }
})();
