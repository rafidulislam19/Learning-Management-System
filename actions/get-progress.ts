// import { db } from "@/lib/db";

// export const getProgress = async (
//     userId: string,
//     courseId: string,
// ): Promise<number> => {
//     try {
//         const publishedChapters = await db.chapter.findMany({
//             where: {
//                 courseId: courseId,
//                 isPublished: true,
//             },
//             select: {
//                 id: true,
//             }
//         });

//         const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

//         const validCompletedChapters = await db.userProgress.count({
//             where: {
//                 userId: userId,
//                 chapterId: {
//                     in: publishedChapterIds,
//                 },
//                 isCompleted: true,
//             }
//         });

//         const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

//         return progressPercentage;

//     } catch (error) {
//         console.log("GET_PROGRESS", error);
//         return 0;
//     }
// }

import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        // Fetch published chapters
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

        // Count completed chapters
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true,
            },
        });

        // Fetch published quizzes
        const publishedQuizzes = await db.quiz.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

        const publishedQuizIds = publishedQuizzes.map((quiz) => quiz.id);

        // Count completed quizzes
        const validCompletedQuizzes = await db.quizProgress.count({
            where: {
                userId: userId,
                quizId: {
                    in: publishedQuizIds,
                },
                isCompleted: true,
            },
        });

        // Calculate total progress
        const totalItems = publishedChapterIds.length + publishedQuizIds.length;
        const completedItems = validCompletedChapters + validCompletedQuizzes;

        const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        return progressPercentage;
    } catch (error) {
        console.log("GET_PROGRESS", error);
        return 0;
    }
};