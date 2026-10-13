export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  description: string;
  url: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  version: string;
  /** Section links for the single-page layout; use "/#id" so they work from sub-pages too. */
  nav: NavItem[];
}

/** Schools listed in the Person structured-data markup (BaseHead). */
export interface EducationEntry {
  school: string;
  degree: string;
  field: string;
  emphasis?: string;
  start: string;
  end: string;
  expected?: boolean;
  location: string;
  honors?: string[];
  coursework?: string[];
  url?: string;
}
