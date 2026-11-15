const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const script = name => fs.readFileSync(path.join(root, name), 'utf8');

function languageContext({ query = '', saved = null, browser = 'es-PE', blockedStorage = false } = {}) {
  const element = { lang: '', getAttribute: () => null };
  const context = { window: {}, URLSearchParams, location: { search: query, hash: '' }, navigator: { language: browser }, console,
    localStorage: { getItem() { if (blockedStorage) throw Error('blocked'); return saved; }, setItem(key, value) { if (blockedStorage) throw Error('blocked'); saved = value; } },
    CustomEvent: function (type, options) { this.type = type; this.detail = options.detail; },
    document: { documentElement: element, querySelectorAll: () => [], querySelector: () => null, dispatchEvent: () => {}, addEventListener: () => {} } };
  vm.createContext(context);
  for (const file of ['i18n/es.js', 'i18n/en.js', 'assets/js/i18n.js']) vm.runInContext(script(file), context);
  return context;
}

test('first visit uses English even in a Spanish browser and with unavailable storage', () => {
  for (const blockedStorage of [false, true]) {
    const context = languageContext({ blockedStorage });
    assert.equal(context.window.FT.lang, 'en');
    assert.equal(context.window.FT.locale, 'en-US');
    assert.equal(context.document.documentElement.lang, 'en-US');
  }
});

test('explicit language overrides saved choice; saved Spanish uses the Latin American locale', () => {
  assert.equal(languageContext({ query: '?lang=en', saved: 'es' }).window.FT.lang, 'en');
  const context = languageContext({ query: '?lang=unsupported', saved: 'es' });
  assert.equal(context.window.FT.lang, 'es');
  assert.equal(context.window.FT.locale, 'es-419');
  assert.equal(context.document.documentElement.lang, 'es-419');
  context.window.FT.setLang('en');
  assert.equal(context.document.documentElement.lang, 'en-US');
});

test('translation dictionaries have matching keys and every HTML translation exists', () => {
  const context = languageContext();
  const { en, es } = context.window.FT_I18N;
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
  for (const file of ['index.html', 'Terms-and-Condition.html']) {
    for (const match of script(file).matchAll(/data-i18n(?:-placeholder|-aria|-title)?="([^"]+)"/g)) {
      assert.ok(Object.hasOwn(en, match[1]), `${file}: missing ${match[1]}`);
    }
  }
});

function videoContext(product, team) {
  const events = {}, created = [];
  let language = 'en';
  const cards = ['product', 'team'].map(kind => {
    const player = { children: [], querySelector: () => player.children[0] || null, appendChild: child => { player.children.push(child); child.closest = () => card; } };
    const button = { hidden: false, addEventListener: (event, callback) => { button[event] = callback; } };
    const link = {};
    const card = { kind, hidden: true, getAttribute: () => kind, querySelector: selector => selector === '.video-player' ? player : selector === '[data-video-play]' ? button : link, player, button, link };
    return card;
  });
  const section = { hidden: true, querySelectorAll: selector => selector === '[data-video]' ? cards : created };
  const context = { URL, window: { FT_CONFIG: { videos: { product: { youtubeUrl: product }, team: { youtubeUrl: team } } }, FT: { t: key => language + ':' + key } },
    document: { getElementById: () => section, addEventListener: (name, callback) => { events[name] = callback; }, createElement: () => { const iframe = { setAttribute: (name, value) => { iframe[name] = value; }, focus: () => {} }; created.push(iframe); return iframe; } } };
  vm.createContext(context);vm.runInContext(script('assets/js/videos.js'), context);
  return { cards, section, created, changeLanguage: value => { language = value; events['ft:lang'](); } };
}

test('missing or invalid video links show no player or public section', () => {
  for (const value of [null, '', 'javascript:alert(1)', 'http://youtu.be/abcdefghijk', 'https://youtube.com.evil.test/watch?v=abcdefghijk', 'https://user@youtube.com/watch?v=abcdefghijk', 'https://youtu.be/not-a-video-id']) {
    const context = videoContext(value, null);
    assert.equal(context.section.hidden, true);
    assert.equal(context.created.length, 0);
  }
});

test('a published video loads a privacy-domain iframe only after its play button is activated', () => {
  for (const value of ['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'https://www.youtube-nocookie.com/embed/abcdefghijk']) {
    const context = videoContext(value, null), card = context.cards[0];
    assert.equal(context.section.hidden, false);
    assert.equal(card.hidden, false);
    assert.equal(context.cards[1].hidden, true);
    assert.equal(context.created.length, 0);
    assert.equal(card.link.href, 'https://www.youtube.com/watch?v=abcdefghijk');
    card.button.click();card.button.click();
    assert.equal(context.created.length, 1);
    assert.equal(context.created[0].src, 'https://www.youtube-nocookie.com/embed/abcdefghijk');
    assert.equal(card.button.hidden, true);
    context.changeLanguage('es');
    assert.equal(context.created[0].title, 'es:videos_product_title');
  }
});

test('the production configuration uses the published product video without sample videos or a contact delivery claim', () => {
  const context = { window: {} };vm.createContext(context);vm.runInContext(script('assets/js/config.js'), context);
  assert.equal(context.window.FT_CONFIG.videos.product.youtubeUrl, 'https://youtu.be/t8ZrSPgQvr0');
  const product = videoContext(context.window.FT_CONFIG.videos.product.youtubeUrl, null);
  assert.equal(product.section.hidden, false);
  assert.equal(product.created.length, 0);
  product.cards[0].button.click();
  assert.equal(product.created[0].src, 'https://www.youtube-nocookie.com/embed/t8ZrSPgQvr0');
  assert.equal(new URL(context.window.FT_CONFIG.videos.product.streamUrl).hostname, 'upcedupe-my.sharepoint.com');
  assert.equal(context.window.FT_CONFIG.videos.team.youtubeUrl, null);
  assert.equal(context.window.FT_CONFIG.contactEndpoint, null);
});
