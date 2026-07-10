/* Roopa Bhudia — Maison (minimal, reliable) */
(function () {
  "use strict";
  window.__rbInit = true;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* preloader */
  var loader = $("#loader");
  function reveal() {
    document.body.classList.remove("loading");
    if (loader) { loader.classList.add("done"); setTimeout(function () { if (loader && loader.parentNode) loader.remove(); }, 1100); }
  }
  if (loader && !reduce) {
    window.addEventListener("load", function () { setTimeout(reveal, 2700); });
    setTimeout(reveal, 3900);
  } else { reveal(); if (loader) loader.remove(); }

  /* nav scroll state */
  var nav = $("#nav");
  addEventListener("scroll", function () { if (nav) nav.classList.toggle("scrolled", scrollY > 40); }, { passive: true });

  /* mobile menu */
  var burger = $("#burger"), links = $("#navlinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    $$("a", links).forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); }); });
  }

  /* gentle reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  $$(".reveal").forEach(function (el) { io.observe(el); });
})();
