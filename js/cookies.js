/* ============================================================
   Banner de consentimiento de cookies — funcional
   Guarda la preferencia en localStorage. RGPD/LSSI básico.
   Para activar analítica (p. ej. Google Analytics), coloca tu
   código dentro de loadAnalytics() y se cargará SOLO si el
   usuario acepta.
   ============================================================ */
(function () {
  "use strict";
  const KEY = "hanna_cookie_consent"; // valores: "all" | "essential"
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  function loadAnalytics() {
    // ---------------------------------------------------------
    // [COMPLETAR] Coloca aquí tu script de analítica/marketing.
    // Solo se ejecuta si el usuario ACEPTA todas las cookies.
    // Ejemplo (Google Analytics 4):
    //   const s = document.createElement('script');
    //   s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    //   s.async = true; document.head.appendChild(s);
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date()); gtag('config', 'G-XXXXXXX');
    // ---------------------------------------------------------
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    hide();
    if (value === "all") loadAnalytics();
  }

  function hide() { banner.classList.remove("is-visible"); banner.setAttribute("aria-hidden", "true"); }
  function show() { banner.classList.add("is-visible"); banner.setAttribute("aria-hidden", "false"); }

  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  if (stored === "all") { loadAnalytics(); }
  else if (stored === "essential") { /* nada */ }
  else { setTimeout(show, 900); }

  banner.querySelector("[data-cookie='accept']").addEventListener("click", () => save("all"));
  banner.querySelector("[data-cookie='reject']").addEventListener("click", () => save("essential"));

  // Permite reabrir preferencias desde enlaces con [data-cookie-open]
  document.querySelectorAll("[data-cookie-open]").forEach((el) => {
    el.addEventListener("click", (e) => { e.preventDefault(); show(); });
  });
})();
