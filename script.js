/* Love Joy Daquiado — Upward Focus portfolio interactions
   Scroll-based reveals (robust across environments) */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- fit the hero headline to its container (one line, never clipped) ---- */
  var heroName = document.querySelector('.hero-name');
  function fitHeadline() {
    if (!heroName) return;
    if (!window.matchMedia('(min-width: 1001px)').matches) { heroName.style.fontSize = ''; return; }
    heroName.style.fontSize = '100px';
    var avail = heroName.clientWidth;
    var textW = heroName.scrollWidth;
    if (textW > 0) {
      var size = 100 * (avail / textW) * 0.985;
      heroName.style.fontSize = Math.min(size, 150) + 'px';
    }
  }

  /* ---- ascending vertical rules in hero ---- */
  var rules = document.getElementById('heroRules');
  if (rules) {
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('span');
      s.style.left = (8 + i * 13) + '%';
      s.style.opacity = (0.25 + (i / 7) * 0.7).toFixed(2);
      rules.appendChild(s);
    }
  }

  /* ---- nav scroll state ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- reveal on scroll (getBoundingClientRect based) ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function inView(el, margin) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < (vh - margin) && r.bottom > 0;
  }
  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var k = reveals.length - 1; k >= 0; k--) {
      var el = reveals[k];
      if (inView(el, vh * 0.08)) {
        el.classList.add('in');
        reveals.splice(k, 1);
      }
    }
  }

  /* ---- process bars grow when chart in view ---- */
  var chart = document.getElementById('procChart');
  var grown = false;
  function growBars() {
    if (grown || !chart) return;
    if (!inView(chart, (window.innerHeight || 800) * 0.22)) return;
    grown = true;
    chart.querySelectorAll('.proc-bar').forEach(function (bar, idx) {
      var target = bar.getAttribute('data-h');
      setTimeout(function () { bar.style.height = target; }, 120 + idx * 130);
    });
  }

  /* ---- ascending trend line drawn across the bar tops ---- */
  var trendDrawn = false, trendPending = false;
  function drawTrend() {
    if (trendDrawn || trendPending || !chart) return;
    if (!inView(chart, (window.innerHeight || 800) * 0.22)) return;
    var svg = document.getElementById('trendSvg');
    var path = document.getElementById('trendPath');
    if (!svg || !path) return;
    trendPending = true;
    setTimeout(function () {
      var crect = chart.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + crect.width + ' ' + crect.height);
      var pts = [];
      chart.querySelectorAll('.proc-bar').forEach(function (bar) {
        var b = bar.getBoundingClientRect();
        pts.push([b.left - crect.left + b.width / 2, b.top - crect.top]);
      });
      if (!pts.length) { trendPending = false; return; }
      path.setAttribute('d', 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'));
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)';
      path.style.strokeDashoffset = '0';
      pts.forEach(function (p, i) {
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 5.5);
        c.setAttribute('class', 'trend-dot');
        svg.appendChild(c);
        setTimeout(function () { c.classList.add('on'); }, 250 + i * 330);
      });
      trendDrawn = true; trendPending = false;
    }, 1650);
  }

  /* ---- active nav link ---- */
  var navLinks = {};
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    navLinks[a.getAttribute('href').slice(1)] = a;
  });
  var sectionIds = ['work', 'process', 'about', 'contact'];
  function activeNav() {
    var vh = window.innerHeight || 800;
    var current = null;
    sectionIds.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= vh * 0.45 && r.bottom >= vh * 0.25) current = id;
    });
    Object.keys(navLinks).forEach(function (k) {
      navLinks[k].style.color = (k === current) ? 'var(--cream-50)' : '';
    });
  }

  /* ---- master scroll handler ---- */
  var ticking = false;
  function handle() {
    onScroll();
    checkReveals();
    growBars();
    drawTrend();
    activeNav();
    ticking = false;
  }
  function requestHandle() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(handle); }
  }
  window.addEventListener('scroll', requestHandle, { passive: true });
  window.addEventListener('resize', requestHandle);

  /* initial passes (cover late layout/font load) */
  fitHeadline();
  handle();
  window.addEventListener('load', function () { fitHeadline(); handle(); });
  window.addEventListener('resize', fitHeadline);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { fitHeadline(); }); }
  [120, 400, 900].forEach(function (t) { setTimeout(function () { fitHeadline(); handle(); }, t); });

  /* ---- subtle parallax on hero photo + glow ---- */
  var photo = document.querySelector('.hero-photo');
  var glow = document.querySelector('.hero-glow');
  if (photo && !reduce && window.matchMedia('(min-width: 1001px)').matches) {
    var hero = document.getElementById('hero');
    hero.addEventListener('mousemove', function (ev) {
      var r = hero.getBoundingClientRect();
      var dx = (ev.clientX - r.width / 2) / r.width;
      var dy = (ev.clientY - r.height / 2) / r.height;
      photo.style.transform = 'translate(' + (dx * 12) + 'px,' + (dy * 9) + 'px)';
      if (glow) glow.style.transform = 'translate(-50%,-50%) translate(' + (dx * 20) + 'px,' + (dy * 16) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      photo.style.transform = '';
      if (glow) glow.style.transform = 'translate(-50%,-50%)';
    });
  }
})();