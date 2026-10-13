# saifalomari99.github.io

Engineering portfolio of Saif Alomari. Live at **https://saifalomari99.github.io**.

Built with Astro, TypeScript, and Tailwind CSS. Deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml` on every push to `main`.

## Commands

```bash
npm install      # once (Node 22+)
npm run dev      # local preview at http://localhost:4321
npm run verify   # type-check, build, and link check
```

## Editing content

| What | Where |
|------|-------|
| Name, title, intro, links, navigation | `src/data/site.ts` |
| Projects | `src/content/projects/<slug>/index.md` + `images/` (copy `_template/` to start one) |
| Project order | `order` in each project's frontmatter, lower first |
| Skills and their icons | `src/data/skills.ts` + `src/assets/skills/` |
| Portrait photo | `src/assets/portrait.jpg` |

Run images through `node scripts/optimize-images.mjs --src <folder> --out <images folder>` before adding them.
