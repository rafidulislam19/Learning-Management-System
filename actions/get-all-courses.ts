import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { title } from "process";


type GetAllCourses = {
    title?: string;
    categoryId?: string;
};

export const getAllCourses = async ({
    title,
    categoryId
}: GetAllCourses) => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return courses;

    } catch (error) {
        console.log("GET_ALL_COURSES", error);
        return [];
    }
}