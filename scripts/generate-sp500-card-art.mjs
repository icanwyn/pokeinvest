#!/usr/bin/env node
/**
 * Generates 4:3 landscape card images for S&P 500 companies.
 * Skips tickers that already have custom mascot art in public/cards/.
 * Run: node scripts/generate-sp500-card-art.mjs
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import YahooFinance from "yahoo-finance2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/cards/sp500");
const MANIFEST_PATH = resolve(ROOT, "src/lib/sp500-art-manifest.ts");
const DOMAINS_PATH = resolve(ROOT, "src/lib/sp500-domains.ts");
const CUSTOM_DIR = resolve(ROOT, "public/cards");

const WIDTH = 800;
const HEIGHT = 600;
const CONCURRENCY = 6;
const DELAY_MS = 120;

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const SECTOR_COLORS = {
  Energy: "#E25822",
  Materials: "#8B8B9E",
  Industrials: "#C03028",
  "Consumer Discretionary": "#A8A878",
  "Consumer Staples": "#78C850",
  "Health Care": "#EE99AC",
  Financials: "#6890F0",
  "Information Technology": "#F8D030",
  "Communication Services": "#7B68EE",
  Utilities: "#4A90D9",
  "Real Estate": "#7038F8",
};

const CUSTOM_TICKERS = new Set(
  existsSync(CUSTOM_DIR)
    ? readFileSync(resolve(ROOT, "src/lib/card-art.ts"), "utf8")
        .match(/ticker: "([A-Z.]+)"/g)
        ?.map((m) => m.replace('ticker: "', "").replace('"', "")) ?? []
    : []
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toYahooSymbol(ticker) {
  return ticker.replace(/\./g, "-");
}

function parseSp500FromGenerated() {
  const sp500Path = resolve(ROOT, "src/lib/sp500.ts");
  const text = readFileSync(sp500Path, "utf8");
  const entries = [];
  const re =
    /ticker: "([^"]+)", name: "([^"]+)", sector: "([^"]+)", subIndustry: "([^"]+)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    entries.push({ ticker: m[1], name: m[2], sector: m[3] });
  }
  return entries;
}

async function fetchWebsite(ticker) {
  const sym = toYahooSymbol(ticker);
  try {
    const summary = await yahooFinance.quoteSummary(sym, {
      modules: ["summaryProfile"],
    });
    const web = summary?.summaryProfile?.website;
    if (!web) return null;
    const host = new URL(web).hostname.replace(/^www\./, "");
    return host.includes(".") ? host : null;
  } catch {
    return null;
  }
}

async function guessDomainFromName(companyName) {
  try {
    const res = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(companyName)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0]?.domain ?? null;
  } catch {
    return null;
  }
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchLogoBuffer(domain) {
  const url = `https://logo.clearbit.com/${domain}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) return null;
    return buf;
  } catch {
    return null;
  }
}

function initials(name) {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0]?.slice(0, 2) ?? "??").toUpperCase();
}

function cardSvg({ ticker, name, sector, color, initialsText, hasLogo }) {
  const safeName = escapeXml(name.length > 42 ? name.slice(0, 40) + "…" : name);
  const logoBlock = hasLogo
    ? `<rect x="250" y="130" width="300" height="300" rx="24" fill="rgba(255,255,255,0.92)"/>`
    : `<circle cx="400" cy="280" r="120" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="4"/>
       <text x="400" y="300" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="white">${escapeXml(initialsText)}</text>`;

  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.95"/>
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.35"/></filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="16" y="16" width="${WIDTH - 32}" height="${HEIGHT - 32}" rx="20" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="3"/>
  ${logoBlock}
  <text x="400" y="500" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="48" font-weight="900" fill="white" filter="url(#shadow)">${escapeXml(ticker)}</text>
  <text x="400" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.85)">${safeName}</text>
  <text x="400" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.6)">${escapeXml(sector)} · S&amp;P 500</text>
</svg>`);
}

async function composeCard(company, domain, logoBuf) {
  const color = SECTOR_COLORS[company.sector] ?? "#A8A878";
  const init = initials(company.name);
  const baseSvg = cardSvg({
    ticker: company.ticker,
    name: company.name,
    sector: company.sector,
    color,
    initialsText: init,
    hasLogo: !!logoBuf,
  });

  let pipeline = sharp(baseSvg).resize(WIDTH, HEIGHT);

  if (logoBuf) {
    const logo = await sharp(logoBuf)
      .resize(220, 220, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    pipeline = pipeline.composite([
      { input: logo, top: 170, left: 290 },
    ]);
  }

  return pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

async function processCompany(company, domains) {
  const outFile = resolve(OUT_DIR, `${company.ticker}.jpg`);
  if (CUSTOM_TICKERS.has(company.ticker)) {
    return { ticker: company.ticker, status: "skipped-custom" };
  }
  if (existsSync(outFile)) {
    return { ticker: company.ticker, status: "exists" };
  }

  try {
    let domain = domains[company.ticker] ?? null;
    if (!domain) {
      domain = await guessDomainFromName(company.name);
      if (!domain) {
        domain = await fetchWebsite(company.ticker);
        await sleep(DELAY_MS);
      }
      if (domain) domains[company.ticker] = domain;
    }

    let logoBuf = null;
    if (domain) {
      logoBuf = await fetchLogoBuffer(domain);
    }

    const jpeg = await composeCard(company, domain, logoBuf);
    writeFileSync(outFile, jpeg);
    return {
      ticker: company.ticker,
      status: logoBuf ? "logo" : "initials",
      domain: domain ?? undefined,
    };
  } catch (err) {
    console.error(`Failed ${company.ticker}:`, err.message);
    return { ticker: company.ticker, status: "error" };
  }
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

function writeManifest(generatedTickers) {
  const ts = `/** Auto-generated by scripts/generate-sp500-card-art.mjs — do not edit manually */
export const SP500_ART_TICKERS: string[] = [
${generatedTickers.map((t) => `  "${t}"`).join(",\n")}
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

function writeDomains(domains) {
  const entries = Object.entries(domains).sort(([a], [b]) => a.localeCompare(b));
  const ts = `/** Auto-generated domains for S&P 500 — scripts/generate-sp500-card-art.mjs */
export const SP500_DOMAINS: Record<string, string> = {
${entries.map(([t, d]) => `  ${JSON.stringify(t)}: ${JSON.stringify(d)},`).join("\n")}
};
`;
  writeFileSync(DOMAINS_PATH, ts, "utf8");
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const companies = parseSp500FromGenerated();
  if (companies.length === 0) {
    throw new Error("Run scripts/build-sp500-data.mjs first");
  }

  const domains = {};
  console.log(`Generating card art for ${companies.length} S&P 500 companies...`);

  const results = await runPool(
    companies,
    (c) => processCompany(c, domains),
    CONCURRENCY
  );

  const generated = results
    .filter((r) => r.status === "logo" || r.status === "initials" || r.status === "exists")
    .map((r) => r.ticker);

  const allArt = [...new Set([...CUSTOM_TICKERS, ...generated])].sort();
  writeManifest(allArt.filter((t) => !CUSTOM_TICKERS.has(t) || existsSync(resolve(OUT_DIR, `${t}.jpg`))));
  
  // Manifest = all tickers with sp500 jpg OR that we generated
  const sp500ArtTickers = companies
    .map((c) => c.ticker)
    .filter((t) => CUSTOM_TICKERS.has(t) || existsSync(resolve(OUT_DIR, `${t}.jpg`)));
  writeManifest(sp500ArtTickers);
  writeDomains(domains);

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  console.log("Done:", counts);
  console.log(`Manifest: ${sp500ArtTickers.length} tickers with sp500 art`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});