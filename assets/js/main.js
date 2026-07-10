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
  /* crest draw-in: ink the line-art, then resolve into the full crest */
  var lineSvg = $("#loaderline");
  if (loader && lineSvg && !reduce) {
    try {
      var lns = $$(".ln", lineSvg), stagger = 95, drawDur = 900;
      lns.forEach(function (el, i) {
        var len = el.getTotalLength ? el.getTotalLength() : 300;
        el.style.strokeDasharray = len; el.style.strokeDashoffset = len;
        el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: drawDur, delay: 120 + i * stagger, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      });
      var lastEnd = 120 + lns.length * stagger + drawDur;
      var mono = $(".mono", lineSvg);
      if (mono) mono.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: Math.max(0, lastEnd - 800), easing: "ease", fill: "forwards" });
      var full = $(".loader__full"), name = $(".loader__name");
      setTimeout(function () {
        lineSvg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "ease", fill: "forwards" });
        if (full) full.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "scale(1)" }], { duration: 1000, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
        if (name) name.animate([{ opacity: 0, transform: "translateX(-50%) translateY(12px)" }, { opacity: 1, transform: "translateX(-50%) translateY(0)" }], { duration: 900, delay: 200, easing: "ease", fill: "forwards" });
      }, lastEnd);
    } catch (e) { var f = $(".loader__full"); if (f) f.style.opacity = 1; }
  }

  if (loader && !reduce) {
    window.addEventListener("load", function () { setTimeout(reveal, 3800); });
    setTimeout(reveal, 5000);
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
