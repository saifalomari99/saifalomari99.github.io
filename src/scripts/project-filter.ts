/**
 * Category filter for the projects gallery.
 * - Buttons carry data-category; cards carry data-category (primary) and data-tags.
 * - Hidden cards use the `hidden` attribute so reveal animations never interfere.
 * - The selection is mirrored to ?category= so filtered views can be linked.
 */
function initProjectFilter(): void {
  const root = document.querySelector<HTMLElement>('[data-filter]');
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button[data-category]'));
  const status = root.querySelector<HTMLElement>('[data-filter-status]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-project]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-project-group]'));
  const valid = new Set(buttons.map((b) => b.dataset.category ?? ''));
  const total = cards.length;

  const labelFor = (id: string) => buttons.find((b) => b.dataset.category === id)?.textContent?.trim() ?? id;

  const apply = (category: string, updateUrl: boolean) => {
    let shown = 0;
    for (const card of cards) {
      const primary = card.dataset.category ?? '';
      const tags = (card.dataset.tags ?? '').split(/\s+/).filter(Boolean);
      const match = category === 'all' || primary === category || tags.includes(category);
      card.hidden = !match;
      if (match) {
        shown++;
        card.classList.add('is-visible');
      }
    }
    // Hide section groups that have no visible cards.
    for (const group of groups) {
      const visible = group.querySelectorAll<HTMLElement>('[data-project]:not([hidden])').length;
      group.hidden = visible === 0;
    }
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.category === category));
    if (status) {
      status.textContent =
        category === 'all'
          ? `Showing all ${total} projects`
          : `Showing ${shown} of ${total} projects in ${labelFor(category)}`;
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      history.replaceState(null, '', url);
    }
  };

  for (const b of buttons) {
    b.addEventListener('click', () => apply(b.dataset.category ?? 'all', true));
  }

  const initial = new URLSearchParams(window.location.search).get('category') ?? 'all';
  apply(valid.has(initial) ? initial : 'all', false);
}

initProjectFilter();
