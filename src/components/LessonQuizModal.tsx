"use client";

import { useState } from "react";
import type { ManualLesson } from "@/lib/manual-lessons";

interface LessonQuizModalProps {
  lesson: ManualLesson;
  alreadyDone: boolean;
  onClose: () => void;
  onComplete: (wrongCount: number, total: number) => Promise<void>;
}

export function LessonQuizModal({
  lesson,
  alreadyDone,
  onClose,
  onComplete,
}: LessonQuizModalProps) {
  const [step, setStep] = useState<"read" | "quiz">("read");
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const q = lesson.quiz[qi];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i !== q.correct) setWrongCount((w) => w + 1);
  };

  const next = async () => {
    if (qi + 1 < lesson.quiz.length) {
      setQi(qi + 1);
      setPicked(null);
      return;
    }
    setSubmitting(true);
    try {
      await onComplete(wrongCount, lesson.quiz.length);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lesson-modal-backdrop" onClick={onClose}>
      <div className="lesson-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lesson-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="lesson-modal-head">
          <span className="lesson-modal-emoji">{lesson.emoji}</span>
          <div>
            <span className="lesson-modal-mod">{lesson.mod}</span>
            <h3>{lesson.title}</h3>
          </div>
        </div>

        {step === "read" ? (
          <div className="lesson-modal-read">
            {lesson.read.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <button type="button" className="lesson-modal-primary" onClick={() => setStep("quiz")}>
              Start quiz →
            </button>
          </div>
        ) : (
          <div className="lesson-modal-quiz">
            <p className="lesson-q-prog">
              Question {qi + 1} of {lesson.quiz.length}
            </p>
            <p className="lesson-q-text">{q.q}</p>
            <div className="lesson-q-opts">
              {q.a.map((opt, i) => {
                let state = "";
                if (picked !== null) {
                  if (i === q.correct) state = "right";
                  else if (i === picked) state = "wrong";
                  else state = "dim";
                }
                return (
                  <button
                    key={i}
                    type="button"
                    className={`lesson-q-opt ${state}`}
                    onClick={() => choose(i)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div className={`lesson-q-feedback ${picked === q.correct ? "ok" : "no"}`}>
                <b>{picked === q.correct ? "Correct! " : "Not quite. "}</b>
                {q.why}
                <button
                  type="button"
                  className="lesson-modal-primary"
                  onClick={next}
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving…"
                    : qi + 1 < lesson.quiz.length
                      ? "Next question →"
                      : alreadyDone
                        ? "Done (already aced)"
                        : "Finish & earn reward →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}