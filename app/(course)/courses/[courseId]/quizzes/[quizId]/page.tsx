// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { QuizForm } from "./_components/quiz-form";
// import { Banner } from "@/components/banner";
// import { Lock } from "lucide-react";

// interface QuizPageProps {
//     params: { courseId: string; quizId: string };
// }

// const QuizPage = async ({ params }: QuizPageProps) => {
//     const { userId } = await auth();

//     if (!userId) {
//         return redirect("/home");
//     }

//     // Fetch the course and quiz
//     const course = await db.course.findUnique({
//         where: {
//             id: params.courseId,
//         },
//         include: {
//             purchases: {
//                 where: {
//                     userId,
//                 },
//             },
//         },
//     });

//     const quiz = await db.quiz.findUnique({
//         where: {
//             id: params.quizId,
//             courseId: params.courseId,
//         },
//         include: {
//             questions: true,
//         },
//     });

//     if (!course || !quiz) {
//         return redirect("/home");
//     }

//     // Check if the user has purchased the course
//     const hasPurchased = course.purchases.length > 0;

//     // Fetch quiz progress (if any)
//     const quizProgress = await db.quizProgress.findFirst({
//         where: {
//             userId,
//             quizId: params.quizId,
//         },
//     });

//     return (
//         <div className="p-6">
//             {!hasPurchased && (
//                 <Banner
//                     variant="warning"
//                     label="You need to purchase this course to access the quiz."
//                 />
//             )}
//             <h1 className="text-2xl font-bold my-4">{quiz.title}</h1>
//             {hasPurchased ? (
//                 <QuizForm
//                     quiz={quiz}
//                     quizProgress={quizProgress}
//                     courseId={params.courseId}
//                     userId={userId}
//                 />
//             ) : (
//                 <div className="flex flex-col items-center justify-center gap-3 py-20">
//                     <Lock className="h-6 w-6 text-slate-500"/>
//                     <p className="text-slate-500">This quiz is locked</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuizPage;

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QuizForm } from "./_components/quiz-form";
import { Banner } from "@/components/banner";
import { Lock } from "lucide-react";

interface QuizPageProps {
    params: Promise<{ courseId: string; quizId: string }>;
}

// Type for quiz question
interface QuizQuestion {
    id: string;
    questionText: string;
    options: { [key: string]: string };
    correctAnswer: string;
}

// Type for quiz progress
interface QuizProgress {
    id: string;
    score: number;
    answers: { [key: string]: string };
    isCompleted: boolean;
}



const QuizPage = async ({ params }: QuizPageProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/home");
    }

    const resolvedParams = await params;

    const course = await db.course.findUnique({
        where: { id: resolvedParams.courseId },
        include: {
            purchases: { where: { userId } },
        },
    });

    const quiz = await db.quiz.findUnique({
        where: {
            id: resolvedParams.quizId,
            courseId: resolvedParams.courseId,
        },
        include: { questions: true },
    });

    if (!course || !quiz) {
        return redirect("/home");
    }

    const hasPurchased = course.purchases.length > 0;

    const quizProgressData = await db.quizProgress.findFirst({
        where: {
            userId,
            quizId: resolvedParams.quizId,
        },
    });

    const quizProgress: QuizProgress | undefined = quizProgressData
        ? {
              id: quizProgressData.id,
              score: quizProgressData.score,
              answers: parseJson(quizProgressData.answers),
              isCompleted: quizProgressData.isCompleted,
          }
        : undefined;

    const formattedQuiz = {
        ...quiz,
        questions: quiz.questions.map((question) => ({
            id: question.id,
            questionText: question.questionText,
            options: parseJson(question.options),
            correctAnswer: question.correctAnswer,
        })) as QuizQuestion[],
    };

    return (
        <div className="p-6">
            {!hasPurchased && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to access the quiz."
                />
            )}

            <h1 className="text-2xl font-bold my-4">{quiz.title}</h1>

            {hasPurchased ? (
                <QuizForm
                    quiz={formattedQuiz}
                    quizProgress={quizProgress}
                    courseId={resolvedParams.courseId}
                    userId={userId}
                />
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                    <Lock className="h-6 w-6 text-slate-500" />
                    <p className="text-slate-500">This quiz is locked</p>
                </div>
            )}
        </div>
    );
};

function parseJson(data: unknown): { [key: string]: string } {
    try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
            return parsed as { [key: string]: string };
        }

        return {};
    } catch {
        return {};
    }
}


export default QuizPage;
