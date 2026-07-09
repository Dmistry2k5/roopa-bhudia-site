/* Roopa Bhudia — site behaviour */
(function () {
  // year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // nav scroll state
  var nav = document.getElementById('nav');
  if (nav) {
    addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', scrollY > 40);
    });
  }

  // mobile menu
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
      });
    });
  }

  // scroll reveal
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // lightbox (portfolio)
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = document.getElementById('lbimg');
    var tiles = Array.prototype.slice.call(document.querySelectorAll('#gallery .tile img'));
    var current = 0;

    function show(i) {
      current = (i + tiles.length) % tiles.length;
      lbImg.src = tiles[current].src;
      lbImg.alt = tiles[current].alt || 'Roopa Bhudia';
      lb.classList.add('open');
    }
    tiles.forEach(function (img, i) {
      img.parentElement.addEventListener('click', function () { show(i); });
    });
    document.getElementById('lbclose').addEventListener('click', function () { lb.classList.remove('open'); });
    document.getElementById('lbprev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    document.getElementById('lbnext').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }
})();
