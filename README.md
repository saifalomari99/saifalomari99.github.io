# saifalomari99.github.io

Personal engineering portfolio of Saif Alomari, Embedded Firmware & FPGA Engineer.
Live site: **https://saifalomari99.github.io**

Built with [Astro](https://astro.build) 7, TypeScript, and Tailwind CSS 4. A single scrolling page (hero, projects, skills, contact) plus one detail page per project. The site is deliberately project-focused; work history, education, and skills live on LinkedIn. Fully static, light theme, no backend, no client-side framework, deployed to GitHub Pages by GitHub Actions.

## Quick start

```bash
npm install          # once (Node 22.12+ required)
npm run dev          # http://localhost:4321 with live reload
npm run build        # static output in dist/
npm run preview      # serve dist/ locally
npm run verify       # type-check + build + internal link check (what CI runs)
```

## Where content lives

Everything a visitor reads is data, not markup. Edit these files; the components render them.

| What | File |
|------|------|
| Name, title, description, social links, section navigation | `src/data/site.ts` |
| Hero intro | `src/data/site.ts` (`summary`) |
| Technical skills (groups, items, icons) | `src/data/skills.ts` + `src/assets/skills/*.svg` |
| Schools listed in the structured-data (SEO) markup | `src/data/education.ts` |
| Project categories (filter buttons) | `src/data/categories.ts` |
| Projects (one folder each) | `src/content/projects/<slug>/index.md` + `images/` |
| Articles (section appears when the first one is published) | `src/content/writing/<slug>.md` |
| Portrait photo | `src/assets/portrait.jpg` |
| Favicon, Open Graph image, robots.txt | `public/` |

The resume is intentionally not hosted on the site.

## Add a project

1. Copy `src/content/projects/_template/` to `src/content/projects/<slug>/`. The folder name becomes the URL (`/projects/<slug>/`); use lowercase letters and dashes.
2. Fill in the frontmatter. Required: `title`, `tagline`, `summary`, `category`, `type`, `dates.start`. Set `draft: false` (or delete the line) to publish. Field meanings are documented in the template and validated at build time by `src/content.config.ts`; a typo in a category name fails the build with a clear message.
3. Add images. Put originals anywhere outside the repo, then run the optimizer so only web-sized, metadata-stripped copies are committed:

   ```bash
   node scripts/optimize-images.mjs --src "C:/path/to/originals" --out src/content/projects/<slug>/images
   ```

   Then reference them in frontmatter as `./images/<name>.jpg` with meaningful `alt` text. The first image should be named `hero.*`. To show a logo or diagram on the card instead of the hero photo, add a `thumbnail` with `fit: contain` (see RTLStation).
4. Write the body under the standard headings (Overview, Problem, Architecture, Features, Engineering decisions and challenges, Results, My contribution). Omit headings that do not apply.
5. Run `npm run verify`.

### Feature, reorder, or demote a project

All projects share one card size. `order` alone decides the position in the gallery (lower first; existing projects use 10, 20, 30, ... so a new one can slot in between). `tier: featured` adds a Featured badge to the card and does not affect ordering.

### Categories and filters

Categories are defined once in `src/data/categories.ts`. Adding an entry there makes it available in project frontmatter (`category` and `tags`) and adds a filter button.

## Update the intro, About paragraph, or focus areas

Edit `summary` in `src/data/site.ts`.

## Add a skill

Add an entry to the right group in `src/data/skills.ts` and point `icon` at an SVG file name in `src/assets/skills/` (drop a new 24x24 SVG there if needed; brand marks can be fetched from https://simpleicons.org, which is CC0). The build fails with a clear message if an icon file is missing.

## Replace the photo

Overwrite `src/assets/portrait.jpg` with a 4:5 portrait around 1200 px wide (run it through `scripts/optimize-images.mjs` first to strip metadata). The hero crops it to 4:5 automatically.

## Add an article

Create `src/content/writing/<slug>.md` (see `example-article.md`, which is a draft and is not published):

```markdown
---
title: "Title"
description: "One or two sentences."
pubDate: 2026-11-01
tags: ["FPGA", "CDC"]
---
Article body in Markdown.
```

The Writing section, its navigation link, and the article list appear automatically once at least one non-draft article exists.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, type-checks, builds, verifies internal links, and publishes `dist/` to GitHub Pages.

**One-time repository setting:** in GitHub go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. With the default "Deploy from a branch" setting GitHub would try to publish the raw source tree with Jekyll instead of the built site.

Because this is a user site (`<username>.github.io`), it is served from the root URL and needs no `base` path configuration.

## Project structure

```
.github/workflows/deploy.yml   CI build and Pages deploy
astro.config.mjs               site URL, trailing slashes, sitemap, Tailwind
scripts/
  optimize-images.mjs          resize + strip metadata before committing images
  check-links.mjs              validates links/assets/anchors in dist/ (CI gate)
  make-brand-assets.mjs        regenerates the OG image, touch icon, and PNG favicon
  make-prompt-critic-figure.mjs regenerates the Prompt Critic Agent card image
public/                        static files copied as-is (favicon, robots.txt)
src/
  assets/portrait.jpg          hero photo
  assets/skills/*.svg          skill icons (Simple Icons brand marks + line icons)
  content.config.ts            Zod schemas for projects and writing
  content/projects/<slug>/     project Markdown + images
  content/writing/             articles
  data/                        site config, categories, education (SEO markup only)
  lib/                         project/article queries and date formatting
  components/                  UI components (project card, filter, meta, gallery, circuit background, ...)
  layouts/BaseLayout.astro     HTML shell, head metadata, nav, footer
  pages/                       index (the single page), projects/[slug], writing, 404
  scripts/                     small client scripts (nav toggle, filter, scroll reveal)
  styles/                      Tailwind theme tokens and prose styles
```

## Conventions

- Section links use `/#section` so they work from project pages as well as the home page. Internal page links end with a trailing slash (`/projects/<slug>/`); the link checker flags exceptions.
- File and folder names are lowercase; the CI runner is case-sensitive even though Windows is not.
- Do not commit originals of photos. Run the optimizer; keep each image under about 500 KB.
- Only state results that are documented in the source repository or the resume.

## Troubleshooting

- **`npm install` fails with EPERM/EBUSY on OneDrive:** pause OneDrive syncing during installs, or mark the repo folder "Always keep on this device". `node_modules/` is git-ignored.
- **Build fails on a project entry:** the error names the file and the invalid field; check category names against `src/data/categories.ts` and image paths against the `images/` folder.
- **A page 404s in dev:** the link is probably missing its trailing slash.
