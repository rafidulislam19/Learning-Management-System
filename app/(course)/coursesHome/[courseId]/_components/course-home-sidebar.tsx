import { Chapter, Course } from "@prisma/client";
import { CourseHomeSidebarItem } from "./course-home-sidebar-item";

interface CourseHomeSidebarProps {
    course: Course & {
        chapters: Chapter[]
    };
}
export const CourseHomeSidebar = async ({
    course,
}: CourseHomeSidebarProps) => {

    return ( 
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
            <div className="p-7 flex flex-col">
                <h1 className="font-semibold text-lg">
                    {course.title}
                </h1>
            
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseHomeSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        courseId={course.id}
                        isLocked={!chapter.isFree}
                    />
                ))}
            </div>
        </div>
     );
}