#!/usr/bin/env node
/**
 * One-time generator for brand assets in public/:
 *   - og-default.png (1200x630)  default Open Graph / social preview image
 *   - apple-touch-icon.png (180x180) and favicon-32.png
 * favicon.svg is hand-written. Re-run after editing the SVG strings below.
 */
import { promises as fs } from 'node:fs';
import sharp from 'sharp';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const NAME = esc('Saif Alomari');
const ROLE = esc('Embedded Firmware & FPGA Engineer');
const URL = 'saifalomari99.github.io';
const FONT = "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#0e7490"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.9" cy="0.05" r="0.6">
      <stop offset="0" stop-color="#2563eb" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#fafbfc"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="92" cy="104" r="10" fill="#2563eb"/>
  <text x="118" y="112" font-family="${FONT}" font-size="26" font-weight="600" fill="#475569">${URL}</text>
  <text x="80" y="310" font-family="${FONT}" font-size="80" font-weight="700" letter-spacing="-2" fill="#0f172a">${NAME}</text>
  <text x="80" y="374" font-family="${FONT}" font-size="36" font-weight="600" fill="url(#accent)">${ROLE}</text>
  <text x="80" y="440" font-family="${FONT}" font-size="24" fill="#475569">RTL design · FPGA architecture · Embedded firmware · Verification · Engineering tools</text>
  <line x1="80" y1="520" x2="1120" y2="520" stroke="#e2e8f0" stroke-width="2"/>
  <text x="80" y="566" font-family="${FONT}" font-size="22" fill="#64748b">Magna Electronics · M.S. ECE, UC Santa Barbara · Goleta, CA</text>
</svg>`;

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#2563eb"/>
  <text x="90" y="116" text-anchor="middle" font-family="${FONT}" font-size="72" font-weight="700" fill="#ffffff">SA</text>
</svg>`;

async function main() {
  await fs.mkdir('public', { recursive: true });
  await sharp(Buffer.from(og), { density: 144 }).resize(1200, 630).png({ compressionLevel: 9 }).toFile('public/og-default.png');
  await sharp(Buffer.from(icon), { density: 144 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(Buffer.from(icon), { density: 144 }).resize(32, 32).png().toFile('public/favicon-32.png');
  console.log('Wrote public/og-default.png, public/apple-touch-icon.png, and public/favicon-32.png');
}

main();
