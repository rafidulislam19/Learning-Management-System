import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; quizId: string }>}
) {
    try {
        const { userId } = await auth();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId
            }
        });

        if(!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unpublishedQuiz = await db.quiz.update({
            where: {
                id: resolvedParams.quizId,
                courseId: resolvedParams.courseId,
            },
            data: {
                isPublished: false,
            }
        });

        const publishedQuizInCourse = await db.quiz.findMany({
            where: {
                courseId: resolvedParams.courseId,
                isPublished: true,
            },
        });

        if (!publishedQuizInCourse.length) {
            await db.course.update({
                where: {
                    id: resolvedParams.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(unpublishedQuiz);

    } catch (error) {
        console.log("CHAPTER_UNPUBLISH", error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
}