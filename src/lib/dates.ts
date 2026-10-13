const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats "YYYY-MM" as "Mon YYYY", "YYYY" as itself, and leaves other text unchanged. */
function formatMonth(value: string | null | undefined): string {
  if (!value) return 'Present';
  if (value.toLowerCase() === 'present') return 'Present';
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (m) {
    const month = MONTHS[Number(m[2]) - 1] ?? '';
    return `${month} ${m[1]}`.trim();
  }
  return value;
}

/** "Feb 2025 – Present", "2023", or "Spring 2024". */
export function formatRange(start: string, end?: string | null): string {
  const s = formatMonth(start);
  if (end === undefined) return s;
  const e = formatMonth(end);
  return s === e ? s : `${s} – ${e}`;
}

export function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
