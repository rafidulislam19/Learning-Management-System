import { Category, Course } from "@prisma/client";
import { CourseCardHome } from "./course-card-home";

type CourseWithCategory  = Course & {
    category: Category | null;
    chapters: { id: string }[];
};

interface CoursesListHomeProps {
    items: CourseWithCategory[];
}
export const CoursesListHome = ({
    items
}: CoursesListHomeProps) => {
    return ( 
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item)=> (
                    <CourseCardHome
                       key={item.id} 
                       id={item.id} 
                       title={item.title}
                       imageUrl={item.imageUrl!}
                       chaptersLength={item.chapters.length}
                       price={item.price!}
                       category={item?.category?.name!}
                    /> 
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-md text-muted-foreground mt-10">
                    No courses found!
                </div>
            )}
        </div>
     );
}