import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; quizId: string } }
) {
    try {
        const { userId } = await auth();
        const { score, answers, isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the quiz to get question texts
        const quiz = await db.quiz.findUnique({
            where: {
                id: params.quizId,
            },
            include: {
                questions: true,
            },
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        // Create user-friendly answers
        const userAnswers = quiz.questions.reduce((acc, question) => {
            const userAnswer = answers[question.id];
            const answerText = question.options[userAnswer] || "No answer";
            acc[question.questionText] = answerText;
            return acc;
        }, {} as { [key: string]: string });

        // Save the quiz progress
        const quizProgress = await db.quizProgress.upsert({
            where: {
                userId_quizId: {
                    userId,
                    quizId: params.quizId,
                },
            },
            update: {
                score,
                answers,
                userAnswers,
                isCompleted,
            },
            create: {
                userId,
                quizId: params.quizId,
                score,
                answers,
                userAnswers,
                isCompleted,
            },
        });

        return NextResponse.json(quizProgress);
    } catch (error) {
        console.error("[QUIZ_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}