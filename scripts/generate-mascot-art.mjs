#!/usr/bin/env node
/**
 * Generates Pokemon-style mascot card art for S&P 500 companies via xAI Imagine API.
 * Skips tickers with custom mascots in public/cards/ (the original 20).
 *
 * API key: XAI_API_KEY env, or ~/.grok/auth.json (Grok Build login).
 * Run: node scripts/generate-mascot-art.mjs
 * Resume: re-run — skips existing files unless --force
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/cards/sp500");
const PROGRESS_PATH = resolve(ROOT, "scripts/.mascot-gen-progress.jsonl");
const MANIFEST_PATH = resolve(ROOT, "src/lib/sp500-art-manifest.ts");

const CONCURRENCY = 4;
const DELAY_MS = 250;
const MODEL = process.env.XAI_IMAGE_MODEL ?? "grok-imagine-image";

const TYPE_ESSENCE = {
  fire: "Fire-type energy, warm flames and power",
  water: "Water-type flow, calm blue streams",
  grass: "Grass-type nature, leaves and growth",
  electric: "Electric-type sparks, tech lightning aura",
  psychic: "Psychic-type mystic glow, mind energy",
  fighting: "Fighting-type strength, bold dynamic pose",
  steel: "Steel-type metallic shine, industrial toughness",
  fairy: "Fairy-type sparkle, caring magical light",
  dark: "Dark-type shadow, mysterious silhouette",
  normal: "Normal-type friendly charm, everyday hero",
  dragon: "Dragon-type majestic power, treasure guardian",
};

const CUSTOM_TICKERS = new Set(
  readFileSync(resolve(ROOT, "src/lib/card-art.ts"), "utf8")
    .match(/ticker: "([A-Z.]+)"/g)
    ?.map((m) => m.replace('ticker: "', "").replace('"', "")) ?? []
);

function getApiKey() {
  if (process.env.XAI_API_KEY) return process.env.XAI_API_KEY;
  const authPath = resolve(homedir(), ".grok/auth.json");
  if (!existsSync(authPath)) return null;
  const auth = JSON.parse(readFileSync(authPath, "utf8"));
  const entry = auth[Object.keys(auth)[0]];
  return entry?.key ?? null;
}

function parseCompanies() {
  const text = readFileSync(resolve(ROOT, "src/lib/sp500.ts"), "utf8");
  const companies = [];
  const re =
    /ticker: "([^"]+)", name: "([^"]+)", sector: "([^"]+)", subIndustry: "([^"]+)", pokemonType: "([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    companies.push({
      ticker: m[1],
      name: m[2],
      sector: m[3],
      subIndustry: m[4],
      pokemonType: m[5],
    });
  }
  return companies;
}

function buildPrompt(company) {
  const typeHint = TYPE_ESSENCE[company.pokemonType] ?? TYPE_ESSENCE.normal;
  const essence = `Original mascot creature themed to ${company.name}, a ${company.subIndustry} company in ${company.sector}. ${typeHint}`;
  return (
    `Wide horizontal landscape trading card center art, 4:3 aspect ratio. ` +
    `${essence}. Kid-friendly anime-influenced illustration, vibrant colors, ` +
    `subject fills the frame width with minimal empty margins. ` +
    `Soft cream gradient background, no corporate logos, no readable text, no copyrighted characters.`
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(apiKey, prompt) {
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      aspect_ratio: "4:3",
      response_format: "b64_json",
      n: 1,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data in response");
  return Buffer.from(b64, "base64");
}

async function processCompany(apiKey, company, force) {
  const outFile = resolve(OUT_DIR, `${company.ticker}.jpg`);
  if (CUSTOM_TICKERS.has(company.ticker)) {
    return { ticker: company.ticker, status: "skipped-custom" };
  }
  if (!force && existsSync(outFile)) {
    const buf = readFileSync(outFile);
    // Skip if already a large mascot file (>40KB usually means AI art vs small SVG composite)
    if (buf.length > 40000) {
      return { ticker: company.ticker, status: "exists" };
    }
  }

  const prompt = buildPrompt(company);
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const jpeg = await generateImage(apiKey, prompt);
      writeFileSync(outFile, jpeg);
      appendFileSync(
        PROGRESS_PATH,
        JSON.stringify({ ticker: company.ticker, status: "ok", bytes: jpeg.length, ts: Date.now() }) + "\n"
      );
      return { ticker: company.ticker, status: "generated", bytes: jpeg.length };
    } catch (err) {
      lastErr = err;
      if (err.message.includes("429")) {
        await sleep(5000 * attempt);
      } else {
        await sleep(1000 * attempt);
      }
    }
  }

  appendFileSync(
    PROGRESS_PATH,
    JSON.stringify({ ticker: company.ticker, status: "error", error: lastErr.message, ts: Date.now() }) + "\n"
  );
  return { ticker: company.ticker, status: "error", error: lastErr.message };
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

function writeManifest(tickers) {
  const sorted = [...new Set(tickers)].sort();
  const ts = `/** Auto-generated — scripts/generate-mascot-art.mjs + generate-sp500-card-art.mjs */
export const SP500_ART_TICKERS: string[] = [
${sorted.map((t) => `  "${t}"`).join(",\n")}
];

const SP500_ART_SET = new Set(SP500_ART_TICKERS);

export function hasSP500CardArt(ticker: string): boolean {
  return SP500_ART_SET.has(ticker.toUpperCase());
}

export function getSP500CardArtPath(ticker: string): string {
  return \`/cards/sp500/\${ticker.toUpperCase()}.jpg\`;
}
`;
  writeFileSync(MANIFEST_PATH, ts, "utf8");
}

async function main() {
  const force = process.argv.includes("--force");
  const limit = process.argv.includes("--limit")
    ? parseInt(process.argv[process.argv.indexOf("--limit") + 1], 10)
    : null;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("No API key. Set XAI_API_KEY or log in to Grok Build.");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let companies = parseCompanies().filter((c) => !CUSTOM_TICKERS.has(c.ticker));
  if (limit) companies = companies.slice(0, limit);

  console.log(`Generating mascot art for ${companies.length} companies (model: ${MODEL}, concurrency: ${CONCURRENCY})...`);

  const results = await runPool(
    companies,
    (c) => processCompany(apiKey, c, force),
    CONCURRENCY
  );

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const allTickers = parseCompanies().map((c) => c.ticker);
  writeManifest(allTickers);

  console.log("Done:", counts);
  const errors = results.filter((r) => r.status === "error");
  if (errors.length) {
    console.log("Failed tickers:", errors.map((e) => e.ticker).join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});