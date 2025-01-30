import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course } from "@prisma/client";
import { CourseHomeMobileSidebar } from "./course-home-mobile-sidebar";

interface CourseHomeNavbarProps {
    course: Course & {
        chapters: Chapter[]
    };
}

export const CourseHomeNavbar = ({
    course,
}: CourseHomeNavbarProps) => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-900">
            <CourseHomeMobileSidebar
                course={course}
            />
            <NavbarRoutes />
        </div>
     );
}