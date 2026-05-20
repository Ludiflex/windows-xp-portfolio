// =============================================================================
//  Main Entry Point
//  Boots the OS, initialises all modules, and wires up global events.
// =============================================================================

import { handleMouseMove, handleMouseUp, toggleSound, playSound } from "./windowManager.js";
import { initTaskbar, initStartMenu } from "./taskbar.js";
import { initDesktop } from "./desktop.js";
import { initBoot } from "./boot.js";
import { USER } from "./config.js";
import "../css/xp-buttons.css";

function init() {
  // ── Inject personalised content from config ──────────────────────────────
  const userNameEl = document.querySelector(".start-user-name");
  if (userNameEl) userNameEl.textContent = USER.name;

  // ── Global mouse events for window drag & resize ─────────────────────────
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // Touch drag support (passes a mouse-like event object)
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 1) {
        handleMouseMove({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        });
      }
    },
    { passive: true },
  );
  document.addEventListener("touchend", handleMouseUp);

  // ── Initialise subsystems ────────────────────────────────────────────────
  initTaskbar();
  initStartMenu();
  initDesktop();

  // ── Sound toggle (taskbar button) ────────────────────────────────────────
  const soundToggle = document.getElementById("sound-toggle");
  const soundIcon   = document.getElementById("sound-icon");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      const enabled = toggleSound();
      soundToggle.title = enabled ? "Sound: On" : "Sound: Off";
      if (soundIcon) {
        soundIcon.src = enabled
          ? "/src/assets/taskbar/notification-audio-volume-high.png"
          : "/src/assets/taskbar/notification-audio-volume-muted.png";
      }
      if (enabled) playSound("click");
    });
  }

  // ── Fullscreen toggle (taskbar button) ───────────────────────────────────
  const fullscreenToggle = document.getElementById("fullscreen-toggle");
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      playSound("click");
    });
  }
}

// Run boot animation, then initialise
initBoot(() => init());
