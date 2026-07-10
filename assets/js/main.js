/* Roopa Bhudia — interactions (vanilla, no dependencies) */
(function () {
  "use strict";
  window.__rbInit = true;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ----- year ----- */
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ----- preloader ----- */
  var loader = $("#loader");
  function reveal() {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    if (loader) { loader.classList.add("done"); setTimeout(function () { loader.remove(); }, 900); }
  }
  if (loader && !reduce) {
    window.addEventListener("load", function () { setTimeout(reveal, 1500); });
    setTimeout(reveal, 3000); // safety
  } else { reveal(); if (loader) loader.remove(); }

  /* ----- custom cursor ----- */
  if (fine && !reduce) {
    var dot = $("#cdot"), ring = $("#cring");
    if (dot && ring) {
      document.body.classList.add("cursor-ready");
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)"; });
      (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)"; requestAnimationFrame(loop); })();
      $$("a,button,.tile,input,select,textarea,iframe").forEach(function (el) {
        el.addEventListener("mouseenter", function () { ring.classList.add(el.classList.contains("tile") ? "grow" : "link"); });
        el.addEventListener("mouseleave", function () { ring.classList.remove("grow", "link"); });
      });
    }
  }

  /* ----- scroll progress ----- */
  var prog = $("#progress");
  function onScroll() {
    if (prog) {
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    }
    var nav = $("#nav"); if (nav) nav.classList.toggle("scrolled", scrollY > 40);
    if (!reduce) parallax();
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ----- nav / mobile ----- */
  var burger = $("#burger"), links = $("#navlinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    $$("a", links).forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); }); });
  }

  /* ----- reveal on scroll ----- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal,.draw,.statement").forEach(function (el) { io.observe(el); });

  /* ----- word-by-word statement ----- */
  var st = $(".statement p");
  if (st && !st.dataset.split) {
    st.dataset.split = "1";
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (w.trim() === "") { frag.appendChild(document.createTextNode(w)); }
            else { var s = document.createElement("span"); s.className = "word"; s.textContent = w; frag.appendChild(s); }
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    };
    walk(st);
    var words = $$(".word", st);
    words.forEach(function (w, i) { w.style.transitionDelay = (i * 0.05) + "s"; });
  }

  /* ----- counters ----- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, target = +el.dataset.count, dur = 1400, t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step); cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) { if (reduce) { el.textContent = el.dataset.count; } else { cio.observe(el); } });

  /* ----- parallax (hero portrait + florals) ----- */
  var pel = $$("[data-parallax]");
  function parallax() {
    var vh = innerHeight;
    pel.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var center = r.top + r.height / 2 - vh / 2;
      var speed = +el.dataset.parallax || 0.1;
      el.style.transform = "translate3d(0," + (center * -speed) + "px,0)";
    });
  }

  /* ----- 3D tilt on gallery tiles ----- */
  if (fine && !reduce) {
    $$(".tile").forEach(function (t) {
      t.addEventListener("mousemove", function (e) {
        var r = t.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = "perspective(900px) rotateY(" + (px * 6) + "deg) rotateX(" + (-py * 6) + "deg)";
      });
      t.addEventListener("mouseleave", function () { t.style.transform = ""; });
    });
    /* magnetic buttons */
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.25) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3) + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ----- lightbox ----- */
  var lb = $("#lb");
  if (lb) {
    var lbImg = $("#lbimg"), imgs = $$("#gallery .tile img"), cur = 0;
    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[cur].src; lbImg.alt = imgs[cur].alt || "Roopa Bhudia";
      lb.classList.add("open"); requestAnimationFrame(function () { lb.classList.add("show"); });
    }
    function hide() { lb.classList.remove("show"); setTimeout(function () { lb.classList.remove("open"); }, 380); }
    imgs.forEach(function (im, i) { im.parentElement.addEventListener("click", function () { show(i); }); });
    $("#lbclose").addEventListener("click", hide);
    $("#lbprev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    $("#lbnext").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
    addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  /* ----- drifting petals ----- */
  var cv = $("#petals");
  if (cv && !reduce) {
    var ctx = cv.getContext("2d"), W, H, petals = [], N = Math.min(26, Math.round(innerWidth / 60)), running = true;
    var COLORS = ["rgba(176,50,74,0.20)", "rgba(217,138,151,0.22)", "rgba(178,138,84,0.18)", "rgba(111,125,97,0.16)"];
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size(); addEventListener("resize", size);
    function P() {
      this.reset(true);
    }
    P.prototype.reset = function (init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.s = 6 + Math.random() * 10;
      this.sp = 0.3 + Math.random() * 0.7;
      this.drift = -0.4 + Math.random() * 0.8;
      this.rot = Math.random() * Math.PI * 2;
      this.vr = (-0.5 + Math.random()) * 0.02;
      this.c = COLORS[(Math.random() * COLORS.length) | 0];
      this.sway = Math.random() * Math.PI * 2;
    };
    for (var i = 0; i < N; i++) petals.push(new P());
    function petal(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.s * 0.5, -p.s * 0.5, p.s * 0.5, -p.s * 1.3, 0, -p.s * 1.6);
      ctx.bezierCurveTo(-p.s * 0.5, -p.s * 1.3, -p.s * 0.5, -p.s * 0.5, 0, 0);
      ctx.fill(); ctx.restore();
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      petals.forEach(function (p) {
        p.sway += 0.01;
        p.y += p.sp; p.x += p.drift + Math.sin(p.sway) * 0.4; p.rot += p.vr;
        if (p.y > H + 30) p.reset(false);
        petal(p);
      });
      requestAnimationFrame(frame);
    }
    frame();
    document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) frame(); });
  }
})();
