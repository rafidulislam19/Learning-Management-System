import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterHomeProps {
    courseId: string;
    chapterId: string;
}
export const getChapterHome = async ({
    courseId,
    chapterId,
}: GetChapterHomeProps) => {
    try {

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found!")
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        // if (purchase) {
        //     attachments = await db.attachment.findMany({
        //         where: {
        //             courseId: courseId
        //         }
        //     });
        // }

        if (chapter.isFree ) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    }
                },
                orderBy: {
                    position: "asc",
                }
            });
        }

        // const userProgress = await db.userProgress.findUnique({
        //     where: {
        //         userId_chapterId: {
        //             chapterId,
        //         }
        //     }
        // });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
        };

    } catch (error) {
        console.log("[GET_CHAPTER_HOME]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
        }
    }
}