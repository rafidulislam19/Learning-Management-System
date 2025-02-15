import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory  = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}
export const CoursesList = ({
    items
}: CoursesListProps) => {
    return ( 
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item,i)=> (
                    <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-delay={`${i*150}`}>
                    <CourseCard
                       key={item.id} 
                       id={item.id} 
                       title={item.title}
                       imageUrl={item.imageUrl!}
                       chaptersLength={item.chapters.length}
                       price={typeof item.price === "number" ? item.price : 0}
                       progress={item.progress}
                       category={item.category?.name || "Uncategorized"}
                    />
                    </div>
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