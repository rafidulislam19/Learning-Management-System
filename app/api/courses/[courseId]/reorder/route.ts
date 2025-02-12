import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Define the type for items in the list
interface ListItem {
    id: string;
    type: "chapter" | "quiz";
    position: number;
}

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

        // Explicitly type the list as an array of ListItem
        const typedList: ListItem[] = list.map((item: ListItem) => ({
            id: item.id,
            type: item.type,
            position: item.position,
        }));

        // Sort the list by position
        typedList.sort((a, b) => a.position - b.position);

        // Update positions for chapters and quizzes
        for (let i = 0; i < typedList.length; i++) {
            const item = typedList[i];
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