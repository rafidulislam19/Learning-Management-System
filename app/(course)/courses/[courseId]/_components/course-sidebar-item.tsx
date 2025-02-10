// "use client"

// import { cn } from "@/lib/utils";
// import { CheckCircle, Lock, PlayCircle, NotepadText } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";

// interface CourseSidebarItemProps {
//     label: string;
//     id: string;
//     isCompleted: boolean;
//     courseId: string;
//     isLocked: boolean;
//     type: "chapter" | "quiz"; // Add type to differentiate between chapters and quizzes
// }

// export const CourseSidebarItem = ({
//     label,
//     id,
//     isCompleted,
//     courseId,
//     isLocked,
//     type,
// }: CourseSidebarItemProps) => {
//     const pathname = usePathname();
//     const router = useRouter();

//     const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
//     const isActive = pathname?.includes(id);

//     const onClick = () => {
//         if (type === "chapter") {
//             router.push(`/courses/${courseId}/chapters/${id}`);
//         } else if (type === "quiz") {
//             router.push(`/courses/${courseId}/quizzes/${id}`);
//         }
//     };

//     return (
//         <button
//             onClick={onClick}
//             type="button"
//             className={cn(
//                 "flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
//                 isActive && "text-slate-700 dark:text-slate-300 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
//                 isCompleted && "text-emerald-700 hover:text-emerald-700",
//                 isCompleted && isActive && "bg-emerald-200/20"
//             )}
//         >
//             <div className="flex items-center gap-x-2 py-4">
//                 <Icon
//                     size={22}
//                     className={cn(
//                         "text-slate-500 dark:text-slate-400",
//                         isActive && "text-slate-700 dark:text-slate-300",
//                         isCompleted && "text-emerald-700 dark:text-emerald-500"
//                     )}
//                 />
//                 {label}
//             </div>
//             <div
//                 className={cn(
//                     "ml-auto opacity-0 border-2 border-slate-700 dark:border-slate-400 h-full transition-all",
//                     isActive && "opacity-100",
//                     isCompleted && "border-emerald-700 dark:border-emerald-500"
//                 )}
//             />
//         </button>
//     );
// };

"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle, NotepadText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
    type: "chapter" | "quiz"; // Differentiates between chapters and quizzes
}

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked,
    type,
}: CourseSidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    // Icon Logic:
    const Icon = isLocked 
        ? Lock 
        : type === "quiz"
            ? isCompleted 
                ? CheckCircle   // Green CheckCircle after quiz submission
                : NotepadText   // NotepadText initially for quizzes
            : isCompleted 
                ? CheckCircle   // CheckCircle for completed chapters
                : PlayCircle;   // PlayCircle for uncompleted chapters

    const isActive = pathname?.includes(id);

    const onClick = () => {
        if (type === "chapter") {
            router.push(`/courses/${courseId}/chapters/${id}`);
        } else if (type === "quiz") {
            router.push(`/courses/${courseId}/quizzes/${id}`);
        }
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive && "text-slate-700 dark:text-slate-300 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-200/20"
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500 dark:text-slate-400",
                        isActive && "text-slate-700 dark:text-slate-300",
                        isCompleted && "text-emerald-700 dark:text-emerald-500"
                    )}
                />
                {label}
            </div>
            <div
                className={cn(
                    "ml-auto opacity-0 border-2 border-slate-700 dark:border-slate-400 h-full transition-all",
                    isActive && "opacity-100",
                    isCompleted && "border-emerald-700 dark:border-emerald-500"
                )}
            />
        </button>
    );
};
