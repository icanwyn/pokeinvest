/**
 * Kid-friendly chunks + simple quiz copy for ages ~10.
 * Run: node scripts/chunkify-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../src/lib/manual-lessons.json");

const CHUNK_ICONS = ["💡", "🎯", "⭐", "🔍", "✨", "📌", "🧠", "🏆"];
const MAX_CHUNK_WORDS = 14;

const SCENE_BY_MOD = {
  "1 · Money & Why We Invest": "🏪💵🐷",
  "2 · What Is a Stock?": "🃏📈🏭",
  "3 · Reading a Company": "⚔️❤️🏰",
  "4 · Price vs. Value": "💎🏷️🐂",
  "5 · Risk & Smart Behavior": "🎲🌈⏳",
  "6 · Becoming a Wise Investor": "🧺🧘🎯",
};

/** Longer phrases first so partial matches don't break. */
const KID_PHRASES = [
  ["double coincidence of wants", "both people wanting each other's stuff"],
  ["dollar-cost averaging", "buying a little every month"],
  ["purchasing power", "how much stuff your money buys"],
  ["profit margin", "how much profit you keep"],
  ["market capitalization", "company size"],
  ["market cap", "company size"],
  ["expense ratio", "yearly fund fee"],
  ["index fund", "a big mix of stocks"],
  ["stock market", "the big card shop for companies"],
  ["shareholders", "owners"],
  ["diversification", "mixing different types"],
  ["diversifying", "mixing different types"],
  ["diversify", "mix it up"],
  ["volatility", "prices jumping up and down"],
  ["inflation", "prices slowly going up"],
  ["portfolio", "binder"],
  ["revenue", "money from sales"],
  ["dividends", "bonus coins from companies"],
  ["dividend", "bonus coin"],
  ["compounding", "money growing on itself"],
  ["compound", "grow on itself"],
  ["investing", "growing your money"],
  ["investment", "money you grow"],
  ["invest", "grow your money"],
  ["approximately", "about"],
  ["significantly", "a lot"],
  ["primarily", "mostly"],
  ["nevertheless", "still"],
  ["consequently", "so"],
  ["utilize", "use"],
  ["accumulate", "build up"],
  ["substantial", "big"],
  ["liabilities", "debts"],
  ["assets", "stuff it owns"],
  ["fundamentals", "how strong a company is"],
  ["valuation", "price tag"],
  ["securities", "stocks"],
  ["economy-wide", "everywhere"],
  ["initial public offering", "first day selling shares"],
  ["IPO", "first day selling shares"],
];

function kidify(text) {
  let t = text.replace(/\s+/g, " ").trim();
  for (const [from, to] of KID_PHRASES) {
    t = t.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), to);
  }
  t = t.replace(/—/g, ", ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function polishChunk(text) {
  let t = text.trim().replace(/\s+\./g, ".").replace(/\s+,/g, ",");
  t = t.replace(/\. ([a-z])/g, (_, c) => `. ${c.toUpperCase()}`).replace(/ In /g, " in ");
  if (t && !/[.!?]$/.test(t)) t += ".";
  if (/^[a-z]/.test(t)) t = t.charAt(0).toUpperCase() + t.slice(1);
  return t;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function splitLongSentence(sentence) {
  const t = sentence.trim();
  if (wordCount(t) <= MAX_CHUNK_WORDS) return [polishChunk(t)];

  if (t.includes(",")) {
    const parts = t.split(/,\s+/).map((p) => p.trim()).filter(Boolean);
    const bites = [];
    let buf = "";
    for (const part of parts) {
      const next = buf ? `${buf}, ${part}` : part;
      if (wordCount(next) <= MAX_CHUNK_WORDS) {
        buf = next;
      } else {
        if (buf) bites.push(polishChunk(buf));
        if (wordCount(part) > MAX_CHUNK_WORDS) {
          bites.push(...splitLongSentence(part));
        } else {
          buf = part;
        }
      }
    }
    if (buf) bites.push(polishChunk(buf));
    return bites;
  }

  const words = t.replace(/[.!?]+$/, "").split(/\s+/);
  const bites = [];
  for (let i = 0; i < words.length; i += 12) {
    bites.push(polishChunk(words.slice(i, i + 12).join(" ")));
  }
  return bites;
}

function paragraphToBites(paragraph) {
  const t = kidify(paragraph);
  const sentences = t
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.flatMap((s) => splitLongSentence(s));
}

function mergeTinyChunks(chunks) {
  const out = [];
  for (const c of chunks) {
    const plain = c.replace(/[.!?]$/, "");
    const wc = wordCount(plain);
    const startsLower = /^[a-z]/.test(plain);
    const startsJoiner = /^(and|but|or|so|for|a|the)\s/i.test(plain);
    if (out.length && (wc < 5 || startsJoiner || (startsLower && wc < 10))) {
      const prev = out[out.length - 1].replace(/[.!?]$/, "");
      out[out.length - 1] = polishChunk(`${prev} ${plain}`);
    } else {
      out.push(polishChunk(c));
    }
  }
  return out;
}

function reteachFromWhy(why) {
  const simple = kidify((why.split(/(?<=[.!?])\s+/)[0] ?? why).trim());
  const words = simple.split(/\s+/);
  const short = words.length > 12 ? words.slice(0, 12).join(" ") + "…" : simple;
  return `💡 ${short}`;
}

function kidifyQuizField(text) {
  return kidify(text);
}

const lessons = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

for (const lesson of lessons) {
  const scene = SCENE_BY_MOD[lesson.mod] ?? lesson.emoji;
  const rawBites = (lesson.read ?? []).flatMap(paragraphToBites);
  const merged = mergeTinyChunks(rawBites);

  lesson.chunks = merged.length
    ? merged.map((text, i) => ({
        icon: CHUNK_ICONS[i % CHUNK_ICONS.length],
        text,
        visual: i === 0 ? scene : lesson.emoji,
      }))
    : [{ icon: "💡", text: kidify(lesson.title), visual: lesson.emoji }];

  for (const q of lesson.quiz) {
    q.q = kidifyQuizField(q.q);
    q.a = q.a.map(kidifyQuizField);
    q.why = kidifyQuizField(q.why);
    q.reteach = reteachFromWhy(q.why);
  }
  lesson.xp = 100;
}

fs.writeFileSync(jsonPath, JSON.stringify(lessons, null, 2) + "\n");
console.log(`Kidified ${lessons.length} lessons`);