/**
 * Transforms paragraph `read` into kid-friendly `chunks` and adds `reteach` hints.
 * Run: node scripts/chunkify-lessons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../src/lib/manual-lessons.json");

const CHUNK_ICONS = ["💡", "🎯", "⭐", "🔍", "✨", "📌", "🧠", "🏆"];
const SCENE_BY_MOD = {
  "1 · Money & Why We Invest": "🏪💵🐷",
  "2 · What Is a Stock?": "🃏📈🏭",
  "3 · Reading a Company": "⚔️❤️🏰",
  "4 · Price vs. Value": "💎🏷️🐂",
  "5 · Risk & Smart Behavior": "🎲🌈⏳",
  "6 · Becoming a Wise Investor": "🧺🧘🎯",
};

function shorten(text, max = 88) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "…";
}

function splitToBites(paragraph) {
  const parts = paragraph
    .split(/(?<=[.!?])\s+/)
    .flatMap((s) => {
      const t = s.trim();
      if (!t) return [];
      if (t.length <= 100) return [t];
      return t.split(/(?<=[,—–])\s+/).map((x) => x.trim()).filter(Boolean);
    });
  return parts.map((p) => shorten(p, 96));
}

function reteachFromWhy(why) {
  const first = (why.split(/(?<=[.!?])\s+/)[0] ?? why).trim();
  const prefixed = first.length < 70 ? `💡 ${first}` : shorten(first, 90);
  return prefixed;
}

const lessons = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

for (const lesson of lessons) {
  const scene = SCENE_BY_MOD[lesson.mod] ?? lesson.emoji;
  const bites = [];
  (lesson.read ?? []).forEach((para, pi) => {
    splitToBites(para).forEach((text, bi) => {
      bites.push({
        icon: CHUNK_ICONS[(pi + bi) % CHUNK_ICONS.length],
        text,
        visual: bi === 0 && pi === 0 ? scene : lesson.emoji,
      });
    });
  });
  lesson.chunks = bites.length ? bites : [{ icon: "💡", text: lesson.title, visual: lesson.emoji }];

  for (const q of lesson.quiz) {
    q.reteach = q.reteach ?? reteachFromWhy(q.why);
  }
  lesson.xp = 100;
}

fs.writeFileSync(jsonPath, JSON.stringify(lessons, null, 2) + "\n");
console.log(`Chunkified ${lessons.length} lessons`);