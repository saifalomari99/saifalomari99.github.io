#!/usr/bin/env node
/**
 * One-time generator for the Prompt Critic Agent card image: a simple diagram of
 * the critic loop (draft prompt -> LLM critic -> revised prompt, repeated).
 * Output: src/content/projects/prompt-critic-agent/images/hero.png
 */
import { promises as fs } from 'node:fs';
import sharp from 'sharp';

const FONT = "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'JetBrains Mono', 'Cascadia Mono', Consolas, monospace";

const box = (x, y, w, h, title, sub, fill, stroke, text) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 10}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${text}">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 32}" text-anchor="middle" font-family="${MONO}" font-size="19" fill="${text}" fill-opacity="0.75">${sub}</text>`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#475569"/>
    </marker>
    <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="#2563eb"/>
    </marker>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="1.4" fill="#2563eb" fill-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="1600" height="1000" fill="#fafbfc"/>
  <rect width="1600" height="1000" fill="url(#dots)"/>

  <text x="800" y="120" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="700" fill="#0f172a">Prompt Critic Loop</text>
  <text x="800" y="168" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#475569">An LLM critic rewrites a code-generation prompt against a ten-point rubric, twice.</text>

  ${box(110, 400, 380, 170, 'Draft prompt', '"an RNN for my CSV data"', '#ffffff', '#cbd5e1', '#0f172a')}
  ${box(610, 400, 380, 170, 'LLM critic', 'scores a 10-point rubric', '#2563eb', '#1d4ed8', '#ffffff')}
  ${box(1110, 400, 380, 170, 'Revised prompt', 'framework, metrics, gaps', '#ffffff', '#cbd5e1', '#0f172a')}

  <g stroke="#475569" stroke-width="4" fill="none" marker-end="url(#arrow)">
    <path d="M490 485H600"/>
    <path d="M990 485H1100"/>
  </g>

  <!-- feedback loop -->
  <path d="M1300 570V690H800V690H300V580" fill="none" stroke="#2563eb" stroke-width="4" stroke-dasharray="14 12" marker-end="url(#arrow-accent)"/>
  <rect x="690" y="660" width="220" height="60" rx="30" fill="#ffffff" stroke="#2563eb" stroke-width="3"/>
  <text x="800" y="699" text-anchor="middle" font-family="${MONO}" font-size="24" font-weight="700" fill="#2563eb">x2 rounds</text>

  <!-- rubric chips -->
  <g font-family="${MONO}" font-size="20" fill="#475569">
    <rect x="250" y="800" width="190" height="48" rx="24" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><text x="345" y="831" text-anchor="middle">clarity</text>
    <rect x="460" y="800" width="230" height="48" rx="24" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><text x="575" y="831" text-anchor="middle">named libraries</text>
    <rect x="710" y="800" width="210" height="48" rx="24" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><text x="815" y="831" text-anchor="middle">data loading</text>
    <rect x="940" y="800" width="190" height="48" rx="24" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><text x="1035" y="831" text-anchor="middle">evaluation</text>
    <rect x="1150" y="800" width="210" height="48" rx="24" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="2"/><text x="1255" y="831" text-anchor="middle">missing data</text>
  </g>
</svg>`;

const out = 'src/content/projects/prompt-critic-agent/images/hero.png';
await fs.mkdir('src/content/projects/prompt-critic-agent/images', { recursive: true });
await sharp(Buffer.from(svg), { density: 96 }).png({ compressionLevel: 9 }).toFile(out);
console.log('Wrote', out);
