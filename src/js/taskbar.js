// Taskbar - manages task buttons, clock, start menu interaction
import { toggleMinimizeRestore, openWindow, playSound } from "./windowManager.js";

const taskButtons = new Map();

export function initTaskbar() {
  const container = document.getElementById("taskbar-buttons");
  const clock = document.getElementById("clock");

  // Update clock
  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    clock.textContent = `${h12}:${m} ${ampm}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // Listen for window events
  window.addEventListener("window-opened", (e) => {
    const { id, title, icon } = e.detail;
    if (taskButtons.has(id)) return;
    const btn = document.createElement("button");
    btn.className = "taskbar-btn active";
    btn.dataset.windowId = id;
    btn.innerHTML = `<img class="taskbar-btn-icon" src="${icon}" alt="" draggable="false" /><span class="taskbar-btn-text">${title}</span>`;
    btn.addEventListener("click", () => toggleMinimizeRestore(id));
    container.appendChild(btn);
    taskButtons.set(id, btn);
  });

  window.addEventListener("window-closed", (e) => {
    const { id } = e.detail;
    const btn = taskButtons.get(id);
    if (btn) {
      btn.remove();
      taskButtons.delete(id);
    }
  });

  window.addEventListener("window-focused", (e) => {
    const { id } = e.detail;
    taskButtons.forEach((btn, bid) => {
      btn.classList.toggle("active", bid === id);
    });
  });

  window.addEventListener("window-minimized", (e) => {
    const { id } = e.detail;
    const btn = taskButtons.get(id);
    if (btn) btn.classList.remove("active");
  });

  window.addEventListener("window-restored", (e) => {
    const { id } = e.detail;
    const btn = taskButtons.get(id);
    if (btn) btn.classList.add("active");
  });
}

// Start Menu
export function initStartMenu() {
  const startBtn = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasHidden = startMenu.classList.contains("hidden");
    startMenu.classList.toggle("hidden");
    startBtn.classList.toggle("active", wasHidden);
    if (wasHidden) {
      startMenu.classList.add("opening");
      setTimeout(() => startMenu.classList.remove("opening"), 150);
      playSound("click");
    }
  });

  // Close start menu on outside click
  document.addEventListener("click", (e) => {
    if (
      !startMenu.contains(e.target) &&
      e.target !== startBtn &&
      !startBtn.contains(e.target)
    ) {
      startMenu.classList.add("hidden");
      startBtn.classList.remove("active");
    }
  });

  // Start menu items open windows
  startMenu.querySelectorAll(".start-menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const windowId = item.dataset.window;
      if (windowId) {
        openWindow(windowId);
      }
      startMenu.classList.add("hidden");
      startBtn.classList.remove("active");
    });
  });

  // Log Off button - reload page
  const logoffBtn = document.getElementById("start-logoff");
  if (logoffBtn) {
    logoffBtn.addEventListener("click", () => {
      startMenu.classList.add("hidden");
      startBtn.classList.remove("active");
      location.reload();
    });
  }

  // Shutdown button
  const shutdownBtn = document.getElementById("start-shutdown");
  if (shutdownBtn) {
    shutdownBtn.addEventListener("click", () => {
      startMenu.classList.add("hidden");
      startBtn.classList.remove("active");
      showShutdown();
    });
  }
}

function showShutdown() {
  // Use the shutdown screen from HTML if it exists, otherwise create one
  let screen = document.getElementById("shutdown-screen");
  if (!screen) {
    screen = document.createElement("div");
    screen.id = "shutdown-screen";
    screen.innerHTML = `<div class="shutdown-text">Windows is shutting down...</div>`;
    document.body.appendChild(screen);
  } else {
    screen.innerHTML = `<div class="shutdown-text">Windows is shutting down...</div>`;
  }
  screen.classList.add("active");

  setTimeout(() => {
    screen.innerHTML = `
      <div class="shutdown-text">It is now safe to turn off your computer.</div>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:16px;font-family:Tahoma,sans-serif">Click anywhere to restart.</p>
    `;
    screen.addEventListener("click", () => {
      screen.classList.remove("active");
      setTimeout(() => location.reload(), 600);
    }, { once: true });
  }, 2000);
}
