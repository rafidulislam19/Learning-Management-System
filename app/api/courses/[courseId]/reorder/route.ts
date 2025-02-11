// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function PUT(
//     req: Request,
//     { params }: { params: { courseId: string } }
// ) {
//     try {
//         const { userId } = await auth();

//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const { list } = await req.json();

//         const ownCourse = await db.course.findUnique({
//             where: {
//                 id: params.courseId,
//                 userId: userId,
//             },
//         });

//         if (!ownCourse) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         for (const item of list) {
//             if (item.type === "chapter") {
//                 await db.chapter.update({
//                     where: { id: item.id },
//                     data: { position: item.position },
//                 });
//             } else if (item.type === "quiz") {
//                 await db.quiz.update({
//                     where: { id: item.id },
//                     data: { position: item.position },
//                 });
//             }
//         }

//         return new NextResponse("Success", { status: 200 });
//     } catch (error) {
//         console.log("[REORDER]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

        const resolvedParams = await params;

        const ownCourse = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId: userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Combine chapters and quizzes into a single list
        const mixedList = list.map(item => ({
            id: item.id,
            type: item.type,
            position: item.position,
        }));

        // Sort the list by position
        mixedList.sort((a, b) => a.position - b.position);

        // Update positions for chapters and quizzes
        for (let i = 0; i < mixedList.length; i++) {
            const item = mixedList[i];
            if (item.type === "chapter") {
                await db.chapter.update({
                    where: { id: item.id },
                    data: { position: i + 1 }, // Setting new position
                });
            } else if (item.type === "quiz") {
                await db.quiz.update({
                    where: { id: item.id },
                    data: { position: i + 1 }, // Setting new position
                });
            }
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
