/**
 * Reveal-on-scroll. The hidden state only applies under `html.js` and when the
 * user allows motion (see global.css), so this script can never hide content.
 *
 * Two mechanisms work together:
 *  - an IntersectionObserver reveals elements as they scroll into view;
 *  - a cheap sweep on scroll/hash changes reveals anything already at or above
 *    the viewport, so anchor jumps (e.g. "Contact") never leave blank sections.
 */
function initReveal(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const pending = new Set(targets);

  const show = (el: HTMLElement, delay = 0) => {
    if (!pending.has(el)) return;
    if (delay > 0) el.style.transitionDelay = `${delay}ms`;
    el.classList.add('is-visible');
    pending.delete(el);
    observer.unobserve(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          show(el, Number(el.dataset.revealDelay ?? 0));
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  targets.forEach((el) => observer.observe(el));

  // Reveal everything whose top edge is at or above the bottom of the viewport.
  const sweep = () => {
    const limit = window.innerHeight;
    for (const el of Array.from(pending)) {
      if (el.getBoundingClientRect().top < limit) show(el);
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking || pending.size === 0) return;
    ticking = true;
    requestAnimationFrame(() => {
      sweep();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(sweep, 50));
  window.addEventListener('resize', onScroll);
  // Page may load scrolled (hash URL or restored position).
  if (window.scrollY > 0 || location.hash) setTimeout(sweep, 50);
}

initReveal();
