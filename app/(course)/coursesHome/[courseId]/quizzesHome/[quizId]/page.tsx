import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import { Lock } from "lucide-react";

interface QuizHomePageProps {
    params: Promise<{ courseId: string; quizId: string }>;
}

const QuizHomePage = async ({ params }: QuizHomePageProps) => {

    const resolvedParams = await params;

    // Fetch the course and quiz
    const course = await db.course.findUnique({
        where: {
            id: resolvedParams.courseId,
        },
    });

    const quiz = await db.quiz.findUnique({
        where: {
            id: resolvedParams.quizId,
            courseId: resolvedParams.courseId,
        },
        include: {
            questions: true,
        },
    });

    if (!course || !quiz) {
        return redirect("/home");
    }

    const { userId } = await auth();

    return (
        <div className="p-6">
            {!userId && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to access the quiz."
                />
            )}
            <h1 className="text-2xl font-bold my-4">{quiz.title}</h1>
            
            <div className="flex flex-col items-center justify-center gap-3 py-20">
                <Lock className="h-6 w-6 text-slate-500"/>
                <p className="text-slate-500">This quiz is locked</p>
            </div>
            
        </div>
    );
};

export default QuizHomePage;