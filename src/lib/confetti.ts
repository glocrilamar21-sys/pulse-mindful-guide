import confetti from "canvas-confetti";

/**
 * Fires a gold-themed confetti burst to celebrate a new gold medal.
 * Designed to be short (~1.2 s) and subtle enough to layer on top
 * of in-game UI without obscuring it.
 */
export function fireGoldConfetti(): void {
  const goldPalette = ["#ffd700", "#ffec8b", "#ffb700", "#fff3b0", "#daa520"];

  // Initial burst from center
  confetti({
    particleCount: 120,
    spread: 90,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
    colors: goldPalette,
    scalar: 1.1,
    ticks: 200,
  });

  // Side cannons for extra flourish
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: goldPalette,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: goldPalette,
    });
  }, 200);
}
