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
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if(!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if(!course.title || !course.description || !course.imageUrl || !course.categoryId ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: resolvedParams.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.log("[COURSES_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}