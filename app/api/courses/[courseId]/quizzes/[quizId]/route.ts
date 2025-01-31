import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; quizId: string } }
) {
    try {
        const { userId } = await auth();

        if(!userId ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // const resolvedParams = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const quiz = await db.quiz.findUnique({
            where: {
                id: params.quizId,
                courseId: params.courseId,
            },
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        const deletedQuiz = await db.quiz.delete({
            where: {
                id: params.quizId
            }
        });

        const publishedQuizInCourse = await db.quiz.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })

        if(!publishedQuizInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedQuiz);

    } catch (error) {
        console.log("[QUIZ_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; quizId: string }}
) {
    try {
        const { userId } = await auth();
        const {...values } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // const params = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const quiz = await db.quiz.update({
            where: {
                id: params.quizId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.log("[COURSES_QUIZ_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}