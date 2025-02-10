// import { Chapter, Course } from "@prisma/client";
// import { CourseHomeSidebarItem } from "./course-home-sidebar-item";

// interface CourseHomeSidebarProps {
//     course: Course & {
//         chapters: Chapter[]
//     };
// }
// export const CourseHomeSidebar = async ({
//     course,
// }: CourseHomeSidebarProps) => {

//     return ( 
//         <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
//             <div className="p-7 flex flex-col">
//                 <h1 className="font-semibold text-lg">
//                     {course.title}
//                 </h1>
            
//             </div>
//             <div className="flex flex-col w-full">
//                 {course.chapters.map((chapter) => (
//                     <CourseHomeSidebarItem
//                         key={chapter.id}
//                         id={chapter.id}
//                         label={chapter.title}
//                         courseId={course.id}
//                         isLocked={!chapter.isFree}
//                     />
//                 ))}
//             </div>
//         </div>
//      );
// }

import { Chapter, Course, Quiz } from "@prisma/client";
import { CourseHomeSidebarItem } from "./course-home-sidebar-item";

interface CourseHomeSidebarProps {
    course: {
        chapters: ({
            position: number; // Ensure position exists
        }) & Chapter[];
        quizzes: ({
            position: number; // Ensure position exists
        }) & Quiz[];
    } & Course;
}

// export const CourseHomeSidebar = async ({
//     course,
// }: CourseHomeSidebarProps) => {

//     // Merge and sort chapters and quizzes by position
//     const items = [...course.chapters, ...course.quizzes].sort(
//         (a, b) => a.position - b.position
//     );

//     return (
//         <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
//             <div className="p-7 flex flex-col">
//                 <h1 className="font-semibold">{course.title}</h1>
//             </div>
//             <div className="flex flex-col w-full">
//                 {items.map((item) => (
//                     <CourseHomeSidebarItem
//                         key={item.id}
//                         id={item.id}
//                         label={item.title}
//                         courseId={course.id}
//                         isLocked={"isFree" in item
//                                 && !item.isFree}
//                         type={item.type}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

export const CourseHomeSidebar = async ({ course }: CourseHomeSidebarProps) => {
    const chapters = course.chapters || []; // Fallback to empty array
    const quizzes = course.quizzes || [];   // Fallback to empty 
    console.log(quizzes);
    console.log(chapters);

    const items = [...chapters, ...quizzes].sort(
        (a, b) => a.position - b.position
    );

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-gray-900">
            <div className="p-7 flex flex-col">
                <h1 className="font-semibold">{course.title}</h1>
            </div>
            <div className="flex flex-col w-full">
                {items.map((item) => (
                    <CourseHomeSidebarItem
                        key={item.id}
                        id={item.id}
                        label={item.title}
                        courseId={course.id}
                        isLocked={item.type=="chapter"? "isFree" in item? !item.isFree: false: true}
                        type={item.type}
                    />
                ))}
            </div>
        </div>
    );
};
