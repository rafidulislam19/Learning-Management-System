import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { QuizTitleForm } from "./_components/quiz-title-form";
import { Banner } from "@/components/banner";

const QuizIdPage = async ({
    params
}: {
    params: { courseId: string; quizId: string }
}) => {

    const { userId } = await auth();

    if(!userId) {
        return redirect("/home");
    }

    const resolvedParams = await params;

    const quiz = await db.quiz.findUnique({
        where: {
            id: resolvedParams.quizId,
            courseId: resolvedParams.courseId
        },
    });

    if(!quiz) {
        return redirect("/home");
    }

    const requiredFields = [
        quiz.title,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`; 

    // const isComplete = requiredFields.every(Boolean);

    return ( 
        <>
            {!quiz.isPublished && (
                <Banner
                variant="warning"
                label="This quiz is unpublished. It will not be visible in the course."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/teacher/courses/${resolvedParams.courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Quiz Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            {/* <ChapterActions
                                disabled={!isComplete}
                                courseId={resolvedParams.courseId}
                                chapterId={resolvedParams.chapterId}
                                isPublished={chapter.isPublished}
                            /> */}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your Quiz
                                </h2>
                            </div>
                            <QuizTitleForm
                                initialData={quiz}
                                courseId={resolvedParams.courseId}
                                chapterId={resolvedParams.quizId}
                            />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye}/>
                            <h2 className="text-xl">Access Settings</h2>
                        </div>
                        {/* <ChapterAccessForm 
                            initialData={chapter}
                            courseId={resolvedParams.courseId}
                            chapterId={resolvedParams.chapterId}
                        /> */}
                    </div>
                    <div>
                </div>
                </div>
            </div>
        </>
     );
}
 
export default QuizIdPage;