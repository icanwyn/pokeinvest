"use client";

import { useCallback, useMemo, useState } from "react";
import {
  LESSON_CASH_REWARD,
  XP_PER_CORRECT,
  getLessonChunks,
  maxLessonXp,
  passNeed,
  quizCorrectCount,
  quizPerfect,
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

type Phase = "learn" | "ready" | "quiz" | "reteach" | "results";

export function LessonQuizModal({
  lesson,
  alreadyDone,
  bestWrongCount,
  onClose,
  onComplete,
}: LessonQuizModalProps) {
  const chunks = useMemo(() => getLessonChunks(lesson), [lesson]);
  const quizQuestions = useMemo(() => lesson.quiz.slice(0, 10), [lesson.quiz]);
  const totalQuestions = quizQuestions.length;
  const needToPass = passNeed(totalQuestions);
  const fullXp = maxLessonXp();

  const [phase, setPhase] = useState<Phase>("learn");
  const [chunkIdx, setChunkIdx] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const qIndex = questionOrder[qi] ?? qi;
  const q = quizQuestions[qIndex];
  const correctSoFar = qi - wrongCount + (picked !== null && picked === q?.correct ? 1 : 0);
  const chunk = chunks[chunkIdx];

  const beginQuiz = useCallback(() => {
    setQuestionOrder(shuffleIndices(totalQuestions));
    setQi(0);
    setPicked(null);
    setWrongCount(0);
    setPhase("quiz");
  }, [totalQuestions]);

  const restartLearn = () => {
    setChunkIdx(0);
    setPhase("learn");
  };

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i !== q.correct) setWrongCount((w) => w + 1);
  };

  const afterFeedback = () => {
    if (!q) return;
    if (picked !== q.correct) {
      setPhase("reteach");
      return;
    }
    goNextQuestion();
  };

  const goNextQuestion = () => {
    if (qi + 1 < totalQuestions) {
      setQi(qi + 1);
      setPicked(null);
      setPhase("quiz");
      return;
    }
    setPhase("results");
  };

  const claimRewards = async () => {
    setSubmitting(true);
    try {
      await onComplete(wrongCount, totalQuestions);
    } finally {
      setSubmitting(false);
    }
  };

  const finalCorrect = quizCorrectCount(wrongCount, totalQuestions);
  const isPerfect = quizPerfect(wrongCount);
  const passed = finalCorrect >= needToPass;
  const xpEarned = finalCorrect * XP_PER_CORRECT;
  const bestCorrect =
    typeof bestWrongCount === "number" ? totalQuestions - bestWrongCount : null;

  return (
    <div className="lesson-modal-backdrop" onClick={onClose}>
      <div className="lesson-modal lesson-modal-v2" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lesson-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <header className="lesson-modal-head">
          <div className="lesson-modal-hero-art" aria-hidden>
            <span className="lesson-modal-hero-emoji">{lesson.emoji}</span>
          </div>
          <div className="lesson-modal-head-text">
            <span className="lesson-modal-mod">{lesson.mod}</span>
            <h3>{lesson.title}</h3>
            <div className="lesson-modal-reward-pills">
              <span className="lesson-pill cash">+${LESSON_CASH_REWARD}</span>
              <span className="lesson-pill xp">up to {fullXp} XP</span>
              <span className="lesson-pill perfect">⭐ 10/10 = full XP</span>
            </div>
          </div>
        </header>

        {phase === "learn" && chunk && (
          <section className="lesson-learn">
            <div className="lesson-learn-progress">
              <span>
                Tip {chunkIdx + 1} of {chunks.length}
              </span>
              <div className="lesson-dots">
                {chunks.map((_, i) => (
                  <span key={i} className={`lesson-dot ${i <= chunkIdx ? "on" : ""}`} />
                ))}
              </div>
            </div>

            <div className="lesson-scene-card">
              <div className="lesson-scene-visual" aria-hidden>
                {chunk.visual ?? lesson.emoji}
              </div>
              <div className="lesson-chunk-card">
                <span className="lesson-chunk-icon">{chunk.icon}</span>
                <p className="lesson-chunk-text">{chunk.text}</p>
              </div>
            </div>

            <div className="lesson-learn-actions">
              {chunkIdx > 0 && (
                <button type="button" className="lesson-btn-ghost" onClick={() => setChunkIdx(chunkIdx - 1)}>
                  ← Back
                </button>
              )}
              {chunkIdx + 1 < chunks.length ? (
                <button type="button" className="lesson-btn-primary" onClick={() => setChunkIdx(chunkIdx + 1)}>
                  Got it! →
                </button>
              ) : (
                <button type="button" className="lesson-btn-primary" onClick={() => setPhase("ready")}>
                  I&apos;m ready! →
                </button>
              )}
            </div>
          </section>
        )}

        {phase === "ready" && (
          <section className="lesson-ready">
            <div className="lesson-ready-card">
              <span className="lesson-ready-icon">⚔️</span>
              <h4>Quiz time!</h4>
              <ul className="lesson-ready-rules">
                <li>
                  <strong>{totalQuestions}</strong> questions — shuffled each try
                </li>
                <li>
                  Need <strong>{needToPass}/{totalQuestions}</strong> to pass
                </li>
                <li>
                  <strong>10/10</strong> = Perfect Ace + full <strong>{fullXp} XP</strong>
                </li>
                <li>Miss one? We&apos;ll re-teach, then keep going</li>
              </ul>
              {alreadyDone && bestCorrect !== null && (
                <p className="lesson-ready-best">
                  Best: {bestCorrect}/{totalQuestions}
                  {bestCorrect < totalQuestions && " — retake for full XP!"}
                </p>
              )}
            </div>
            <button type="button" className="lesson-btn-primary" onClick={beginQuiz}>
              {alreadyDone ? "Retake quiz 🎲" : "Start quiz 🎯"}
            </button>
            <button type="button" className="lesson-btn-ghost" onClick={restartLearn}>
              Review tips again
            </button>
          </section>
        )}

        {(phase === "quiz" || (phase === "reteach" && picked !== null)) && q && phase === "quiz" && (
          <section className="lesson-quiz">
            <div className="lesson-quiz-top">
              <div className="lesson-quiz-prog-bar">
                <div
                  className="lesson-quiz-prog-fill"
                  style={{ width: `${((qi + (picked !== null ? 1 : 0)) / totalQuestions) * 100}%` }}
                />
              </div>
              <div className="lesson-quiz-meta">
                <span>Q {qi + 1}/{totalQuestions}</span>
                <span className="lesson-xp-live">+{XP_PER_CORRECT} XP each ✓</span>
              </div>
            </div>

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
                    disabled={picked !== null}
                  >
                    <span className="lesson-opt-letter">{["A", "B", "C"][i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className={`lesson-q-feedback ${picked === q.correct ? "ok" : "no"}`}>
                <b>{picked === q.correct ? `Nice! +${XP_PER_CORRECT} XP ⚡` : "Oops — let's learn this!"}</b>
                <p>{picked === q.correct ? q.why : "Tap below — we'll explain it quick."}</p>
                <button type="button" className="lesson-btn-primary" onClick={afterFeedback}>
                  {picked === q.correct ? "Next →" : "Show me →"}
                </button>
              </div>
            )}
          </section>
        )}

        {phase === "reteach" && q && (
          <section className="lesson-reteach">
            <div className="lesson-reteach-badge">📚 Quick re-teach</div>
            <div className="lesson-scene-card reteach">
              <div className="lesson-scene-visual small" aria-hidden>
                {lesson.emoji}
              </div>
              <div className="lesson-chunk-card warm">
                <span className="lesson-chunk-icon">🧠</span>
                <p className="lesson-chunk-text">{q.reteach ?? q.why}</p>
              </div>
            </div>
            <p className="lesson-reteach-encourage">
              No stress — mistakes help your brain grow. You&apos;ve got this!
            </p>
            <button type="button" className="lesson-btn-primary" onClick={goNextQuestion}>
              Got it — next question →
            </button>
          </section>
        )}

        {phase === "results" && (
          <section className="lesson-results">
            <div className={`lesson-results-badge ${isPerfect ? "perfect" : passed ? "pass" : "fail"}`}>
              {isPerfect ? "⭐ Perfect Ace!" : passed ? "✅ Passed!" : "📖 Keep practicing"}
            </div>

            <div className="lesson-score-ring">
              <span className="lesson-score-num">{finalCorrect}</span>
              <span className="lesson-score-of">/ {totalQuestions}</span>
            </div>

            <div className="lesson-star-row" aria-label={`${finalCorrect} of ${totalQuestions} correct`}>
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <span key={i} className={`lesson-star ${i < finalCorrect ? "lit" : ""}`}>
                  {i < finalCorrect ? "⭐" : "☆"}
                </span>
              ))}
            </div>

            <div className="lesson-results-rewards">
              {passed && !alreadyDone && (
                <div className="lesson-reward-line cash">
                  <span>💵</span> +${LESSON_CASH_REWARD} cash
                </div>
              )}
              <div className={`lesson-reward-line xp ${isPerfect ? "full" : "partial"}`}>
                <span>⚡</span> {xpEarned} XP
                {isPerfect ? " — full credit!" : ` — retake for ${fullXp} XP`}
              </div>
            </div>

            {!passed && (
              <p className="lesson-results-hint">
                Need {needToPass} correct to pass. Review tips and try again!
              </p>
            )}
            {passed && !isPerfect && (
              <p className="lesson-results-hint">
                You passed! Retake anytime — questions shuffle — for Perfect Ace ({fullXp} XP).
              </p>
            )}

            <div className="lesson-results-actions">
              {passed ? (
                <button
                  type="button"
                  className="lesson-btn-primary"
                  onClick={claimRewards}
                  disabled={submitting}
                >
                  {submitting ? "Saving…" : "Claim rewards 🎁"}
                </button>
              ) : (
                <>
                  <button type="button" className="lesson-btn-primary" onClick={restartLearn}>
                    Review tips
                  </button>
                  <button type="button" className="lesson-btn-ghost" onClick={beginQuiz}>
                    Try again 🎲
                  </button>
                </>
              )}
              {!passed && (
                <button type="button" className="lesson-btn-ghost" onClick={onClose}>
                  Close
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}