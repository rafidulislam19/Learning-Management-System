import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "../(root)/_components/info-card";
import { CheckCircle, Clock } from "lucide-react";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";

// interface SearchPageProps {
//     searchParams: {
//         title: string;
//         categoryId: string;
//     }
// };

const SearchPage = async () => {
    const { userId } = await auth();

    if(!userId) {
        return redirect("/home");
    }

    // const categories = await db.category.findMany({
    //     orderBy: {
    //         name: "asc",
    //     },
    // });


    // const resolvedSearchParams = await searchParams;

    // const courses = await getCourses({
    //     userId,
    //     ...resolvedSearchParams,
    // });
    
    const {
    completedCourses,
    coursesInProgress
    } = await getDashboardCourses(userId);

    return ( 
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
            <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={coursesInProgress.length}
            />
            <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={completedCourses.length}
            variant="success"
            />
        </div>
        <div className="p-6">
        <CoursesList
          items={[...coursesInProgress, ...completedCourses]}
        />
        </div>

        </>
     );
}
 
export default SearchPage;