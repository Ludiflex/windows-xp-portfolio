// Desktop interactions - icon double-click, context menu, selection
import { openWindow } from "./windowManager.js";

export function initDesktop() {
  const desktop = document.getElementById("desktop");
  const icons = document.querySelectorAll(".desktop-icon");
  const contextMenu = document.getElementById("context-menu");

  // Double-click to open windows
  icons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      icons.forEach((i) => i.classList.remove("selected"));
      icon.classList.add("selected");
    });

    icon.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      const windowId = icon.dataset.window;
      if (windowId) openWindow(windowId);
    });
  });

  // Click on desktop to deselect icons
  desktop.addEventListener("click", (e) => {
    if (e.target === desktop || e.target.id === "desktop-icons") {
      icons.forEach((i) => i.classList.remove("selected"));
    }
    contextMenu.classList.add("hidden");
  });

  // Right-click context menu
  desktop.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".xp-window") || e.target.closest("#taskbar")) return;
    e.preventDefault();
    contextMenu.style.left = `${Math.min(e.clientX, window.innerWidth - 180)}px`;
    contextMenu.style.top = `${Math.min(e.clientY, window.innerHeight - 200)}px`;
    contextMenu.classList.remove("hidden");
  });

  // Context menu actions
  contextMenu.querySelectorAll(".context-menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.action;
      contextMenu.classList.add("hidden");
      switch (action) {
        case "refresh":
          desktop.style.opacity = "0.5";
          setTimeout(() => {
            desktop.style.opacity = "1";
          }, 200);
          break;
        case "properties":
          openWindow("mycomputer");
          break;
        case "about":
        case "projects":
        case "skills":
        case "contact":
          openWindow(action);
          break;
      }
    });
  });

  window.addEventListener("resize", () => contextMenu.classList.add("hidden"));
}
