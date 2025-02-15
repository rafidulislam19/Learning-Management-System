import { Navbar } from "./(dashboard)/_components/navbar";
import { Categories } from "./(dashboard)/(routes)/search/_components/categories";
import { db } from "@/lib/db";
import { getAllCourses } from "@/actions/get-all-courses";
import { CoursesListHome } from "@/components/courses-list-home";
import Footer from "@/components/footer";
import BannerCarousel from "@/components/banner-carousel";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import About from "@/components/about";
import Feature from "@/components/feature";
import Image from "next/image";

interface SearchPageProps {
    searchParams: Promise<{
        title: string;
        categoryId: string;
    }>
  };

export default async function Home({
    searchParams
}: SearchPageProps) {

    const categories = await db.category.findMany({
              orderBy: {
                  name: "asc",
              },
          });
      
        const resolvedSearchParams = await searchParams;
    
        const courses = await getAllCourses({
            ...resolvedSearchParams,
        });

        const { userId } = await auth();

        if ( userId ) {
            return redirect('/home');
        }

    return ( 
        
        <div>
            <div className="h-[75px] fixed inset-y-0 w-full z-50">    
                        <Navbar />
            </div>
            <BannerCarousel />
            <About />
        <div className="w-4/5 mx-auto space-y-4 py-6">
            <div className="my-8 text-left" data-aos="fade-left" data-aos-anchor-placement="top-center">
                <h1 className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-semibold mb-4">All the skills you need in one place</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-xl">From critical skills to technical topics, LMS supports your professional development.</p>
            </div>
            <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-center text-gray-800 dark:text-gray-300 pt-16 pb-16">Categories</h1>
            <Categories
                items={categories}
            />
            </div>
            <div id="courses" className="relative">
                {/* bounce ball */}
                <Image src="/images/cb.png"
                alt="image"
                width={500}
                height={500}
                className="absolute top-[30%] animate-bounce"
                />
            <h1 className="text-4xl md:text-5xl font-semibold text-center text-gray-800 dark:text-gray-300 pt-12 pb-16" >Popular Courses</h1>
            <CoursesListHome items={courses} />
            </div>
            <Feature />
        </div>
        <div className="mt-10">
          <Footer />
        </div>
        </div>
     );
}