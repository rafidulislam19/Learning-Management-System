import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CourseHomeNavbar } from "./_components/course-home-navbar";
import { CourseHomeSidebar } from "./_components/course-home-sidebar";

const CourseHomeLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) => {

    const resolvedParams = await params;

    const course = await db.course.findUnique({
        where: {
            id: resolvedParams.courseId,
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
        },
    });

    if (!course) {
        redirect("/");
    }

    return ( 
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseHomeNavbar 
                    course={course}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseHomeSidebar 
                    course={course}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
     );
}
 
export default CourseHomeLayout;