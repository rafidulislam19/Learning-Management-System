import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;

        const course = await db.course.findUnique({
            where: {
                id: resolvedParams.courseId,
                userId,
            },
        });

        if(!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: resolvedParams.courseId,
                userId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unpublishedCourse);

    } catch (error) {
        console.log("[COURSES_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}