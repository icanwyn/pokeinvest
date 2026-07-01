"use client";

import { useMemo, useState } from "react";
import { LessonQuizModal } from "@/components/LessonQuizModal";
import {
  getManualModules,
  LESSON_CASH_REWARD,
  MANUAL_LESSONS,
  maxLessonXp,
  passNeed,
  quizPerfect,
  type ManualLesson,
  isLessonUnlocked,
} from "@/lib/manual-lessons";
import type { UserBundle } from "@/types/user";

interface LessonPanelProps {
  user: UserBundle;
  onUserUpdate: (user: UserBundle) => void;
  onCelebrate?: (message: string) => void;
}

export function LessonPanel({ user, onUserUpdate, onCelebrate }: LessonPanelProps) {
  const [activeLesson, setActiveLesson] = useState<ManualLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const modules = useMemo(() => getManualModules(), []);
  const completedSet = useMemo(() => new Set(user.completedLessons), [user.completedLessons]);
  const progressByLesson = useMemo(
    () => new Map(user.lessonProgress.map((p) => [p.lessonId, p])),
    [user.lessonProgress]
  );
  const lessonsDone = user.completedLessons.length;
  const fullXp = maxLessonXp();
  const needPass = passNeed(10);

  const handleComplete = async (wrongCount: number, total: number) => {
    if (!activeLesson) return;
    setError(null);

    const res = await fetch("/api/user/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: activeLesson.id,
        wrongCount,
        totalQuestions: total,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Could not complete lesson");
      return;
    }

    onUserUpdate(data.user);

    if (data.cashAwarded > 0 && data.perfect) {
      onCelebrate?.(
        `⭐ Super Star! ${activeLesson.title} — +$${data.cashAwarded} & +${data.xpAwarded} XP!`
      );
    } else if (data.cashAwarded > 0) {
      onCelebrate?.(
        `✅ ${activeLesson.title} — +$${data.cashAwarded} & +${data.xpAwarded} XP. Try again for ${fullXp} XP!`
      );
    } else if (data.improved && data.perfect) {
      onCelebrate?.(
        `⭐ Super Star! ${activeLesson.title} — +${data.xpAwarded} XP (max ${fullXp}!)`
      );
    } else if (data.improved) {
      onCelebrate?.(
        `📈 ${activeLesson.title} — +${data.xpAwarded} XP (${data.correct}/${data.totalQuestions}). Go for ${fullXp}!`
      );
    } else if (data.alreadyDone) {
      onCelebrate?.(`Nice practice on ${activeLesson.title}!`);
    }

    setActiveLesson(null);
  };

  return (
    <div className="manual-lessons">
      <div className="manual-lessons-header">
        <div>
          <h2 className="manual-lessons-title">📖 Training Manual</h2>
          <p className="manual-lessons-sub">
            Tap a lesson. Read <strong>short steps</strong>, then take the quiz. Get{" "}
            <strong>{needPass}</strong> right to pass (+${LESSON_CASH_REWARD}). Get{" "}
            <strong>10/10</strong> for a ⭐ Super Star and <strong>{fullXp} XP</strong>.
          </p>
        </div>
        <div className="manual-lessons-stats">
          <span>{lessonsDone}/{MANUAL_LESSONS.length} passed</span>
          <span>{user.xp} XP</span>
        </div>
      </div>

      {error && <p className="manual-lessons-error">{error}</p>}

      {modules.map((mod) => (
        <section className="manual-module" key={mod.name}>
          <h3 className="manual-module-title">{mod.name}</h3>
          <div className="manual-lesson-grid">
            {mod.lessons.map((lesson) => {
              const idx = MANUAL_LESSONS.findIndex((l) => l.id === lesson.id);
              const progress = progressByLesson.get(lesson.id);
              const isDone = completedSet.has(lesson.id);
              const isPerfect = progress ? quizPerfect(progress.wrongCount) : false;
              const unlocked = isLessonUnlocked(lesson.id, completedSet);

              return (
                <button
                  key={lesson.id}
                  type="button"
                  className={`manual-lesson-card ${isDone ? "done" : ""} ${isPerfect ? "perfect" : ""} ${!unlocked ? "locked" : ""}`}
                  disabled={!unlocked}
                  onClick={() => unlocked && setActiveLesson(lesson)}
                >
                  <span className="manual-lesson-emoji">
                    {isPerfect ? "⭐" : isDone ? "✅" : unlocked ? lesson.emoji : "🔒"}
                  </span>
                  <span className="manual-lesson-name">{lesson.title}</span>
                  <span className="manual-lesson-reward">
                    {isPerfect
                      ? `⭐ Super Star · ${fullXp} XP`
                      : isDone
                        ? "Passed · go for ⭐"
                        : unlocked
                          ? `+$${LESSON_CASH_REWARD} · up to ${fullXp} XP`
                          : "Locked"}
                  </span>
                  <span className="manual-lesson-order">#{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {activeLesson && (
        <LessonQuizModal
          lesson={activeLesson}
          alreadyDone={completedSet.has(activeLesson.id)}
          bestWrongCount={progressByLesson.get(activeLesson.id)?.wrongCount}
          onClose={() => {
            setActiveLesson(null);
            setError(null);
          }}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}