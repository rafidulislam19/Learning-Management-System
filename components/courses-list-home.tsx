import { Category, Course } from "@prisma/client";
import { CourseCardHome } from "./course-card-home";

type CourseWithCategory  = Course & {
    category: Category | null;
    chapters: { id: string }[];
};

interface CoursesListHomeProps {
    items: CourseWithCategory[];
}


export const CoursesListHome = ({ items }: CoursesListHomeProps) => {
    return ( 
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item, i) => (
                    <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-delay={`${i*150}`}>
                    <CourseCardHome
                    key={item.id} 
                    id={item.id} 
                    title={item.title}
                    imageUrl={item.imageUrl!} // Provide a default image
                    chaptersLength={item.chapters.length}
                    price={typeof item.price === "number" ? item.price : 0} // Ensure price is always a number
                    category={item.category?.name || "Uncategorized"} // Handle null category safely
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
