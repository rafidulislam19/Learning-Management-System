import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client"; 


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; quizId: string }> }
) {
    try {
        const { userId } = await auth();

        if(!userId ) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const quiz = await db.quiz.findUnique({
            where: {
                id: resolvedParams.quizId,
                courseId: resolvedParams.courseId,
            },
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", { status: 404 });
        }

        const deletedQuiz = await db.quiz.delete({
            where: {
                id: resolvedParams.quizId
            }
        });

        const publishedQuizInCourse = await db.quiz.findMany({
            where: {
                courseId: resolvedParams.courseId,
                isPublished: true,
            }
        })

        if(!publishedQuizInCourse.length) {
            await db.course.update({
                where: {
                    id: resolvedParams.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedQuiz);

    } catch (error) {
        console.log("[Quiz_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// export async function PATCH(
//     req: Request,
//     { params }: { params: { courseId: string; quizId: string } }
// ) {
//     try {
//         const { userId } = await auth();
//         const { title, questions } = await req.json(); // Destructure title and questions

//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const { courseId, quizId } = params;

//         const ownCourse = await db.course.findUnique({
//             where: {
//                 id: courseId,
//                 userId,
//             },
//         });

//         if (!ownCourse) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         // Update the quiz with the provided values
//         const updateData: any = {};

//         if (title !== undefined) {
//             updateData.title = title; // Update the title if provided
//         }

//         if (questions !== undefined) {
//             updateData.questions = {
//                 // Delete existing questions and create new ones
//                 deleteMany: {}, // This will delete all existing questions
//                 create: questions.map((q) => ({
//                     questionText: q.questionText,
//                     options: q.options,
//                     correctAnswer: q.correctAnswer,
//                 })),
//             };
//         }

//         const quiz = await db.quiz.update({
//             where: {
//                 id: quizId,
//                 courseId: courseId,
//             },
//             data: updateData,
//         });

//         return NextResponse.json(quiz);
//     } catch (error) {
//         console.error("[COURSES_QUIZ_ID]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }

interface Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

interface UpdateQuizData {
    title?: string;
    questions?: Question[];
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; quizId: string }> }
) {
    try {
        const { userId } = await auth();
        const { title, questions }: UpdateQuizData = await req.json(); // Destructure title and questions

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, quizId } = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Define the update data with a proper type (QuizUpdateInput)
        const updateData: Prisma.QuizUpdateInput = {};

        if (title !== undefined) {
            updateData.title = title; // Update the title if provided
        }

        if (questions !== undefined) {
            updateData.questions = {
                // Delete existing questions and create new ones
                deleteMany: {}, // This will delete all existing questions
                create: questions.map((q) => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                })),
            };
        }

        const quiz = await db.quiz.update({
            where: {
                id: quizId,
                courseId: courseId,
            },
            data: updateData,
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("[COURSES_QUIZ_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}