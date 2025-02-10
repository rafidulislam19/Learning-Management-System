import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { QuizTitleForm } from "./_components/quiz-title-form";
import { QuizQuestionsForm } from "./_components/quiz-questions-form";
import { Banner } from "@/components/banner";
import { QuizActions } from "./_components/quiz-actions";
// import { QuizQuestionsForm } from "./_components/quiz-questions-form";

const QuizIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string; quizId: string }>
}) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/home");
    }

    const resolvedParams = await params;

    const quiz = await db.quiz.findUnique({
        where: {
            id: resolvedParams.quizId,
            courseId: resolvedParams.courseId,
        },
        include: {
            questions: true,
        },
    });

    if (!quiz) {
        return redirect("/home");
    }

    // ✅ Function to validate individual question completeness
    const isQuestionComplete = (question: any) => {
        const hasQuestionText = question.questionText?.trim().length > 0;
        const hasOptions = question.options && Object.keys(question.options).length >= 2;
        const hasValidCorrectAnswer = hasOptions && question.correctAnswer && Object.keys(question.options).includes(question.correctAnswer);

        return hasQuestionText && hasOptions && hasValidCorrectAnswer;
    };

    // ✅ Check if all questions are complete
    const allQuestionsComplete = quiz.questions.length > 0 && quiz.questions.every(isQuestionComplete);

    // ✅ Required fields for completion
    const requiredFields = [
        quiz.title?.trim(),
        allQuestionsComplete
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

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
                                <span className="text-sm text-slate-700 dark:text-slate-500">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <QuizActions
                                disabled={!isComplete}
                                courseId={resolvedParams.courseId}
                                quizId={resolvedParams.quizId}
                                isPublished={quiz.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your quiz
                                </h2>
                            </div>
                            <QuizTitleForm
                                initialData={quiz}
                                courseId={resolvedParams.courseId}
                                quizId={resolvedParams.quizId}
                            />
                            <QuizQuestionsForm
                                initialData={quiz}
                                courseId={resolvedParams.courseId}
                                quizId={resolvedParams.quizId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizIdPage;
