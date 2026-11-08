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

// Move a copy, keeping the source visible. The example also works without motion.
async function illustrateCopy() {
  const transfer = document.querySelector('.transfer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!transfer || reducedMotion.matches || !Element.prototype.animate) return;
  await document.fonts.ready;
  if (reducedMotion.matches) return;
  const origin = transfer.querySelector('.origin');
  const target = transfer.querySelector('.destination');
  const start = origin.getBoundingClientRect();
  const finish = target.getBoundingClientRect();
  const frame = transfer.getBoundingClientRect();
  const copy = origin.cloneNode(true);
  copy.classList.add('transfer-ghost');
  copy.setAttribute('aria-hidden', 'true');
  copy.style.left = (start.left - frame.left) + 'px';
  copy.style.top = (start.top - frame.top) + 'px';
  transfer.append(copy);
  const movement = copy.animate([
    {opacity: 0, transform: 'translate(0, 0)'},
    {opacity: 1, transform: 'translate(0, 0)', offset: 0.2},
    {opacity: 1, transform: `translate(${finish.left-start.left}px, ${finish.top-start.top}px)`, offset: 0.82},
    {opacity: 0, transform: `translate(${finish.left-start.left}px, ${finish.top-start.top}px)`}
  ], {duration: 1700, easing: 'ease-in-out'});
  const stop = () => movement.cancel();
  reducedMotion.addEventListener('change', stop, {once: true});
  movement.finished.catch(() => {}).finally(() => {
    copy.remove();
    reducedMotion.removeEventListener('change', stop);
  });
}
illustrateCopy();
