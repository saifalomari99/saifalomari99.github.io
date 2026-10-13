#!/usr/bin/env node
/**
 * Verifies the built site in dist/:
 *   - every internal href / src / srcset target exists as a file
 *   - internal page links end with "/" (matches trailingSlash: 'always')
 *   - in-page anchors (#id) resolve to an element id on the target page
 * Exit code 1 on any failure so CI blocks the deploy.
 *
 * Optional: `node scripts/check-links.mjs --external` also HEAD-requests each
 * unique external URL and reports non-2xx/3xx responses (does not fail the run).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const checkExternal = process.argv.includes('--external');

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/** Map a site-absolute URL path to a file on disk (directory -> index.html). */
async function resolveTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const direct = path.join(DIST, clean);
  if (clean.endsWith('/')) return (await exists(path.join(direct, 'index.html'))) ? path.join(direct, 'index.html') : null;
  if (await exists(direct)) {
    const stat = await fs.stat(direct);
    if (stat.isFile()) return direct;
    if (stat.isDirectory() && (await exists(path.join(direct, 'index.html')))) return path.join(direct, 'index.html');
  }
  if (await exists(direct + '.html')) return direct + '.html';
  return null;
}

const ATTR_RE = /\b(href|src|srcset|content|action|poster)\s*=\s*"([^"]*)"/gi;
const ID_RE = /\bid\s*=\s*"([^"]+)"/g;

const idCache = new Map();
async function idsOf(file) {
  if (idCache.has(file)) return idCache.get(file);
  const html = await fs.readFile(file, 'utf8');
  const ids = new Set();
  for (const m of html.matchAll(ID_RE)) ids.add(m[1]);
  idCache.set(file, ids);
  return ids;
}

async function main() {
  if (!(await exists(DIST))) {
    console.error('dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }
  const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
  const problems = [];
  const externals = new Set();
  let checked = 0;

  for (const file of files) {
    const html = await fs.readFile(file, 'utf8');
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const pageDir = '/' + rel.replace(/index\.html$/, '').replace(/[^/]+\.html$/, '');

    for (const m of html.matchAll(ATTR_RE)) {
      const attr = m[1].toLowerCase();
      const raw = m[2].trim();
      if (!raw) continue;
      const candidates = attr === 'srcset' ? raw.split(',').map((s) => s.trim().split(/\s+/)[0]) : [raw];

      for (const value of candidates) {
        if (!value) continue;
        if (/^(mailto:|tel:|javascript:|data:)/i.test(value)) continue;
        if (/^https?:\/\//i.test(value)) {
          if (!value.startsWith('https://saifalomari99.github.io')) {
            externals.add(value);
            continue;
          }
        }
        // content="" is only interesting for og:/twitter: image + canonical URLs
        if (attr === 'content' && !/^https?:\/\/saifalomari99\.github\.io\//.test(value)) continue;

        let urlPath = value.replace(/^https?:\/\/saifalomari99\.github\.io/, '');
        if (urlPath.startsWith('#')) {
          const ids = await idsOf(file);
          if (!ids.has(urlPath.slice(1))) problems.push(`${rel}: missing anchor target ${value}`);
          checked++;
          continue;
        }
        if (!urlPath.startsWith('/')) urlPath = path.posix.join(pageDir, urlPath);

        const [pathPart, hash] = urlPath.split('#');
        const target = await resolveTarget(pathPart);
        checked++;
        if (!target) {
          problems.push(`${rel}: broken ${attr} -> ${value}`);
          continue;
        }
        const isPage = target.endsWith('index.html');
        if (isPage && !pathPart.endsWith('/') && !pathPart.endsWith('.html')) {
          problems.push(`${rel}: internal link without trailing slash -> ${value}`);
        }
        if (hash && isPage) {
          const ids = await idsOf(target);
          if (!ids.has(hash)) problems.push(`${rel}: anchor #${hash} not found on ${pathPart}`);
        }
      }
    }
  }

  console.log(`Checked ${checked} internal references across ${files.length} pages.`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    for (const p of problems) console.error('  ' + p);
  } else {
    console.log('No broken internal links, assets, or anchors.');
  }

  if (checkExternal) {
    console.log(`\nChecking ${externals.size} external URL(s)...`);
    for (const url of [...externals].sort()) {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
        // 405 = server refuses HEAD (LinkedIn does this); the page itself exists.
        const ok = res.status < 400 || res.status === 405;
        console.log(`  ${ok ? 'ok ' : 'BAD'} ${res.status} ${url}${res.status === 405 ? ' (HEAD not allowed)' : ''}`);
      } catch (err) {
        console.log(`  ERR     ${url} (${err.message})`);
      }
    }
  }

  process.exit(problems.length ? 1 : 0);
}

main();
