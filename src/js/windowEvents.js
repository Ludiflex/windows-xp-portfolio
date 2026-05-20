// =============================================================================
//  Window Events
//  Handles all user interactions on individual windows:
//  drag, resize, focus, minimize, maximize/restore, and close.
//  Imported and called by windowManager.js after each window is created.
// =============================================================================

import { playSound } from "./sound.js";

// ── Shared interaction state ───────────────────────────────────────────────────

const dragState = { active: false, id: null, el: null, offsetX: 0, offsetY: 0 };
const resizeState = {
  active: false, id: null, el: null, direction: "",
  startX: 0, startY: 0,
  startLeft: 0, startTop: 0, startWidth: 0, startHeight: 0,
};

/** Minimum dimensions when resizing (px) */
const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

// ── Global mouse/touch handlers (called from main.js) ─────────────────────────

/**
 * Forward mousemove events here from the document listener in main.js.
 * @param {MouseEvent} e
 */
export function handleMouseMove(e) {
  if (dragState.active) {
    moveDrag(e.clientX, e.clientY);
  } else if (resizeState.active) {
    handleResizeMove(e.clientX, e.clientY);
  }
}

/**
 * Forward mouseup / touchend events here from the document listener in main.js.
 */
export function handleMouseUp() {
  dragState.active = false;
  resizeState.active = false;
}

// ── Public API used by windowManager.js ───────────────────────────────────────

/**
 * Attach all interaction listeners to a freshly-created window element.
 * @param {string} id             Window ID
 * @param {HTMLElement} el        The .xp-window element
 * @param {{ windows: Map, zIndex: number, activeWindowId: string|null }} state
 */
export function bindWindowEvents(id, el, state) {
  const titlebar = el.querySelector(".xp-window-titlebar");
  const btnMin   = el.querySelector(".xp-window-btn-minimize");
  const btnMax   = el.querySelector(".xp-window-btn-maximize");
  const btnClose = el.querySelector(".xp-window-btn-close");

  // Focus on any click inside the window
  el.addEventListener("mousedown", () => focusWindow(id, state));

  // ── Drag ──
  titlebar.addEventListener("mousedown", (e) => {
    if (e.target.closest(".xp-window-controls")) return;
    if (state.windows.get(id)?.maximized) return;
    startDrag(id, el, e.clientX, e.clientY);
  });

  // Touch drag support
  titlebar.addEventListener("touchstart", (e) => {
    if (e.target.closest(".xp-window-controls")) return;
    if (state.windows.get(id)?.maximized) return;
    if (e.touches.length === 1) {
      startDrag(id, el, e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ── Resize ──
  el.querySelectorAll("[class^='xp-resize-']").forEach((handle) => {
    const dir = handle.className.replace("xp-resize-", "");
    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (state.windows.get(id)?.maximized) return;
      startResize(id, el, e.clientX, e.clientY, dir);
    });
  });

  // ── Control buttons ──
  btnMin.addEventListener("click",   (e) => { e.stopPropagation(); minimizeWindow(id, state); });
  btnMax.addEventListener("click",   (e) => { e.stopPropagation(); toggleMaximize(id, state); });
  btnClose.addEventListener("click", (e) => { e.stopPropagation(); closeWindow(id, state); });

  // Double-click titlebar to maximise
  titlebar.addEventListener("dblclick", (e) => {
    if (e.target.closest(".xp-window-controls")) return;
    toggleMaximize(id, state);
  });
}

// ── Focus ──────────────────────────────────────────────────────────────────────

/**
 * Bring a window to the front and mark it as active.
 * @param {string} id
 * @param {{ windows: Map, zIndex: number, activeWindowId: string|null }} state
 */
export function focusWindow(id, state) {
  if (!state.windows.has(id)) return;

  // Remove focus from all others
  state.windows.forEach((win) => win.el.classList.remove("focused"));
  state.activeWindowId = null;

  state.zIndex += 1;
  const win = state.windows.get(id);
  win.el.style.zIndex = state.zIndex;
  win.el.classList.add("focused");
  state.activeWindowId = id;

  window.dispatchEvent(new CustomEvent("window-focused", { detail: { id } }));
}

// ── Minimize / Restore ─────────────────────────────────────────────────────────

/**
 * Hide a window and update state.
 * @param {string} id
 * @param {{ windows: Map, activeWindowId: string|null }} state
 */
export function minimizeWindow(id, state) {
  const win = state.windows.get(id);
  if (!win) return;

  win.minimized = true;
  win.el.style.display = "none";

  // Auto-focus the next visible window
  if (state.activeWindowId === id) {
    state.activeWindowId = null;
    let topId = null, topZ = 0;
    state.windows.forEach((w, wid) => {
      if (!w.minimized && wid !== id) {
        const z = parseInt(w.el.style.zIndex) || 0;
        if (z > topZ) { topZ = z; topId = wid; }
      }
    });
    if (topId) focusWindow(topId, state);
  }
  window.dispatchEvent(new CustomEvent("window-minimized", { detail: { id } }));
}

/**
 * Restore a minimised window.
 * @param {string} id
 * @param {{ windows: Map, activeWindowId: string|null }} state
 */
export function restoreWindow(id, state) {
  const win = state.windows.get(id);
  if (!win) return;
  win.minimized = false;
  win.el.style.display = "";
  focusWindow(id, state);
  window.dispatchEvent(new CustomEvent("window-restored", { detail: { id } }));
}

/**
 * Toggle between minimised and restored from the taskbar button.
 * @param {string} id
 * @param {{ windows: Map, activeWindowId: string|null }} state
 */
export function toggleMinimizeRestore(id, state) {
  const win = state.windows.get(id);
  if (!win) return;
  if (win.minimized) {
    restoreWindow(id, state);
  } else if (state.activeWindowId === id) {
    minimizeWindow(id, state);
  } else {
    focusWindow(id, state);
  }
}

// ── Maximize ───────────────────────────────────────────────────────────────────

/**
 * Toggle maximise on a window.
 * @param {string} id
 * @param {{ windows: Map }} state
 */
export function toggleMaximize(id, state) {
  const win = state.windows.get(id);
  if (!win) return;

  if (win.maximized) {
    // Restore
    win.maximized = false;
    win.el.classList.remove("maximized");
    if (win.restoreRect) {
      Object.assign(win.el.style, win.restoreRect);
    }
  } else {
    // Save current rect then maximise
    win.restoreRect = {
      left: win.el.style.left,
      top: win.el.style.top,
      width: win.el.style.width,
      height: win.el.style.height,
    };
    win.maximized = true;
    win.el.classList.add("maximized");
  }
}

// ── Close ──────────────────────────────────────────────────────────────────────

/**
 * Destroy a window element and remove it from state.
 * @param {string} id
 * @param {{ windows: Map, activeWindowId: string|null }} state
 */
export function closeWindow(id, state) {
  const win = state.windows.get(id);
  if (!win) return;
  win.el.remove();
  state.windows.delete(id);
  if (state.activeWindowId === id) state.activeWindowId = null;
  window.dispatchEvent(new CustomEvent("window-closed", { detail: { id } }));
  playSound("close");
}

// ── Internal drag helpers ──────────────────────────────────────────────────────

function startDrag(id, el, clientX, clientY) {
  const rect = el.getBoundingClientRect();
  Object.assign(dragState, {
    active: true, id, el,
    offsetX: clientX - rect.left,
    offsetY: clientY - rect.top,
  });
}

function moveDrag(clientX, clientY) {
  const { el, offsetX, offsetY } = dragState;
  const x = Math.max(0, Math.min(clientX - offsetX, window.innerWidth - 50));
  const y = Math.max(0, Math.min(clientY - offsetY, window.innerHeight - 80));
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
}

// ── Internal resize helpers ────────────────────────────────────────────────────

function startResize(id, el, clientX, clientY, direction) {
  const rect = el.getBoundingClientRect();
  Object.assign(resizeState, {
    active: true, id, el, direction,
    startX: clientX, startY: clientY,
    startLeft: rect.left, startTop: rect.top,
    startWidth: rect.width, startHeight: rect.height,
  });
}

function handleResizeMove(clientX, clientY) {
  const r = resizeState;
  const dx = clientX - r.startX;
  const dy = clientY - r.startY;
  const dir = r.direction;

  let { startLeft: left, startTop: top, startWidth: w, startHeight: h } = r;

  if (dir.includes("e")) w = Math.max(MIN_WIDTH,  r.startWidth  + dx);
  if (dir.includes("w")) { w = Math.max(MIN_WIDTH, r.startWidth - dx); left = r.startLeft + (r.startWidth - w); }
  if (dir.includes("s")) h = Math.max(MIN_HEIGHT, r.startHeight + dy);
  if (dir.includes("n")) { h = Math.max(MIN_HEIGHT, r.startHeight - dy); top = r.startTop + (r.startHeight - h); }

  Object.assign(r.el.style, {
    left: `${left}px`, top: `${top}px`,
    width: `${w}px`, height: `${h}px`,
  });
}
