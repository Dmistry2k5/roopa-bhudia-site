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
    document.body.classList.add("entered");
    if (loader) { loader.classList.add("done"); setTimeout(function () { if (loader && loader.parentNode) loader.remove(); }, 1100); }
  }
  /* real crest ink-draw: stroke the actual artwork on, then fill with bronze */
  var draw = $("#crestdraw");
  var seen = false; try { seen = sessionStorage.getItem("rb_seen") === "1"; } catch (e) {}
  if (loader && draw && !reduce && !seen) {
    try {
      var paths = $$("path", draw), lens = [];
      paths.forEach(function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 0; lens.push(len);
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      });
      var stagger = 58, drawDur = 1000;
      paths.forEach(function (p, i) {
        p.animate([{ strokeDashoffset: lens[i] }, { strokeDashoffset: 0 }],
          { duration: drawDur, delay: i * stagger, easing: "ease-in-out", fill: "forwards" });
      });
      var drawEnd = paths.length * stagger + drawDur;
      setTimeout(function () {
        paths.forEach(function (p, i) {
          p.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }],
            { duration: 900, delay: i * 12, easing: "ease", fill: "forwards" });
        });
      }, drawEnd - 300);
      var name = $(".loader__name");
      if (name) name.animate([{ opacity: 0, transform: "translateX(-50%) translateY(12px)" }, { opacity: 1, transform: "translateX(-50%) translateY(0)" }],
        { duration: 1000, delay: drawEnd + 250, easing: "ease", fill: "forwards" });
    } catch (e) { $$("#crestdraw path").forEach(function (p) { p.style.fillOpacity = 1; p.style.strokeWidth = 0; }); }
  }

  if (loader && !reduce && !seen) {
    try { sessionStorage.setItem("rb_seen", "1"); } catch (e) {}
    window.addEventListener("load", function () { setTimeout(reveal, 4600); });
    setTimeout(reveal, 6000);
  } else { reveal(); if (loader) loader.remove(); }

  /* nav scroll state */
  var nav = $("#nav");
  addEventListener("scroll", function () { if (nav) nav.classList.toggle("scrolled", scrollY > 40); }, { passive: true });

  /* mobile menu */
  /* mobile menu is wired via an inline script in the page for maximum reliability */

  /* gentle reveal on scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  $$(".reveal").forEach(function (el) { io.observe(el); });

  /* cinematic parallax (upward-only so the watermark crop is never revealed) */
  var px = $$("[data-parallax]");
  if (px.length && !reduce) {
    var tick = false;
    function par() {
      var vh = innerHeight;
      px.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var prog = (vh - r.top) / (vh + r.height); prog = prog < 0 ? 0 : prog > 1 ? 1 : prog;
        var range = r.height * (parseFloat(el.dataset.parallax) || 0.1);
        el.style.transform = "translate3d(0," + (-(prog * range)).toFixed(1) + "px,0)";
      });
      tick = false;
    }
    addEventListener("scroll", function () { if (!tick) { requestAnimationFrame(par); tick = true; } }, { passive: true });
    addEventListener("resize", par); par();
  }

  /* fullscreen gallery */
  var box = $("#lightbox");
  if (box) {
    var lbImg = $("#lbImg"), lbCap = $("#lbCap");
    var imgs = $$("#gallery .tile img"), idx = 0;
    function showLb(i) {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].src; lbImg.alt = imgs[idx].alt || "Roopa Bhudia";
      var s = imgs[idx].closest(".tile").querySelector(".tile__cap small");
      lbCap.textContent = s ? s.textContent : "Roopa Bhudia";
      box.classList.add("open"); requestAnimationFrame(function () { box.classList.add("show"); });
      box.setAttribute("aria-hidden", "false");
    }
    function hideLb() { box.classList.remove("show"); box.setAttribute("aria-hidden", "true"); setTimeout(function () { box.classList.remove("open"); }, 460); }
    imgs.forEach(function (im, i) { im.closest(".tile").addEventListener("click", function () { showLb(i); }); });
    $("#lbClose").addEventListener("click", hideLb);
    $("#lbPrev").addEventListener("click", function (e) { e.stopPropagation(); showLb(idx - 1); });
    $("#lbNext").addEventListener("click", function (e) { e.stopPropagation(); showLb(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) hideLb(); });
    addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") hideLb();
      if (e.key === "ArrowLeft") showLb(idx - 1);
      if (e.key === "ArrowRight") showLb(idx + 1);
    });
  }
})();
