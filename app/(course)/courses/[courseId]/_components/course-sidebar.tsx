// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { Chapter, Course, UserProgress } from "@prisma/client";
// import { redirect } from "next/navigation";
// import { CourseSidebarItem } from "./course-sidebar-item";
// import { CourseProgress } from "@/components/course-progress";

// interface CourseSidebarProps {
//     course: Course & {
//         chapters: ( Chapter & {
//             userProgress: UserProgress[] | null;
//         })[]
//     };
//     progressCount: number;
// }
// export const CourseSidebar = async ({
//     course,
//     progressCount,
// }: CourseSidebarProps) => {

//     const { userId } = await auth();

//     if(!userId) {
//         return redirect("/home");
//     }

//     const purchase = await db.purchase.findUnique({
//         where: {
//             userId_courseId: {
//                 userId,
//                 courseId: course.id,
//             }
//         }
//     });

//     return ( 
//         <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
//             <div className="p-7 flex flex-col">
//                 <h1 className="font-semibold">
//                     {course.title}
//                 </h1>
//                 { purchase && (
//                     <div className="mt-10">
//                         <CourseProgress
//                             variant="success"
//                             value={progressCount}
//                         />
//                     </div>
//                 ) }
//             </div>
//             <div className="flex flex-col w-full">
//                 {course.chapters.map((chapter) => (
//                     <CourseSidebarItem
//                         key={chapter.id}
//                         id={chapter.id}
//                         label={chapter.title}
//                         isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
//                         courseId={course.id}
//                         isLocked={!chapter.isFree && !purchase}
//                     />
//                 ))}
//             </div>
//         </div>
//      );
// }

// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { CourseSidebarItem } from "./course-sidebar-item";
// import { CourseProgress } from "@/components/course-progress";
// import { Chapter, Course, Quiz, QuizProgress, UserProgress } from "@prisma/client";

// interface CourseSidebarProps {
//     course: {
//         chapters: ({
//             userProgress: UserProgress[];
//         }) & Chapter[];
//         quizzes: ({
//             quizProgress: QuizProgress[];
//         }) & Quiz[];
//     } & Course;
//     progressCount: number;
// }

// export const CourseSidebar = async ({
//     course,
//     progressCount,
// }: CourseSidebarProps) => {
//     const { userId } = await auth();

//     if (!userId) {
//         return redirect("/home");
//     }

//     const purchase = await db.purchase.findUnique({
//         where: {
//             userId_courseId: {
//                 userId,
//                 courseId: course.id,
//             },
//         },
//     });

//     return (
//         <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
//             <div className="p-7 flex flex-col">
//                 <h1 className="font-semibold">{course.title}</h1>
//                 {purchase && (
//                     <div className="mt-10">
//                         <CourseProgress variant="success" value={progressCount} />
//                     </div>
//                 )}
//             </div>
//             <div className="flex flex-col w-full">
//                 {course.chapters.map((chapter) => (
//                     <CourseSidebarItem
//                         key={chapter.id}
//                         id={chapter.id}
//                         label={chapter.title}
//                         isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
//                         courseId={course.id}
//                         isLocked={!chapter.isFree && !purchase}
//                         type="chapter"
//                     />
//                 ))}
//                 {course.quizzes?.map((quiz) => (
//                     <CourseSidebarItem
//                         key={quiz.id}
//                         id={quiz.id}
//                         label={quiz.title}
//                         isCompleted={!!quiz.quizProgress?.[0]?.isCompleted}
//                         courseId={course.id}
//                         isLocked={!purchase} // Quizzes are locked if the course isn't purchased
//                         type="quiz"
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { CourseSidebarItem } from "./course-sidebar-item";
// import { CourseProgress } from "@/components/course-progress";
// import { Chapter, Course, Quiz, QuizProgress, UserProgress } from "@prisma/client";

// interface CourseSidebarProps {
//     course: {
//         chapters: ({
//             userProgress: UserProgress[];
//             position: number; // Ensure position exists
//         }) & Chapter[];
//         quizzes: ({
//             quizProgress: QuizProgress[];
//             position: number; // Ensure position exists
//         }) & Quiz[];
//     } & Course;
//     progressCount: number;
// }

// export const CourseSidebar = async ({
//     course,
//     progressCount,
// }: CourseSidebarProps) => {
//     const { userId } = await auth();

//     if (!userId) {
//         return redirect("/home");
//     }

//     const purchase = await db.purchase.findUnique({
//         where: {
//             userId_courseId: {
//                 userId,
//                 courseId: course.id,
//             },
//         },
//     });

//     // Merge and sort chapters and quizzes by position
//     const items = [...course.chapters, ...course.quizzes].sort(
//         (a, b) => a.position - b.position
//     );

//     return (
//         <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
//             <div className="p-7 flex flex-col">
//                 <h1 className="font-semibold">{course.title}</h1>
//                 {purchase && (
//                     <div className="mt-10">
//                         <CourseProgress variant="success" value={progressCount} />
//                     </div>
//                 )}
//             </div>
//             <div className="flex flex-col w-full">
//                 {items.map((item) => (
//                     <CourseSidebarItem
//                         key={item.id}
//                         id={item.id}
//                         label={item.title}
//                         isCompleted={
//                             "userProgress" in item
//                                 ? !!item.userProgress?.[0]?.isCompleted
//                                 : !!item.quizProgress?.[0]?.isCompleted
//                         }
//                         courseId={course.id}
//                         isLocked={
//                             "isFree" in item
//                                 ? !item.isFree && !purchase
//                                 : !purchase
//                         }
//                         type={"userProgress" in item ? "chapter" : "quiz"}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { Chapter, Course, Quiz, QuizProgress, UserProgress } from "@prisma/client";

interface ChapterWithProgress extends Chapter {
    userProgress?: UserProgress[];
    position: number;
}

interface QuizWithProgress extends Quiz {
    quizProgress?: QuizProgress[];
    position: number;
}

interface CourseSidebarProps {
    course: {
        chapters: ChapterWithProgress[];
        quizzes: QuizWithProgress[];
    } & Course;
    progressCount: number;
}

export const CourseSidebar = async ({
    course,
    progressCount,
}: CourseSidebarProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/home");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            },
        },
    });

    // Merge and sort chapters and quizzes by position
    const items = [...course.chapters, ...course.quizzes].sort(
        (a, b) => a.position - b.position
    );

    // Type Guards
    const isChapter = (item: ChapterWithProgress | QuizWithProgress): item is ChapterWithProgress =>
        "userProgress" in item;

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
            <div className="p-7 flex flex-col">
                <h1 className="font-semibold">{course.title}</h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {items.map((item) => (
                    <CourseSidebarItem
                        key={item.id}
                        id={item.id}
                        label={item.title}
                        isCompleted={
                            isChapter(item)
                                ? !!item.userProgress?.[0]?.isCompleted
                                : !!item.quizProgress?.[0]?.isCompleted
                        }
                        courseId={course.id}
                        isLocked={"isFree" in item ? !item.isFree && !purchase : !purchase}
                        type={isChapter(item) ? "chapter" : "quiz"}
                    />
                ))}
            </div>
        </div>
    );
};

