"use client"

import { cn } from "@/lib/utils";
import { Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseHomeSidebarProps {
    label: string;
    id: string;
    courseId: string;
    isLocked: boolean;
};

export const CourseHomeSidebarItem = ({
    label,
    id,
    courseId,
    isLocked,
}: CourseHomeSidebarProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : PlayCircle;
    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/coursesHome/${courseId}/chaptersHome/${id}`);
    }

    return ( 
        <button
        onClick={onClick}
        type="button"
        className={cn(
            "flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isActive && "text-slate-700 dark:text-slate-300 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
            
        )}>
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500 dark:text-slate-400",
                        isActive && "text-slate-700 dark:text-slate-300",
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 dark:border-slate-400 h-full transition-all",
                isActive && "opacity-100",
            )} />
             
        </button>
     );
}