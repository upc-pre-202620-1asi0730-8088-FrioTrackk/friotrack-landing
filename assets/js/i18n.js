/* FríoTrack — motor de internacionalización (ES / EN).
   Atributos soportados en el HTML:
     data-i18n="clave"              -> textContent
     data-i18n-placeholder="clave"  -> placeholder
     data-i18n-aria="clave"         -> aria-label
     data-i18n-title="clave"        -> title
     data-lang-block="es|en"        -> muestra el bloque solo en ese idioma
   Preferencia guardada en localStorage con la clave "friotrack_lang". */
(function () {
  'use strict';

  var STORAGE_KEY = 'friotrack_lang';
  var DEFAULT_LANG = 'en';
  var LOCALES = { es: 'es-419', en: 'en-US' };
  var HTML_LANG = { es: 'es-419', en: 'en-US' };   // atributo lang de <html>
  var dict = window.FT_I18N || {};
  var current = DEFAULT_LANG;

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage bloqueado */ }
    if (saved && dict[saved]) return saved;
    return DEFAULT_LANG;
  }

  function t(key, vars) {
    var str = (dict[current] && dict[current][key]);
    if (str === undefined) str = dict[DEFAULT_LANG] && dict[DEFAULT_LANG][key];
    if (str === undefined) { console.warn('[i18n] falta la clave:', key); return key; }
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.split('{' + k + '}').join(vars[k]);
      });
    }
    return str;
  }

  function apply() {
    document.documentElement.lang = HTML_LANG[current] || current;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    document.querySelectorAll('[data-lang-block]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang-block') !== current;
    });

    var titleKey = document.documentElement.getAttribute('data-title-key') || 'meta_title';
    document.title = t(titleKey);
    var meta = document.querySelector('meta[name="description"]');
    if (meta && document.documentElement.getAttribute('data-has-desc') !== 'no') {
      meta.setAttribute('content', t('meta_desc'));
    }

    var og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', t('meta_title'));
    var ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute('content', t('og_desc'));

    // Anclas que existen en ambos idiomas: solo el bloque visible conserva el id
    document.querySelectorAll('[data-anchor]').forEach(function (el) {
      var block = el.closest('[data-lang-block]');
      var visible = !block || block.getAttribute('data-lang-block') === current;
      if (visible) el.id = el.getAttribute('data-anchor'); else el.removeAttribute('id');
    });

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === current));
    });

    document.dispatchEvent(new CustomEvent('ft:lang', { detail: { lang: current } }));
  }

  function setLang(lang) {
    if (!dict[lang]) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignorar */ }
    apply();
  }

  function formatNumber(n, digits) {
    return Number(n).toLocaleString(LOCALES[current], {
      minimumFractionDigits: digits || 0,
      maximumFractionDigits: digits || 0
    });
  }

  window.FT = {
    t: t,
    setLang: setLang,
    get lang() { return current; },
    get locale() { return LOCALES[current]; },
    num: formatNumber
  };

  current = detect();
  apply();
  // Los ids de los bloques por idioma se asignan aquí, así que se repite el salto al ancla de la URL
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.getAttribute('data-lang'));
  });
})();
