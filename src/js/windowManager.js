// =============================================================================
//  Window Manager — Core Engine
//  Responsible for creating windows and dispatching lifecycle events.
//  Interaction logic lives in windowEvents.js.
//  Content rendering lives in windowContent.js.
//  Personal data lives in config.js.
// =============================================================================

import { WINDOW_SIZES, USER } from "./config.js";
import { getWindowContent } from "./windowContent.js";
import { playSound } from "./sound.js";
import {
  bindWindowEvents,
  focusWindow,
  restoreWindow,
  minimizeWindow,
  toggleMinimizeRestore,
  toggleMaximize,
  closeWindow,
} from "./windowEvents.js";

// ── Shared state (passed into windowEvents functions) ─────────────────────────
export const state = {
  /** @type {Map<string, { el: HTMLElement, minimized: boolean, maximized: boolean, restoreRect: object|null }>} */
  windows: new Map(),

  /** Current highest z-index in use */
  zIndex: 100,

  /** ID of the currently focused window, or null */
  activeWindowId: null,
};

// ── Window configuration ───────────────────────────────────────────────────────

/**
 * Maps a window ID to its title, icon path, and default size.
 * Sizes come from config.js so they're easy to tweak.
 */
const WINDOW_CONFIG = {
  about: {
    title: "About Me",
    icon: "/src/assets/desktop/about.webp",
    ...WINDOW_SIZES.about,
  },
  projects: {
    title: "Projects",
    icon: "/src/assets/desktop/projects.webp",
    ...WINDOW_SIZES.projects,
  },
  skills: {
    title: "Skills",
    icon: "/src/assets/desktop/Command Prompt.png",
    ...WINDOW_SIZES.skills,
  },
  resume: {
    title: "Resume",
    icon: "/src/assets/desktop/resume.webp",
    ...WINDOW_SIZES.resume,
  },
  contact: {
    title: "Contact",
    icon: "/src/assets/desktop/contact.webp",
    ...WINDOW_SIZES.contact,
  },
  mycomputer: {
    title: "My Computer",
    icon: "/src/assets/desktop/My Videos.png",
    ...WINDOW_SIZES.mycomputer,
  },
};

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Open a window by ID. If it already exists, restore and focus it.
 * @param {string} id  One of the keys in WINDOW_CONFIG above.
 */
export function openWindow(id) {
  // Re-focus / un-minimise an already-open window
  if (state.windows.has(id)) {
    const win = state.windows.get(id);
    if (win.minimized) restoreWindow(id, state);
    focusWindow(id, state);
    return;
  }

  const config = WINDOW_CONFIG[id];
  if (!config) {
    console.warn(`[WindowManager] Unknown window id: "${id}"`);
    return;
  }

  const container = document.getElementById("windows-container");
  const el = createWindowElement(id, config);
  container.appendChild(el);

  state.windows.set(id, { el, minimized: false, maximized: false, restoreRect: null });

  // Focus the new window
  state.windows.forEach((win) => win.el.classList.remove("focused"));
  el.classList.add("focused");
  state.activeWindowId = id;

  // Attach all interaction listeners
  bindWindowEvents(id, el, state);

  // Notify the taskbar and other listeners
  window.dispatchEvent(new CustomEvent("window-opened", {
    detail: { id, title: config.title, icon: config.icon },
  }));
  window.dispatchEvent(new CustomEvent("window-focused", { detail: { id } }));

  playSound("open");
}

/** Expose toggleMinimizeRestore for the taskbar buttons */
export { toggleMinimizeRestore };

/** Re-export sound utilities so main.js only needs one import source */
export { playSound } from "./sound.js";
export { toggleSound, isSoundEnabled } from "./sound.js";

/** Re-export handleMouseMove / handleMouseUp for the global listeners in main.js */
export { handleMouseMove, handleMouseUp } from "./windowEvents.js";

// ── Internal helpers ───────────────────────────────────────────────────────────

/**
 * Build the full DOM element for an XP-style window.
 * @param {string} id
 * @param {{ title: string, icon: string, width: number, height: number }} config
 * @returns {HTMLElement}
 */
function createWindowElement(id, config) {
  state.zIndex += 1;

  // Cascade windows so they don't all stack on the exact same spot
  const offset = state.windows.size % 5;
  const left = 60 + offset * 30;
  const top  = 40 + offset * 30;

  const isResume = id === "resume";
  const bodyClass = isResume ? "xp-window-body white pdf-viewer" : "xp-window-body";

  const el = document.createElement("div");
  el.className = "xp-window focused";
  el.id = `window-${id}`;
  el.dataset.windowId = id;
  el.style.cssText = `
    width: ${config.width}px;
    height: ${config.height}px;
    left: ${left}px;
    top: ${top}px;
    z-index: ${state.zIndex};
  `;

  el.innerHTML = buildWindowShell(id, config, bodyClass);
  return el;
}

/**
 * Returns the inner HTML template for a window frame.
 * The address bar path uses the user's name from config.js.
 */
function buildWindowShell(id, config, bodyClass) {
  return `
    <div class="xp-window-titlebar">
      <img class="xp-window-titlebar-icon" src="${config.icon}" alt="" draggable="false" />
      <span class="xp-window-titlebar-text">${config.title}</span>
      <div class="xp-window-controls">
        <button class="xp-window-btn xp-window-btn-minimize" title="Minimize"  aria-label="Minimize"></button>
        <button class="xp-window-btn xp-window-btn-maximize" title="Maximize"  aria-label="Maximize"></button>
        <button class="xp-window-btn xp-window-btn-close"   title="Close"     aria-label="Close"></button>
      </div>
    </div>

    <div class="xp-window-menubar">
      <div class="xp-window-menubar-item">File</div>
      <div class="xp-window-menubar-item">Edit</div>
      <div class="xp-window-menubar-item">View</div>
      <div class="xp-window-menubar-item">Favorites</div>
      <div class="xp-window-menubar-item">Tools</div>
      <div class="xp-window-menubar-item">Help</div>
    </div>

    <div class="xp-window-toolbar">
      <div class="xp-toolbar-btn">
        <img class="xp-toolbar-btn-icon" src="/src/assets/desktop/back.svg" alt="" />
        <span class="xp-toolbar-btn-text">Back</span>
      </div>
      <div class="xp-toolbar-btn">
        <img class="xp-toolbar-btn-icon" src="/src/assets/desktop/forward.svg" alt="" />
        <span class="xp-toolbar-btn-text">Forward</span>
      </div>
      <div class="xp-toolbar-separator"></div>
      <div class="xp-toolbar-btn">
        <img class="xp-toolbar-btn-icon" src="/src/assets/desktop/search.svg" alt="" />
        <span class="xp-toolbar-btn-text">Search</span>
      </div>
      <div class="xp-toolbar-btn">
        <img class="xp-toolbar-btn-icon" src="/src/assets/desktop/folders.svg" alt="" />
        <span class="xp-toolbar-btn-text">Folders</span>
      </div>
    </div>

    <div class="xp-window-addressbar">
      <span class="xp-window-addressbar-label">Address</span>
      <div class="xp-window-addressbar-container">
        <img class="xp-window-addressbar-icon" src="${config.icon}" alt="" />
        <input
          type="text"
          class="xp-window-addressbar-input"
          value="C:\\Documents and Settings\\${USER.name}\\${config.title}"
          readonly
        />
      </div>
      <div class="xp-window-addressbar-go">
        <img src="/src/assets/desktop/go-arrow.svg" alt="" />
        <span>Go</span>
      </div>
    </div>

    <div class="${bodyClass}">
      ${getWindowContent(id)}
    </div>

    <div class="xp-window-statusbar">
      <span class="xp-window-statusbar-cell">Done</span>
      <span class="xp-window-statusbar-cell" style="width:100px">My Computer</span>
    </div>

    <div class="xp-resize-n"></div>
    <div class="xp-resize-s"></div>
    <div class="xp-resize-e"></div>
    <div class="xp-resize-w"></div>
    <div class="xp-resize-ne"></div>
    <div class="xp-resize-nw"></div>
    <div class="xp-resize-se"></div>
    <div class="xp-resize-sw"></div>
  `;
}
