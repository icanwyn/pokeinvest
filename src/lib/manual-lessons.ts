import lessonsJson from "./manual-lessons.json";

export interface LessonChunk {
  icon: string;
  text: string;
  visual?: string;
}

export interface ManualQuizQuestion {
  q: string;
  a: string[];
  correct: number;
  why: string;
  reteach?: string;
}

export interface ManualLesson {
  id: string;
  mod: string;
  title: string;
  emoji: string;
  xp: number;
  read: string[];
  chunks?: LessonChunk[];
  quiz: ManualQuizQuestion[];
}

export const MANUAL_LESSONS = lessonsJson as ManualLesson[];

export const STARTING_CASH = 1000;
export const LESSON_CASH_REWARD = 100;
export const QUIZ_QUESTIONS_PER_LESSON = 10;
export const XP_PER_CORRECT = 10;
/** Minimum correct to pass and unlock the next lesson (7/10). */
export const PASS_THRESHOLD = 0.7;
/** Full XP credit requires a perfect score (10/10). */
export const PERFECT_THRESHOLD = 1;

export function shuffleIndices(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export interface ManualModule {
  name: string;
  lessons: ManualLesson[];
}

export function getLessonChunks(lesson: ManualLesson): LessonChunk[] {
  if (lesson.chunks?.length) return lesson.chunks;
  return (lesson.read ?? []).map((text, i) => ({
    icon: ["💡", "🎯", "⭐", "🔍"][i % 4],
    text,
    visual: lesson.emoji,
  }));
}

export function getManualModules(): ManualModule[] {
  const modules: ManualModule[] = [];
  for (const lesson of MANUAL_LESSONS) {
    let mod = modules.find((m) => m.name === lesson.mod);
    if (!mod) {
      mod = { name: lesson.mod, lessons: [] };
      modules.push(mod);
    }
    mod.lessons.push(lesson);
  }
  return modules;
}

export function getLessonById(id: string): ManualLesson | undefined {
  return MANUAL_LESSONS.find((l) => l.id === id);
}

export function isLessonUnlocked(
  lessonId: string,
  completedIds: Set<string> | string[]
): boolean {
  const done = completedIds instanceof Set ? completedIds : new Set(completedIds);
  const idx = MANUAL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  return done.has(MANUAL_LESSONS[idx - 1].id);
}

export function quizCorrectCount(wrongCount: number, total: number): number {
  return Math.max(0, total - wrongCount);
}

export function quizPassed(wrongCount: number, total: number): boolean {
  return quizCorrectCount(wrongCount, total) >= Math.ceil(total * PASS_THRESHOLD);
}

export function quizPerfect(wrongCount: number): boolean {
  return wrongCount === 0;
}

export function xpForCorrectCount(correct: number): number {
  return correct * XP_PER_CORRECT;
}

export function maxLessonXp(): number {
  return QUIZ_QUESTIONS_PER_LESSON * XP_PER_CORRECT;
}

export function passNeed(total: number): number {
  return Math.ceil(total * PASS_THRESHOLD);
}