function svgIcon(name) {
  const icons = {
    play: '<path d="M7 5v14l11-7-11-7Z" fill="currentColor"/>',
    pause: '<path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" fill="currentColor"/>',
    rotate:
      '<path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    timer:
      '<path d="M10 2h4M12 14l3-3M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "arrow-right":
      '<path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    plus:
      '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

export function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}
