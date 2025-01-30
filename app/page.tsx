import { SearchInput } from "@/components/search-input";
import { Navbar } from "./(dashboard)/_components/navbar";
import { Button } from "@/components/ui/button";
import { Categories } from "./(dashboard)/(routes)/search/_components/categories";
import { CoursesList } from "@/components/courses-list";
import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Logo } from "./(dashboard)/_components/logo";
import { getAllCourses } from "@/actions/get-all-courses";
import { CoursesListHome } from "@/components/courses-list-home";
import Footer from "@/components/footer";
import BannerCarousel from "@/components/banner-carousel";

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
  };

export default async function Home({
    searchParams
}: SearchPageProps) {

    // const { userId } = await auth();
    // if(!userId) {
    //     return redirect("/");
    //   }

    const categories = await db.category.findMany({
              orderBy: {
                  name: "asc",
              },
          });
      
        const resolvedSearchParams = await searchParams;
    
        const courses = await getAllCourses({
            ...resolvedSearchParams,
        }); 
    return ( 
        
        <div>
            <div className="h-[75px] fixed inset-y-0 w-full z-50">    
                        <Navbar />
            </div>
            <BannerCarousel />
        <div className="p-6 space-y-4">
            <div className="my-8 text-left">
                <h1 className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-serif font-semibold my-4">All the skills you need in one place</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-xl">From critical skills to technical topics, LMS supports your professional development.</p>
            </div>
            <div>
            <h1 className="text-3xl font-semibold text-center text-sky-600 py-5">Categories</h1>
            <Categories
                items={categories}
            />
            </div>
            <div id="courses">
            <h1 className="text-3xl font-semibold text-center text-sky-600 py-5" >Our Courses</h1>
            <CoursesListHome items={courses} />
            </div>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
        </div>
     );
}