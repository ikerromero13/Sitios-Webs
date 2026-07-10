/* ============================================================
   Hanna Events & Decorations — interacciones principales
   Vanilla JS · sin dependencias
   ============================================================ */
(function () {
  "use strict";

  /* ---- 1. Cabecera con fondo al hacer scroll ---- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- 2. Menú móvil ---- */
  const toggle = document.querySelector(".nav__toggle");
  const closeMenu = () => document.body.classList.remove("menu-open");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  document.querySelectorAll(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---- 3. Reveal on scroll (IntersectionObserver) ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- 4. Marquee: duplicar contenido para bucle continuo ---- */
  const track = document.querySelector(".marquee__track");
  if (track) track.innerHTML += track.innerHTML;

  /* ---- 5. FAQ: cerrar los demás al abrir uno (acordeón) ---- */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach((other) => { if (other !== item) other.open = false; });
      }
    });
  });

  /* ---- 6. Año dinámico en el footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- 7. Navegación suave con compensación de cabecera ---- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ---- 8. Formulario de contacto (Formspree o fallback) ---- */
  const form = document.getElementById("contact-form");
  if (form) {
    const status = form.querySelector(".form__status");
    const dict = () => (window.HannaI18n ? null : null);
    form.addEventListener("submit", async (e) => {
      const endpoint = form.getAttribute("action");
      // Si aún no hay endpoint configurado, dejamos el envío nativo (o avisamos).
      if (!endpoint || endpoint.indexOf("TU_ENDPOINT") !== -1) {
        e.preventDefault();
        showStatus("err");
        console.warn("[Hanna] Configura el endpoint de Formspree en el atributo action del formulario.");
        return;
      }
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "…";
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (res.ok) {
          form.reset();
          showStatus("ok");
        } else {
          showStatus("err");
        }
      } catch (err) {
        showStatus("err");
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });

    function showStatus(type) {
      if (!status) return;
      const lang = document.documentElement.lang || "es";
      const messages = {
        ok:  { es: "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.",
               ca: "Gràcies! Hem rebut el teu missatge i et contactarem aviat.",
               en: "Thank you! We've received your message and will contact you soon." },
        err: { es: "Ups, algo ha fallado. Prueba de nuevo o escríbenos por WhatsApp.",
               ca: "Ups, alguna cosa ha fallat. Prova de nou o escriu-nos per WhatsApp.",
               en: "Oops, something went wrong. Try again or message us on WhatsApp." }
      };
      status.textContent = (messages[type][lang] || messages[type].es);
      status.className = "form__status " + (type === "ok" ? "is-ok" : "is-error");
    }
  }
})();
