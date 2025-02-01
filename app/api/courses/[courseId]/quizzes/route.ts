import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{courseId: string}>}
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;

        const courseOwner = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastQuiz = await db.quiz.findFirst({
            where: {
                courseId: resolvedParams.courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastQuiz ? lastQuiz.position + 1 : 1;

        const quiz = await db.quiz.create({
            data: {
                title,
                courseId: resolvedParams.courseId,
                position: newPosition,
            }
        });

        return NextResponse.json(quiz);

    } catch (error) {
        console.log("[QUIZZES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}