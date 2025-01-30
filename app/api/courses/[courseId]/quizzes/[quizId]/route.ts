import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";

// const { Video } = new Mux(
//     process.env.MUX_TOKEN_ID!, 
//     process.env.MUX_TOKEN_SECRET!,
//   );

// const mux = new Mux({
//     tokenId: process.env.MUX_TOKEN_ID,
//     tokenSecret: process.env.MUX_TOKEN_SECRET
//   });

// Access the Video API from the Mux instance
// const { video } = mux;

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; quizId: string } }
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

        // if(chapter.videoUrl) {
        //     const existingMuxData = await db.muxData.findFirst({
        //         where: {
        //             quizId: resolvedParams.quizId,
        //         }
        //     });

            // if(existingMuxData) {
            //     await video.assets.delete(existingMuxData.assetId);
            //     await db.muxData.delete({
            //         where: {
            //             id: existingMuxData.id,
            //         }
            //     });
            // }

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
        const { isPublished, ...values } = await req.json();

        if(!userId) {
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

        const quiz = await db.quiz.update({
            where: {
                id: resolvedParams.quizId,
                courseId: resolvedParams.courseId,
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