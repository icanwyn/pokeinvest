import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getLessonById,
  isLessonUnlocked,
  LESSON_CASH_REWARD,
  quizPassed,
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

  if (!isLessonUnlocked(lessonId, completedIds)) {
    return NextResponse.json({ error: "Complete the previous lesson first" }, { status: 400 });
  }

  if (!quizPassed(wrongCount, totalQuestions)) {
    return NextResponse.json(
      { error: "Quiz not passed — get every question right to unlock and earn $100!" },
      { status: 400 }
    );
  }

  const alreadyDone = completedIds.includes(lessonId);
  let cashAwarded = 0;
  let xpAwarded = 0;

  if (!alreadyDone) {
    cashAwarded = LESSON_CASH_REWARD;
    xpAwarded = lesson.xp;
    await prisma.$transaction([
      prisma.lessonProgress.create({
        data: { userId: user.id, lessonId, wrongCount },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          cashBalance: { increment: cashAwarded },
          xp: { increment: xpAwarded },
        },
      }),
    ]);
  }

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({
    user: bundle,
    cashAwarded,
    xpAwarded,
    alreadyDone,
  });
}