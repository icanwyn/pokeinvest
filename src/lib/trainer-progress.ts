const PROGRESS_KEY = "pokeinvest-trainer-progress";

export interface TrainerProgress {
  xp: number;
  completedLessons: string[];
  quizScores: Record<string, { correct: number; total: number; bestScore: number }>;
}

const DEFAULT: TrainerProgress = {
  xp: 0,
  completedLessons: [],
  quizScores: {},
};

export function loadTrainerProgress(): TrainerProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveTrainerProgress(progress: TrainerProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function recordQuizResult(
  progress: TrainerProgress,
  lessonId: string,
  correct: number,
  total: number,
  xpEarned: number
): TrainerProgress {
  const prev = progress.quizScores[lessonId];
  const bestScore = Math.max(prev?.bestScore ?? 0, correct);

  const updated: TrainerProgress = {
    xp: progress.xp + xpEarned,
    completedLessons:
      correct >= Math.ceil(total * 0.67) && !progress.completedLessons.includes(lessonId)
        ? [...progress.completedLessons, lessonId]
        : progress.completedLessons,
    quizScores: {
      ...progress.quizScores,
      [lessonId]: { correct, total, bestScore },
    },
  };

  saveTrainerProgress(updated);
  return updated;
}