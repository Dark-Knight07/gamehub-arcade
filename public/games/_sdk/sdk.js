/*
 * Owais GameHub Game SDK
 * Shared by every built-in game. Talks to the GameHub player through postMessage:
 *   host -> game : { source: "ogh-host", type: "pause" | "resume" | "restart" | "mute", muted }
 *   game -> host : { source: "ogh-game", game, type: "ready" | "score" | "gameover" | "win" | "paused" | "resumed" | "muted", ... }
 * When a game runs on its own (offline download), the SDK shows its own pause screen and
 * handles P / Esc (pause), R (restart) and M (mute).
 */
(function () {
  "use strict";
  var GAME_ID = document.documentElement.getAttribute("data-game") || "game";
  var embedded = window.parent !== window;
  var handlers = {};
  var audioCtx = null;
  var lowerIsBetter = false;
  var overlay = null;

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable: the game still works, it just won't remember */
    }
  }
  function emit(ev, arg) {
    (handlers[ev] || []).forEach(function (fn) {
      try { fn(arg); } catch (e) { console.error(e); }
    });
  }

  var GH = {
    id: GAME_ID,
    embedded: embedded,
    paused: false,
    muted: read("ogh:muted", false) === true,

    config: function (opts) {
      lowerIsBetter = !!(opts && opts.lowerIsBetter);
    },
    on: function (ev, fn) {
      (handlers[ev] = handlers[ev] || []).push(fn);
    },
    send: function (type, data) {
      if (!embedded) return;
      var msg = { source: "ogh-game", game: GAME_ID, type: type };
      if (data) for (var k in data) msg[k] = data[k];
      try { window.parent.postMessage(msg, window.location.origin === "null" ? "*" : window.location.origin); } catch (e) { /* ignore */ }
    },
    ready: function () {
      GH.send("ready", { muted: GH.muted });
    },
    score: function (value) {
      GH.send("score", { value: value });
    },
    best: function () {
      return read("ogh:best:" + GAME_ID, null);
    },
    submit: function (value) {
      var best = GH.best();
      var better = best === null || (lowerIsBetter ? value < best : value > best);
      if (better) write("ogh:best:" + GAME_ID, value);
      return { best: better ? value : best, isNew: better };
    },
    gameOver: function (finalScore) {
      var r = GH.submit(finalScore);
      GH.send("gameover", { score: finalScore, best: r.best, isNew: r.isNew });
      return r;
    },
    win: function (finalScore) {
      var r = GH.submit(finalScore);
      GH.send("win", { score: finalScore, best: r.best, isNew: r.isNew });
      return r;
    },
    save: function (state) { write("ogh:save:" + GAME_ID, state); },
    load: function () { return read("ogh:save:" + GAME_ID, null); },
    clearSave: function () {
      try { localStorage.removeItem("ogh:save:" + GAME_ID); } catch (e) { /* ignore */ }
    },

    pause: function () {
      if (GH.paused) return;
      GH.paused = true;
      emit("pause");
      GH.send("paused");
      showOverlay(true);
    },
    resume: function () {
      if (!GH.paused) return;
      GH.paused = false;
      emit("resume");
      GH.send("resumed");
      showOverlay(false);
    },
    togglePause: function () {
      GH.paused ? GH.resume() : GH.pause();
    },
    restart: function () {
      GH.paused = false;
      showOverlay(false);
      emit("restart");
      GH.send("resumed");
    },
    setMuted: function (m) {
      GH.muted = !!m;
      write("ogh:muted", GH.muted);
      emit("mute", GH.muted);
      GH.send("muted", { muted: GH.muted });
    },

    /* Short synthesized sound effect: GH.sound(440, 0.08, "square", 0.05, 220) */
    sound: function (freq, duration, type, volume, slideTo) {
      if (GH.muted) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
        var t = audioCtx.currentTime;
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + (duration || 0.1));
        gain.gain.setValueAtTime(volume || 0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + (duration || 0.1));
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + (duration || 0.1) + 0.02);
      } catch (e) { /* audio blocked */ }
    },

    /* Canvas at a fixed logical size, scaled to fit the viewport and sharp on HiDPI screens */
    fit: function (canvas, W, H) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas._W = W;
      canvas._H = H;
      var c = canvas.getContext("2d");
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      function size() {
        var s = Math.min(window.innerWidth / W, window.innerHeight / H);
        canvas.style.width = Math.floor(W * s) + "px";
        canvas.style.height = Math.floor(H * s) + "px";
      }
      size();
      window.addEventListener("resize", size);
      return c;
    },
    /* Pointer/touch position in logical canvas coordinates */
    point: function (canvas, e) {
      var r = canvas.getBoundingClientRect();
      var src = e.touches && e.touches[0] ? e.touches[0] : e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
      return {
        x: ((src.clientX - r.left) / r.width) * canvas._W,
        y: ((src.clientY - r.top) / r.height) * canvas._H,
      };
    },
    /* Fixed-timestep-friendly loop; update is skipped while paused */
    loop: function (update, render) {
      var last = performance.now();
      function frame(now) {
        var dt = Math.min((now - last) / 1000, 1 / 20);
        last = now;
        if (!GH.paused) update(dt);
        render();
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    /* Swipe detection: cb("up" | "down" | "left" | "right") */
    swipe: function (el, cb, min) {
      var sx = 0, sy = 0, active = false;
      min = min || 24;
      el.addEventListener("touchstart", function (e) {
        active = true;
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      }, { passive: true });
      el.addEventListener("touchmove", function (e) {
        if (active) e.preventDefault();
      }, { passive: false });
      el.addEventListener("touchend", function (e) {
        if (!active) return;
        active = false;
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < min) return;
        cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
      });
    },
  };

  function showOverlay(on) {
    if (embedded) return; // the GameHub player draws its own pause screen
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "ogh-pause";
      overlay.innerHTML =
        '<div><strong>Paused</strong><p>Press P or tap to resume</p><p class="ogh-keys">R restart &nbsp; M sound on/off</p></div>';
      overlay.addEventListener("click", GH.resume);
      document.body.appendChild(overlay);
    }
    overlay.style.display = on ? "flex" : "none";
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== window.location.origin && window.location.origin !== "null") return;
    var d = e.data;
    if (!d || d.source !== "ogh-host") return;
    if (d.type === "pause") GH.pause();
    else if (d.type === "resume") GH.resume();
    else if (d.type === "restart") GH.restart();
    else if (d.type === "mute") GH.setMuted(d.muted);
  });

  window.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    var k = e.key.toLowerCase();
    if (k === "p" || k === "escape") GH.togglePause();
    else if (k === "r" && !e.ctrlKey && !e.metaKey) GH.restart();
    else if (k === "m") GH.setMuted(!GH.muted);
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) GH.pause();
  });

  /* Canvas text and overlay helpers used by the arcade games */
  GH.text = function (c, s, x, y, size, color, align, weight) {
    c.font = (weight || 600) + " " + size + "px 'Sora Variable', 'Segoe UI', system-ui, sans-serif";
    c.fillStyle = color || "#e8ebff";
    c.textAlign = align || "center";
    c.textBaseline = "middle";
    c.fillText(s, x, y);
  };
  GH.card = function (c, W, H, title, sub, extra) {
    c.fillStyle = "rgba(6, 7, 13, 0.74)";
    c.fillRect(0, 0, W, H);
    GH.text(c, title, W / 2, H / 2 - 26, Math.min(40, W / 10), "#e8ebff", "center", 700);
    if (sub) GH.text(c, sub, W / 2, H / 2 + 16, 15, "#8f96bf", "center", 500);
    if (extra) GH.text(c, extra, W / 2, H / 2 + 46, 14, "#40e0ff", "center", 600);
  };
  GH.rand = function (a, b) { return a + Math.random() * (b - a); };
  GH.hit = function (a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  };

  window.GameHub = GH;
  window.addEventListener("load", GH.ready);
})();
