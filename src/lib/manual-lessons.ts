import lessonsJson from "./manual-lessons.json";

export interface ManualQuizQuestion {
  q: string;
  a: string[];
  correct: number;
  why: string;
}

export interface ManualLesson {
  id: string;
  mod: string;
  title: string;
  emoji: string;
  xp: number;
  read: string[];
  quiz: ManualQuizQuestion[];
}

export const MANUAL_LESSONS = lessonsJson as ManualLesson[];

export const STARTING_CASH = 1000;
export const LESSON_CASH_REWARD = 100;
/** Fraction of quiz questions that must be correct to unlock + earn cash (1 = 100%). */
export const PASS_THRESHOLD = 1;

export interface ManualModule {
  name: string;
  lessons: ManualLesson[];
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

export function quizPassed(wrongCount: number, total: number): boolean {
  const correct = total - wrongCount;
  return correct >= Math.ceil(total * PASS_THRESHOLD);
}