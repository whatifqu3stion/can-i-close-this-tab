// The story remains fully readable without JavaScript.
const chapters = [...document.querySelectorAll('.chapter')];
const chapterLinks = [...document.querySelectorAll('.toc a')];
function markReadingPosition() {
  const current = chapters.filter(section => section.getBoundingClientRect().top <= innerHeight * 0.35).pop();
  for (const link of chapterLinks) {
    if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let queued = false;
window.addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    markReadingPosition();
    queued = false;
  });
}, {passive: true});
markReadingPosition();
