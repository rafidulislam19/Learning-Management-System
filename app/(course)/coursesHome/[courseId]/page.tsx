import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseHomeIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string; }>
}) => {
    const resolvedParams = await params;
    const course = await db.course.findUnique({
        where: {
            id: resolvedParams.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc"
                }
            },
            quizzes: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        }
        
    });

    if (!course) {
        return redirect("/");
    }

    return redirect(`/coursesHome/${course.id}/chaptersHome/${course.chapters[0].id}`);
}
 
export default CourseHomeIdPage;