import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getLessonById,
  isLessonUnlocked,
  LESSON_CASH_REWARD,
  quizCorrectCount,
  quizPassed,
  xpForCorrectCount,
} from "@/lib/manual-lessons";
import { loadUserBundle } from "@/lib/user-data";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const lessonId = String(body.lessonId ?? "");
  const wrongCount = Math.max(0, Math.floor(Number(body.wrongCount) || 0));
  const totalQuestions = Math.max(1, Math.floor(Number(body.totalQuestions) || 1));

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });
  }

  const existingProgress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
  });
  const completedIds = existingProgress.map((p) => p.lessonId);
  const prior = existingProgress.find((p) => p.lessonId === lessonId);

  if (!isLessonUnlocked(lessonId, completedIds) && !prior) {
    return NextResponse.json({ error: "Complete the previous lesson first" }, { status: 400 });
  }

  if (!quizPassed(wrongCount, totalQuestions)) {
    const need = Math.ceil(totalQuestions * 0.7);
    return NextResponse.json(
      {
        error: `Need at least ${need}/${totalQuestions} correct to pass. Retake the quiz — questions shuffle each time!`,
      },
      { status: 400 }
    );
  }

  const correct = quizCorrectCount(wrongCount, totalQuestions);
  const prevCorrect = prior ? quizCorrectCount(prior.wrongCount, totalQuestions) : 0;
  const xpAwarded = Math.max(0, xpForCorrectCount(correct) - xpForCorrectCount(prevCorrect));

  let cashAwarded = 0;
  const firstPass = !prior;

  if (firstPass) {
    cashAwarded = LESSON_CASH_REWARD;
    await prisma.$transaction([
      prisma.lessonProgress.create({
        data: { userId: user.id, lessonId, wrongCount },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          cashBalance: { increment: cashAwarded },
          xp: { increment: xpForCorrectCount(correct) },
        },
      }),
    ]);
  } else if (correct > prevCorrect) {
    await prisma.$transaction([
      prisma.lessonProgress.update({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        data: { wrongCount },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { xp: { increment: xpAwarded } },
      }),
    ]);
  }

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({
    user: bundle,
    cashAwarded,
    xpAwarded: firstPass ? xpForCorrectCount(correct) : xpAwarded,
    correct,
    totalQuestions,
    improved: !firstPass && correct > prevCorrect,
    alreadyDone: !firstPass,
  });
}