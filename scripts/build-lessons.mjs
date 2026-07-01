import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { lessonsPart1 } from "./lessons-part1.mjs";
import { lessonsPart2 } from "./lessons-part2.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/manual-lessons.json");

const lessons = [...lessonsPart1, ...lessonsPart2];
const EXPECTED = 34;
const QUESTIONS = 10;

if (lessons.length !== EXPECTED) {
  console.error(`Expected ${EXPECTED} lessons, got ${lessons.length}`);
  process.exit(1);
}

for (const lesson of lessons) {
  if (lesson.quiz.length < QUESTIONS) {
    console.error(`Lesson "${lesson.id}" has ${lesson.quiz.length} questions (need ${QUESTIONS})`);
    process.exit(1);
  }
  lesson.xp = 100;
}

fs.writeFileSync(out, JSON.stringify(lessons, null, 2) + "\n");
console.log(`Wrote ${lessons.length} lessons (${QUESTIONS} questions each) to ${out}`);