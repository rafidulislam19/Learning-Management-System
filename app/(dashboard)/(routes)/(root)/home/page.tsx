import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Categories } from "../../search/_components/categories";
import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";
import Footer from "@/components/footer";
import BannerCarouselWithLogin from "@/components/banner-carousel-with-login";
import About from "@/components/about";
import Image from "next/image";
import Feature from "@/components/feature";

interface SearchPageProps {
  searchParams: Promise<{
      title: string;
      categoryId: string;
  }>
};

export default async function Dashboard({
  searchParams
}: SearchPageProps) {
  
  const { userId } = await auth();

  if(!userId) {
    return redirect("/home");
  }

  const categories = await db.category.findMany({
          orderBy: {
              name: "asc",
          },
      });
  
    const resolvedSearchParams = await searchParams;

    const courses = await getCourses({
        userId,
        ...resolvedSearchParams,
    }); 


  return (
    <div>
      <BannerCarouselWithLogin />
        {/* <div className="p-6 space-y-4">
            <div className="my-8 text-left">
                <h1 className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-serif font-semibold my-4">All the skills you need in one place</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-xl">From critical skills to technical topics, LMS supports your professional development.</p>
            </div>
            <Categories
                items={categories}
            />
            <CoursesList items={courses} />
        </div> */}
        <About />
        <div className="w-4/5 mx-auto space-y-4 py-6">
            <div className="my-8 text-left" data-aos="fade-left" data-aos-anchor-placement="top-center">
                <h1 className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-semibold my-4">All the skills you need in one place</h1>
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
                  <CoursesList items={courses} />
                  </div>
                  <Feature />
          </div>
        <div className="mt-10">
          <Footer />
        </div>
    </div>
  );
}
