"use client";

import { useCallback, useMemo, useState } from "react";
import {
  PASS_THRESHOLD,
  QUIZ_QUESTIONS_PER_LESSON,
  XP_PER_CORRECT,
  shuffleIndices,
  type ManualLesson,
} from "@/lib/manual-lessons";

interface LessonQuizModalProps {
  lesson: ManualLesson;
  alreadyDone: boolean;
  bestWrongCount?: number;
  onClose: () => void;
  onComplete: (wrongCount: number, total: number) => Promise<void>;
}

export function LessonQuizModal({
  lesson,
  alreadyDone,
  bestWrongCount,
  onClose,
  onComplete,
}: LessonQuizModalProps) {
  const [step, setStep] = useState<"read" | "quiz">("read");
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const quizQuestions = useMemo(
    () => lesson.quiz.slice(0, QUIZ_QUESTIONS_PER_LESSON),
    [lesson.quiz]
  );
  const totalQuestions = quizQuestions.length;
  const passNeed = Math.ceil(totalQuestions * PASS_THRESHOLD);

  const beginQuiz = useCallback(() => {
    setQuestionOrder(shuffleIndices(totalQuestions));
    setQi(0);
    setPicked(null);
    setWrongCount(0);
    setStep("quiz");
  }, [totalQuestions]);

  const qIndex = questionOrder[qi] ?? qi;
  const q = quizQuestions[qIndex];

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i !== q.correct) setWrongCount((w) => w + 1);
  };

  const next = async () => {
    if (qi + 1 < totalQuestions) {
      setQi(qi + 1);
      setPicked(null);
      return;
    }
    setSubmitting(true);
    try {
      await onComplete(wrongCount, totalQuestions);
    } finally {
      setSubmitting(false);
    }
  };

  const bestCorrect =
    typeof bestWrongCount === "number"
      ? totalQuestions - bestWrongCount
      : null;

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
            <p className="lesson-modal-meta">
              {totalQuestions} questions · need {passNeed}/{totalQuestions} correct to pass ·{" "}
              <strong>+{XP_PER_CORRECT} XP</strong> per right answer
            </p>
            {alreadyDone && bestCorrect !== null && (
              <p className="lesson-modal-retake-hint">
                Best score: {bestCorrect}/{totalQuestions}. Retake to improve — questions appear in
                a new order!
              </p>
            )}
            <button type="button" className="lesson-modal-primary" onClick={beginQuiz}>
              {alreadyDone ? "Retake quiz (shuffled) →" : "Start quiz →"}
            </button>
          </div>
        ) : (
          <div className="lesson-modal-quiz">
            <p className="lesson-q-prog">
              Question {qi + 1} of {totalQuestions}
              {alreadyDone ? " · retake mode" : ""}
            </p>
            <p className="lesson-q-text">{q?.q}</p>
            <div className="lesson-q-opts">
              {q?.a.map((opt, i) => {
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
                <b>{picked === q.correct ? `Correct! +${XP_PER_CORRECT} XP ` : "Not quite. "}</b>
                {q.why}
                <button
                  type="button"
                  className="lesson-modal-primary"
                  onClick={next}
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving…"
                    : qi + 1 < totalQuestions
                      ? "Next question →"
                      : alreadyDone
                        ? "Save score →"
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