/* COELBO — web privada: JS mínimo, sin dependencias */
(function () {
  'use strict';

  /* Menú móvil */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* Año dinámico */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
