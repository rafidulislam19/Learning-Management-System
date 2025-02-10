// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function PATCH(
//     req: Request,
//     { params }: { params: Promise<{ courseId: string; quizId: string }>}
// ) {
//     try {
//         const { userId } = await auth();

//         if(!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const resolvedParams = await params;

//         const ownCourse = await db.course.findUnique({
//             where: {
//                 id: resolvedParams.courseId,
//                 userId
//             }
//         });

//         if(!ownCourse) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const quiz = await db.quiz.findUnique({
//             where: {
//                 id: resolvedParams.quizId,
//                 courseId: resolvedParams.courseId
//             }
//         });


//         if (!quiz || !quiz.title) {
//             return new NextResponse("Missing required fields", { status: 400 });
//         }

//         const publishedQuiz = await db.quiz.update({
//             where: {
//                 id: resolvedParams.quizId,
//                 courseId: resolvedParams.courseId,
//             },
//             data: {
//                 isPublished: true,
//             }
//         });

//         return NextResponse.json(publishedQuiz);

//     } catch (error) {
//         console.log("Quiz_PUBLISH", error);
//         return new NextResponse("Internal Error!", { status: 500 });
//     }
// }

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; quizId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const quiz = await db.quiz.findUnique({
            where: {
                id: resolvedParams.quizId,
                courseId: resolvedParams.courseId,
            },
            include: {
                questions: true, // Include questions for validation
            },
        });

        if (!quiz || !quiz.title) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // ✅ Validation for questions
        if (!quiz.questions || quiz.questions.length === 0) {
            return new NextResponse("Quiz must have at least one question.", { status: 400 });
        }

        for (const question of quiz.questions) {
            if (!question.questionText.trim()) {
                return new NextResponse("Each question must have text.", { status: 400 });
            }

            const options = question.options;

            if (
                !options ||
                typeof options !== "object" ||
                Object.keys(options).length < 2
            ) {
                return new NextResponse("Each question must have at least two options.", {
                    status: 400,
                });
            }

            if (
                !question.correctAnswer ||
                !Object.keys(options).includes(question.correctAnswer)
            ) {
                return new NextResponse(
                    "Correct answer must match one of the provided options.",
                    { status: 400 }
                );
            }
        }

        const publishedQuiz = await db.quiz.update({
            where: {
                id: resolvedParams.quizId,
                courseId: resolvedParams.courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedQuiz);
    } catch (error) {
        console.log("QUIZ_PUBLISH_ERROR:", error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
}
