
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Chapter, Course } from "@prisma/client";
import { Menu } from "lucide-react";
import { CourseHomeSidebar } from "./course-home-sidebar";

interface CourseHomeMobileSidebarProps {
    course: Course & {
            chapters: Chapter[]
        };
};

export const CourseHomeMobileSidebar = ({
    course,
}: CourseHomeMobileSidebarProps) => {
    return (
        <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white dark:bg-gray-900 w-72">
            <CourseHomeSidebar
                course={course}
            />
        </SheetContent>
        </Sheet>
    )
}