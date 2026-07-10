/* =========================================================
   Clinicum Dental — JS mínimo, sin dependencias
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Menú de navegación móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      navToggle.setAttribute('aria-label', open ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
      primaryNav.classList.toggle('is-open', !open);
    });

    // Cerrar al pulsar un enlace (en móvil)
    primaryNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        primaryNav.classList.remove('is-open');
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  /* ---------- Acordeón FAQ accesible ---------- */
  var triggers = document.querySelectorAll('.faq-trigger');
  Array.prototype.forEach.call(triggers, function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) { panel.hidden = expanded; }
    });
  });

  /* ---------- Validación del formulario de presupuesto ---------- */
  var form = document.getElementById('quoteForm');
  var status = document.getElementById('formStatus');

  function showError(field, show) {
    var msg = document.querySelector('[data-error-for="' + field.id + '"]');
    if (msg) { msg.hidden = !show; }
    field.setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validPhone(value) {
    return value.replace(/\D/g, '').length >= 9;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var first = null;

      var nombre = form.nombre, email = form.email, telefono = form.telefono, privacidad = form.privacidad;

      var checks = [
        [nombre, nombre.value.trim().length >= 2],
        [email, validEmail(email.value.trim())],
        [telefono, validPhone(telefono.value.trim())],
        [privacidad, privacidad.checked]
      ];

      checks.forEach(function (pair) {
        var field = pair[0], isValid = pair[1];
        showError(field, !isValid);
        if (!isValid) { ok = false; if (!first) { first = field; } }
      });

      if (!ok) {
        status.textContent = 'Revisa los campos marcados para continuar.';
        status.className = 'form-status is-error';
        if (first) { first.focus(); }
        return;
      }

      // Demo: sin backend. Aquí se integraría el envío real (fetch a la API).
      status.textContent = '¡Gracias! Hemos recibido tus datos y te enviaremos tu presupuesto en breve.';
      status.className = 'form-status is-ok';
      form.reset();
    });

    // Limpiar el error de un campo al corregirlo
    form.addEventListener('input', function (e) {
      var t = e.target;
      if (t.matches('input, select')) { showError(t, false); }
    });
  }

  /* ---------- Año dinámico en el pie ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

  /* ---------- Animación de aparición (respeta prefers-reduced-motion) ---------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.section, .trust, .final-cta');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  }
})();
