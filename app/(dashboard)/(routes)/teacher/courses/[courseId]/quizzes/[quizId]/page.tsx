// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
// import Link from "next/link";
// import { ArrowLeft, LayoutDashboard } from "lucide-react";
// import { IconBadge } from "@/components/icon-badge";
// import { QuizTitleForm } from "./_components/quiz-title-form";
// import { QuizQuestionsForm } from "./_components/quiz-questions-form";
// import { Banner } from "@/components/banner";
// import { QuizActions } from "./_components/quiz-actions";
// // import { QuizQuestionsForm } from "./_components/quiz-questions-form";

// interface Question {
//     id: string;
//     questionText: string;
//     options: string | { [key: string]: string }; 
//     correctAnswer: string;
// }


// const QuizIdPage = async ({
//     params
// }: {
//     params: Promise<{ courseId: string; quizId: string }>
// }) => {
//     const { userId } = await auth();

//     if (!userId) {
//         return redirect("/home");
//     }

//     const resolvedParams = await params;

//     const quiz = await db.quiz.findUnique({
//         where: {
//             id: resolvedParams.quizId,
//             courseId: resolvedParams.courseId,
//         },
//         include: {
//             questions: true,
//         },
//     });

//     if (!quiz) {
//         return redirect("/home");
//     }

//     // ✅ Function to validate individual question completeness
//     const isQuestionComplete = (question: Question) => {
//         const options = typeof question.options === "string"
//             ? JSON.parse(question.options)
//             : question.options;
    
//         const hasQuestionText = question.questionText?.trim().length > 0;
//         const hasOptions = options && Object.keys(options).length >= 2;
//         const hasValidCorrectAnswer = hasOptions && question.correctAnswer && Object.keys(options).includes(question.correctAnswer);
    
//         return hasQuestionText && hasOptions && hasValidCorrectAnswer;
//     };
    
    

//     // ✅ Check if all questions are complete
//     const allQuestionsComplete = quiz.questions.length > 0 && quiz.questions.every(isQuestionComplete);

//     // ✅ Required fields for completion
//     const requiredFields = [
//         quiz.title?.trim(),
//         allQuestionsComplete
//     ];

//     const totalFields = requiredFields.length;
//     const completedFields = requiredFields.filter(Boolean).length;

//     const completionText = `(${completedFields}/${totalFields})`;
//     const isComplete = requiredFields.every(Boolean);

//     return (
//         <>
//             {!quiz.isPublished && (
//                 <Banner
//                     variant="warning"
//                     label="This quiz is unpublished. It will not be visible in the course."
//                 />
//             )}
//             <div className="p-6">
//                 <div className="flex items-center justify-between">
//                     <div className="w-full">
//                         <Link href={`/teacher/courses/${resolvedParams.courseId}`}
//                             className="flex items-center text-sm hover:opacity-75 transition mb-6">
//                             <ArrowLeft className="h-4 w-4 mr-2" />
//                             Back to course setup
//                         </Link>
//                         <div className="flex items-center justify-between w-full">
//                             <div className="flex flex-col gap-y-2">
//                                 <h1 className="text-2xl font-medium">
//                                     Quiz Creation
//                                 </h1>
//                                 <span className="text-sm text-slate-700 dark:text-slate-500">
//                                     Complete all fields {completionText}
//                                 </span>
//                             </div>
//                             <QuizActions
//                                 disabled={!isComplete}
//                                 courseId={resolvedParams.courseId}
//                                 quizId={resolvedParams.quizId}
//                                 isPublished={quiz.isPublished}
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
//                     <div className="space-y-4">
//                         <div>
//                             <div className="flex items-center gap-x-2">
//                                 <IconBadge icon={LayoutDashboard} />
//                                 <h2 className="text-xl">
//                                     Customize your quiz
//                                 </h2>
//                             </div>
//                             <QuizTitleForm
//                                 initialData={quiz}
//                                 courseId={resolvedParams.courseId}
//                                 quizId={resolvedParams.quizId}
//                             />
//                             <QuizQuestionsForm
//                                 initialData={quiz}
//                                 courseId={resolvedParams.courseId}
//                                 quizId={resolvedParams.quizId}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default QuizIdPage;

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

// interface Question {
//     id: string;
//     questionText: string;
//     options: string | { [key: string]: string } | null; // Allow null
//     correctAnswer: string;
// }

interface Question {
    id: string;
    questionText: string;
    options: { [key: string]: string }; // Ensure this is always an object
    correctAnswer: string;
}


const QuizIdPage = async ({
    params
}: {
    params: Promise<{ courseId: string; quizId: string }>;
}) => {
    const { userId } = await auth();
    if (!userId) return redirect("/home");

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

    if (!quiz) return redirect("/home");

    // ✅ Function to validate question completeness
    const isQuestionComplete = (question: Question) => {
        let options: { [key: string]: string } | null = null;

        if (typeof question.options === "string") {
            try {
                options = JSON.parse(question.options);
            } catch (error) {
                console.error("Error parsing options:", error);
            }
        } else if (typeof question.options === "object" && question.options !== null) {
            options = question.options;
        }

        const hasQuestionText = question.questionText?.trim().length > 0;
        const hasOptions = options && Object.keys(options).length >= 2;
        const hasValidCorrectAnswer =
        hasOptions &&
        question.correctAnswer &&
        options !== null && // ✅ Ensure options is not null
        Object.keys(options).includes(question.correctAnswer);


        return hasQuestionText && hasOptions && hasValidCorrectAnswer;
    };

    // ✅ Ensure type safety when mapping questions
    // const allQuestionsComplete =
    //     quiz.questions.length > 0 &&
    //     quiz.questions.every((q) =>
    //         isQuestionComplete({
    //             id: q.id,
    //             questionText: q.questionText,
    //             options: q.options as string | { [key: string]: string } | null, // Type assertion
    //             correctAnswer: q.correctAnswer,
    //         })
    //     );
    const allQuestionsComplete =
    quiz.questions.length > 0 &&
    quiz.questions.every((q) =>
        isQuestionComplete({
            id: q.id,
            questionText: q.questionText,
            options: (typeof q.options === "string" 
                      ? JSON.parse(q.options) 
                      : q.options) || {}, // Ensure options is an object
            correctAnswer: q.correctAnswer,
        })
    );


    const requiredFields = [quiz.title?.trim(), allQuestionsComplete];
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
                        <Link
                            href={`/teacher/courses/${resolvedParams.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Quiz Creation</h1>
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
                                <h2 className="text-xl">Customize your quiz</h2>
                            </div>
                            <QuizTitleForm
                                initialData={quiz}
                                courseId={resolvedParams.courseId}
                                quizId={resolvedParams.quizId}
                            />
                            <QuizQuestionsForm
                                initialData={{
                                    ...quiz,
                                    questions: quiz.questions.map((q) => ({
                                        id: q.id,
                                        questionText: q.questionText,
                                        options: (typeof q.options === "string" 
                                                ? JSON.parse(q.options) 
                                                : q.options) || {},
                                        correctAnswer: q.correctAnswer,
                                    }))
                                }}
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
