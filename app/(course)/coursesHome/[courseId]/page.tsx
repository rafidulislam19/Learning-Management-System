import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseHomeIdPage = async ({
    params
}: {
    params: { courseId: string; }
}) => {
    // const resolvedParams = await params;
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
        
    });

    if (!course) {
        return redirect("/");
    }

    return redirect(`/coursesHome/${course.id}/chaptersHome/${course.chapters[0].id}`);
}
 
export default CourseHomeIdPage;