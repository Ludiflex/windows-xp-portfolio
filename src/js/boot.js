// Boot screen animation
export function initBoot(onComplete) {
  const bootScreen = document.getElementById("boot-screen");
  if (!bootScreen) {
    onComplete();
    return;
  }

  // Show boot for 2.5 seconds then fade out
  setTimeout(() => {
    bootScreen.classList.add("boot-done");
    setTimeout(() => {
      bootScreen.style.display = "none";
      onComplete();
    }, 800);
  }, 2500);
}
