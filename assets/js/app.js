/* FríoTrack — interactividad de la landing page.
   Requiere assets/js/i18n.js (window.FT) cargado antes. */
(function () {
  'use strict';

  /* ---------- Configuración editable ---------- */
  // Precios referenciales en soles (PEN). Anual = 10 meses (2 meses gratis).
  var PLANS = { basic: 79, pro: 199 };
  // Cuando exista un backend, coloca aquí la URL a la que se enviará el formulario de contacto.
  var CONTACT_ENDPOINT = (window.FT_CONFIG || {}).contactEndpoint || null;

  var FT = window.FT;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. Menú móvil ---------- */
  var burger = $('hamburgerBtn');
  var menu = $('mobileMenu');

  var header = $('siteHeader');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    if (header) header.classList.toggle('menu-open', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', FT.t(open ? 'menu_close' : 'menu_open'));
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('ft:lang', function () {
    burger.setAttribute('aria-label', FT.t(menu.classList.contains('open') ? 'menu_close' : 'menu_open'));
  });

  /* ---------- 2. Entry points to the Vue application ---------- */
  var appBase = (window.FT_CONFIG || {}).frontendBaseUrl || 'http://127.0.0.1:5173/';
  function openApplication(mode, role) {
    var url = new URL(appBase, window.location.href);
    url.hash = '/' + mode + '?role=' + encodeURIComponent(role || 'coordinator') + '&lang=' + FT.lang;
    window.location.assign(url.href);
  }
  $('btnLogin').addEventListener('click', function () { openApplication('login'); });
  $('btnRegister').addEventListener('click', function () { openApplication('register'); });
  document.querySelectorAll('.action-register').forEach(function (button) {
    button.addEventListener('click', function () { openApplication('register', button.dataset.role); });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });

  /* ---------- 3. Teléfonos: solo dígitos y "+" inicial ---------- */
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    });
  });

  /* ---------- 4. Pestañas "Para quién" ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });

  /* ---------- 5. Corredores ---------- */
  var routeBtns = document.querySelectorAll('.corridor-btn');
  var routePaths = document.querySelectorAll('.route');
  var nodes = document.querySelectorAll('.node');
  var dot = $('truckDot');
  var motion = $('truckMotion');
  var mpath = $('truckPath');
  var currentRoute = 'lib';

  function selectRoute(r) {
    currentRoute = r;
    routeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.route === r)); });
    routePaths.forEach(function (p) { p.classList.toggle('active', p.id === 'route-' + r); });
    nodes.forEach(function (n) { n.classList.toggle('active', n.dataset.route === r); });
    $('corridorGoods').textContent = FT.t('c_' + r + '_goods');
    if (!reduceMotion && motion && motion.beginElement) {
      mpath.setAttribute('href', '#route-' + r);
      dot.setAttribute('opacity', '1');
      motion.beginElement();
    }
  }
  routeBtns.forEach(function (b) { b.addEventListener('click', function () { selectRoute(b.dataset.route); }); });
  nodes.forEach(function (n) { n.addEventListener('click', function () { selectRoute(n.dataset.route); }); });
  document.addEventListener('ft:lang', function () { $('corridorGoods').textContent = FT.t('c_' + currentRoute + '_goods'); });
  selectRoute(currentRoute);

  /* ---------- 6. Planes: mensual / anual ---------- */
  var annual = false;
  var bMonthly = $('billMonthly');
  var bAnnual = $('billAnnual');

  function renderPricing() {
    bMonthly.setAttribute('aria-pressed', String(!annual));
    bAnnual.setAttribute('aria-pressed', String(annual));
    Object.keys(PLANS).forEach(function (key) {
      var card = document.querySelector('.plan[data-plan="' + key + '"]');
      var amount = annual ? PLANS[key] * 10 : PLANS[key];
      card.querySelector('[data-price]').textContent = 'S/ ' + FT.num(amount, 0);
      card.querySelector('[data-price-unit]').textContent = FT.t(annual ? 'per_year' : 'per_month');
    });
  }
  bMonthly.addEventListener('click', function () { annual = false; renderPricing(); });
  bAnnual.addEventListener('click', function () { annual = true; renderPricing(); });
  document.addEventListener('ft:lang', renderPricing);
  renderPricing();

  /* ---------- 7. Formulario de contacto ---------- */
  var form = $('contactForm');
  var success = $('contactSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    $('contactError').hidden = true;
    form.classList.add('was-validated');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = v; });

    var done = function () {
      var title = success.querySelector('[data-contact-title]');
      title.setAttribute('data-i18n', CONTACT_ENDPOINT ? 'f_ok_title' : 'f_demo_title');
      title.textContent = FT.t(CONTACT_ENDPOINT ? 'f_ok_title' : 'f_demo_title');
      $('contactSuccessMsg').textContent = FT.t(CONTACT_ENDPOINT ? 'f_ok_msg' : 'f_demo_msg', { name: payload.name.split(' ')[0] });
      $('contactDemo').hidden = !!CONTACT_ENDPOINT; // sin backend, se avisa que es una demostración
      form.hidden = true;
      success.hidden = false;
    };

    if (CONTACT_ENDPOINT) {
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) throw new Error('Contact request failed: ' + response.status);
        done();
      }).catch(function () {
        var error = $('contactError');
        error.textContent = FT.t('f_error');
        error.hidden = false;
      });
    } else {
      done(); // sin backend: solo confirma en pantalla
    }
  });
  $('contactAgain').addEventListener('click', function () {
    form.reset();
    $('contactError').hidden = true;
    form.classList.remove('was-validated');
    form.hidden = false;
    success.hidden = true;
  });
})();
