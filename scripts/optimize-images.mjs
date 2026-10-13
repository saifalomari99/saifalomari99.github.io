#!/usr/bin/env node
/**
 * Prepare images for the repository: downscale, apply EXIF rotation, strip all
 * metadata (including GPS), and re-encode. Run this BEFORE committing photos.
 *
 * Usage:
 *   node scripts/optimize-images.mjs --src <file|dir> --out <dir> [--max 1600] [--quality 82]
 *   node scripts/optimize-images.mjs --manifest list.json
 *
 * Manifest format: [{ "src": "C:/path/photo.jpeg", "out": "src/content/projects/slug/images/hero.jpg", "max": 1600 }]
 * The output extension decides the encoder: .jpg/.jpeg -> mozjpeg, .png -> lossless PNG, .webp -> webp.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = parseArgs(process.argv.slice(2));
const DEFAULT_MAX = Number(args.max ?? 1600);
const DEFAULT_QUALITY = Number(args.quality ?? 82);
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.gif', '.avif']);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

function fmt(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

async function optimizeOne(src, out, max = DEFAULT_MAX, quality = DEFAULT_QUALITY) {
  const ext = path.extname(out).toLowerCase();
  await fs.mkdir(path.dirname(out), { recursive: true });
  const input = await fs.readFile(src);
  let pipeline = sharp(input, { failOn: 'none' })
    .rotate() // bake EXIF orientation before metadata is dropped
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true });

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.flatten({ background: '#ffffff' }).jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, effort: 8 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality });
  } else {
    throw new Error(`Unsupported output extension "${ext}" for ${out}`);
  }

  const { info } = await pipeline.toBuffer({ resolveWithObject: true }).then(async (r) => {
    await fs.writeFile(out, r.data);
    return r;
  });
  const after = (await fs.stat(out)).size;
  console.log(`${path.basename(src)} -> ${out}  ${fmt(input.length)} -> ${fmt(after)}  (${info.width}x${info.height})`);
}

async function main() {
  const jobs = [];

  if (args.manifest) {
    const list = JSON.parse(await fs.readFile(args.manifest, 'utf8'));
    for (const item of list) jobs.push({ src: item.src, out: item.out, max: item.max, quality: item.quality });
  } else if (args.src && args.out) {
    const stat = await fs.stat(args.src);
    if (stat.isDirectory()) {
      const files = (await fs.readdir(args.src)).filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()));
      for (const f of files) {
        const ext = path.extname(f).toLowerCase();
        const outExt = args.png ? '.png' : ext === '.png' ? '.png' : '.jpg';
        const base = path.basename(f, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        jobs.push({ src: path.join(args.src, f), out: path.join(args.out, base + outExt) });
      }
    } else {
      const outIsFile = path.extname(args.out) !== '';
      const out = outIsFile ? args.out : path.join(args.out, path.basename(args.src));
      jobs.push({ src: args.src, out });
    }
  } else {
    console.error('Usage: --src <file|dir> --out <dir|file> [--max N] [--quality N]  |  --manifest list.json');
    process.exit(1);
  }

  let failed = 0;
  for (const job of jobs) {
    try {
      await optimizeOne(job.src, job.out, job.max ?? DEFAULT_MAX, job.quality ?? DEFAULT_QUALITY);
    } catch (err) {
      failed++;
      console.error(`FAILED ${job.src}: ${err.message}`);
    }
  }
  console.log(`\nDone: ${jobs.length - failed} ok, ${failed} failed.`);
  if (failed) process.exit(1);
}

main();
