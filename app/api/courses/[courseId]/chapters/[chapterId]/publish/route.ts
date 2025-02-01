import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string; chapterId: string }>}
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

        const chapter = await db.chapter.findUnique({
            where: {
                id: resolvedParams.chapterId,
                courseId: resolvedParams.courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: resolvedParams.chapterId,
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: resolvedParams.chapterId,
                courseId: resolvedParams.courseId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("CHAPTER_PUBLISH", error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
}