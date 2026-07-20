// Beanos Studios — tiny UI sound engine.
// Sounds are synthesized live via the Web Audio API — no audio files,
// so nothing to host and nothing that can be a copyright concern.
(function () {
  let ctx = null;
  let muted = localStorage.getItem("beanos-sound-muted") === "1";

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone({ freq = 600, duration = 0.06, type = "sine", volume = 0.05, glideTo = null }) {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    try {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + duration);
      gain.gain.setValueAtTime(volume, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch (e) { /* audio unavailable — fail silently, never break the site */ }
  }

  window.playHoverSound = function () {
    tone({ freq: 950, duration: 0.03, type: "sine", volume: 0.03 });
  };
  window.playClickSound = function () {
    tone({ freq: 560, duration: 0.07, type: "triangle", volume: 0.07, glideTo: 320 });
  };

  function refreshToggleButtons() {
    document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
      btn.textContent = muted ? "🔇" : "🔊";
      btn.setAttribute("aria-label", muted ? "Unmute sounds" : "Mute sounds");
    });
  }

  window.beanosToggleMute = function () {
    muted = !muted;
    localStorage.setItem("beanos-sound-muted", muted ? "1" : "0");
    refreshToggleButtons();
  };

  document.addEventListener("DOMContentLoaded", () => {
    refreshToggleButtons();
    document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.beanosToggleMute();
      });
    });
  });

  // Delegated listeners — automatically cover buttons/links added later
  // (modal, quiz, comments), no per-element wiring needed anywhere else.
  const SOUND_SELECTOR = "button, a.btn, .nav-links a, .cast-name-link";

  document.addEventListener("click", (e) => {
    const el = e.target.closest(SOUND_SELECTOR);
    if (el && !el.hasAttribute("data-sound-toggle")) window.playClickSound();
  });

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest(SOUND_SELECTOR);
    if (!el) return;
    if (el.contains(e.relatedTarget)) return; // moving within the same element, not a new hover
    window.playHoverSound();
  }, true);
})();
