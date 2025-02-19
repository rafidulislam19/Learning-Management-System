"use client"

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { isTeacher } from "@/lib/teacher";
import DarkModeToggle from "./darkModeToggle";

export const NavbarRoutes = () => {
    const { userId } = useAuth();
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isCourseHomePage = pathname?.includes("/coursesHome");

    return ( 
        <>
        <div className="flex gap-x-2 ml-auto">
            <div className="mr-2 flex items-center">
            <DarkModeToggle />
            </div>
            {isCourseHomePage ? (
                <Link href="/">
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2 font-semibold"/>
                    Exit
                </Button>
                </Link>
            ): isTeacherPage || isCoursePage ? (
                <Link href="/home">
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-2 mr-1 font-semibold"/>
                    Exit
                </Button>
                </Link>
            ) : isTeacher(userId) ? (
                <Link href="/teacher/courses">
                 <Button size="sm" className="text-white bg-sky-600 hover:bg-sky-700 mr-3 font-semibold">
                    Teacher Mode
                 </Button>
                </Link>
            ): !userId ? (
                <div className="flex items-center"> 
                <Link href="/sign-in">
                 <Button variant="outline" className="h-9 md:h-10 rounded-md px-2 md:px-4 text-sky-600 hover:text-sky-600 border border-sky-600 dark:bg-gray-900 hover:bg-sky-600/10 dark:hover:bg-sky-800/10 mr-3 font-semibold">
                    Login
                 </Button>
                </Link>
                <Link href="/sign-up">
                 <Button className="h-9 md:h-10 rounded-md px-2 md:px-4 text-white bg-sky-600 hover:bg-sky-700 font-semibold">
                    Sign up
                 </Button>
                </Link>
                </div>
            ): (
                <Link href="/search">
                 <Button variant="outline" size="sm" className="text-sky-600 hover:text-sky-600 border border-sky-600 hover:bg-sky-600/10 mr-3 font-semibold">
                    My Courses
                 </Button>
                </Link>
            ) }
            <UserButton
             afterSignOutUrl="/" />
        </div>
        </>
     );
}
