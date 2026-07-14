/* Love Joy Daquiado — Tweaks panel */
(function () {
  'use strict';

  var state = Object.assign({ accent: '#36CDC6', glow: '#3FE0A0', rules: true }, window.LJ_TWEAKS || {});
  var panel = document.getElementById('tweaks');
  var root = document.documentElement;

  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function apply() {
    root.style.setProperty('--accent', state.accent);
    root.style.setProperty('--accent-soft', hexToRgba(state.accent, 0.16));
    var hero = document.querySelector('.hero');
    if (hero) hero.style.setProperty('--hero-green', state.glow);
    var name = document.querySelector('.hero-name');
    if (name) {
      name.style.background = 'linear-gradient(176deg, ' + hexToRgba(state.glow, 1) + ' 0%, ' + state.glow + ' 52%, ' + state.glow + ' 100%)';
      name.style.webkitBackgroundClip = 'text';
      name.style.backgroundClip = 'text';
      name.style.filter = 'drop-shadow(0 6px 40px ' + hexToRgba(state.glow, 0.42) + ')';
    }
    var glowEl = document.querySelector('.hero-glow');
    if (glowEl) glowEl.style.background = 'radial-gradient(closest-side, ' + hexToRgba(state.glow, 0.5) + ', ' + hexToRgba(state.glow, 0.16) + ' 46%, transparent 72%)';
    var rules = document.getElementById('heroRules');
    if (rules) rules.classList.toggle('hidden', !state.rules);
    syncControls();
  }

  function syncControls() {
    document.querySelectorAll('#twAccent .tw-sw').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-val') === state.accent);
    });
    document.querySelectorAll('#twGlow .tw-sw').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-val') === state.glow);
    });
    document.getElementById('twRules').classList.toggle('on', !!state.rules);
  }

  function persist(edits) {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: edits }, '*'); } catch (e) {}
  }
  function set(key, val) { state[key] = val; apply(); var e = {}; e[key] = val; persist(e); }

  /* wire controls */
  document.querySelectorAll('#twAccent .tw-sw').forEach(function (b) {
    b.addEventListener('click', function () { set('accent', b.getAttribute('data-val')); });
  });
  document.querySelectorAll('#twGlow .tw-sw').forEach(function (b) {
    b.addEventListener('click', function () { set('glow', b.getAttribute('data-val')); });
  });
  document.getElementById('twRules').addEventListener('click', function () { set('rules', !state.rules); });

  /* host protocol — listener first, then announce */
  window.addEventListener('message', function (ev) {
    var t = ev.data && ev.data.type;
    if (t === '__activate_edit_mode') panel.classList.add('open');
    else if (t === '__deactivate_edit_mode') panel.classList.remove('open');
  });
  document.getElementById('tweaksClose').addEventListener('click', function () {
    panel.classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

  apply();
})();