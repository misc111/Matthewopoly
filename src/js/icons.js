export function svgIcon(name) {
  const icons = {
    play: '<path d="M7 5v14l11-7-11-7Z" fill="currentColor"/>',
    pause: '<path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" fill="currentColor"/>',
    rotate:
      '<path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    clock:
      '<path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    timer:
      '<path d="M10 2h4M12 14l3-3M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "arrow-right":
      '<path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    plus:
      '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "plus-circle":
      '<path d="M12 8v8M8 12h8M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "check-circle":
      '<path d="m8 12 2.5 2.5L16 9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "volume-2":
      '<path d="M11 5 6 9H3v6h3l5 4V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "volume-x":
      '<path d="M11 5 6 9H3v6h3l5 4V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m17 9 4 4m0-4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    palette:
      '<path d="M12 3a9 9 0 0 0 0 18h1.4a1.6 1.6 0 0 0 1.2-2.66 1.6 1.6 0 0 1 1.2-2.66H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="7.8" cy="10" r="1" fill="currentColor"/><circle cx="10.3" cy="7.5" r="1" fill="currentColor"/><circle cx="13.7" cy="7.5" r="1" fill="currentColor"/>',
    "book-open":
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3V5.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 19V5.5M12 3v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    download:
      '<path d="M12 3v11M8 10l4 4 4-4M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    history:
      '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    settings:
      '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05-2.12 2.12-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V20h-3v.4a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.05.05-2.12-2.12.05-.05A1.8 1.8 0 0 0 4.6 15 1.8 1.8 0 0 0 3 13.9H3v-3h.4A1.8 1.8 0 0 0 5 9.8a1.8 1.8 0 0 0-.36-1.98l-.05-.05 2.12-2.12.05.05A1.8 1.8 0 0 0 8.74 6a1.8 1.8 0 0 0 1.1-1.66V4h3v.4A1.8 1.8 0 0 0 14 6a1.8 1.8 0 0 0 1.98-.36l.05-.05 2.12 2.12-.05.05A1.8 1.8 0 0 0 17.74 9.8a1.8 1.8 0 0 0 1.66 1.1h.4v3h-.4A1.8 1.8 0 0 0 19.4 15Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
}

export function installIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = svgIcon(node.dataset.icon);
  });
}
