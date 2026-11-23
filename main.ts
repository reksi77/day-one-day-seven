// Day one, day seven — entry program (Node 22, standard library only).
//
// The entry itself is a TikTok video about the same tiny agent-built game
// on the day it was made and after a week of daily updates (see README.md
// and game/). All this program has to do is hand the video's address to
// the grader: it reads VIDEO.json from the repository root and writes it
// byte for byte to /output/VIDEO.json, where the gate reads it. Nothing
// this program writes about the video is scored — the house reads the
// video itself from TikTok.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'VIDEO.json');
const target = join(OUTPUT_DIR, 'VIDEO.json');

let raw;
try {
  raw = readFileSync(source, 'utf8');
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (typeof parsed !== 'object' || parsed === null || typeof parsed.url !== 'string') {
  console.error('VIDEO.json must be a JSON object with a url string');
  process.exit(1);
}

if (!parsed.url.startsWith('https://www.tiktok.com/')) {
  console.error('VIDEO.json url must be a TikTok video address (https://www.tiktok.com/@<handle>/video/<id>)');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, raw);
console.log(`Wrote ${target}`);
