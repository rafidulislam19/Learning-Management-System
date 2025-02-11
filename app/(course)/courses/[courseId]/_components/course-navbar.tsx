import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, Quiz, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: Course & {
            chapters: (Chapter & {
                userProgress?: UserProgress[];  // Changed to match the expected type
            })[];
            quizzes: Quiz[]; // Add quizzes field
        };
        progressCount: number;
}

export const CourseNavbar = ({
    course,
    progressCount,
}: CourseNavbarProps) => {
    return ( 
        <div className="p-4 border-b h-full flex items-center bg-white dark:bg-gray-900">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
     );
}