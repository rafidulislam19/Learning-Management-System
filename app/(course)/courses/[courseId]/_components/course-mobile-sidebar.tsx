
// import {
//     Sheet,
//     SheetContent,
//     SheetTrigger
// } from "@/components/ui/sheet"
// import { Chapter, Course, Quiz, UserProgress } from "@prisma/client";
// import { Menu } from "lucide-react";
// import { CourseSidebar } from "./course-sidebar";

// interface CourseMobileSidebarProps {
//     course: Course & {
//         chapters: (Chapter & {
//             userProgress: UserProgress[] | null;
//         })[];
//         quizzes: Quiz[]; // Add quizzes field
//     };
//     progressCount: number;
// }

// export const CourseMobileSidebar = ({
//     course,
//     progressCount
// }: CourseMobileSidebarProps) => {
//     return (
//         <Sheet>
//         <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
//             <Menu />
//         </SheetTrigger>
//         <SheetContent side="left" className="p-0 bg-white dark:bg-gray-900 w-72">
//             <CourseSidebar
//                 course={course}
//                 progressCount={progressCount}
//             />
//         </SheetContent>
//     </Sheet>
//     )
// }

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Chapter, Course, Quiz, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress?: UserProgress[];  // Changed to match the expected type
        })[];
        quizzes: Quiz[]; // Add quizzes field
    };
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white dark:bg-gray-900 w-72">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    )
}
