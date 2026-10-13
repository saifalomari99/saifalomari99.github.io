/**
 * Project categories used for filtering. The tuple is written literally so
 * Zod can derive a non-empty enum from it. Add a category here and it becomes
 * available in project frontmatter and in the gallery filter.
 */
export const CATEGORY_IDS = [
  'fpga-rtl',
  'embedded-firmware',
  'hw-sw-integration',
  'software',
  'ml-ai',
  'coursework',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORIES: ReadonlyArray<{ id: CategoryId; label: string; short: string }> = [
  { id: 'fpga-rtl', label: 'FPGA / RTL Design', short: 'FPGA / RTL' },
  { id: 'embedded-firmware', label: 'Embedded Firmware', short: 'Firmware' },
  { id: 'hw-sw-integration', label: 'Hardware / Software Integration', short: 'HW/SW Integration' },
  { id: 'software', label: 'Software & Engineering Tools', short: 'Software' },
  { id: 'ml-ai', label: 'Machine Learning', short: 'ML' },
  { id: 'coursework', label: 'Academic Coursework', short: 'Coursework' },
];

export function categoryLabel(id: CategoryId, short = false): string {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? (short ? c.short : c.label) : id;
}

export const PROJECT_TYPES = ['professional', 'research', 'original', 'coursework', 'team-coursework'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const TYPE_LABELS: Record<ProjectType, string> = {
  professional: 'Professional',
  research: 'Research',
  original: 'Personal project',
  coursework: 'Coursework',
  'team-coursework': 'Team coursework',
};

export const TIERS = ['featured', 'standard', 'minor'] as const;
export type Tier = (typeof TIERS)[number];
