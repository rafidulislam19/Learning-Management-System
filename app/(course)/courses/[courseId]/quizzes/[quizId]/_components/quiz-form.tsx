"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react"; 

interface QuizFormProps {
    quiz: {
        id: string;
        title: string;
        questions: {
            id: string;
            questionText: string;
            options: { [key: string]: string };
            correctAnswer: string;
        }[];
    };
    quizProgress?: {
        id: string;
        score: number;
        answers: { [key: string]: string };
        isCompleted: boolean;
    };
    courseId: string;
    userId: string;
}

export const QuizForm = ({ quiz, quizProgress, courseId, userId }: QuizFormProps) => {
    const [answers, setAnswers] = useState<{ [key: string]: string }>(quizProgress?.answers || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(quizProgress?.score || null);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Calculate the score
            const calculatedScore = quiz.questions.reduce((acc, question) => {
                if (answers[question.id] === question.correctAnswer) {
                    return acc + 1;
                }
                return acc;
            }, 0);

            // Save the quiz progress
            await axios.post(`/api/courses/${courseId}/quizzes/${quiz.id}/progress`, {
                userId,
                score: calculatedScore,
                answers,
                isCompleted: true,
            });

            setScore(calculatedScore); // Display the score
            toast.success("Quiz submitted successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {quiz.questions.map((question) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                    <div key={question.id} className="border p-4 rounded-md">
                        <h2 className="font-semibold">{question.questionText}</h2>
                        <div className="space-y-2 mt-2">
                            {Object.entries(question.options).map(([key, value]) => {
                                const isUserAnswer = userAnswer === key;
                                const isCorrectAnswer = question.correctAnswer === key;

                                return (
                                    <div key={key} className="flex items-center space-x-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={key}
                                                checked={isUserAnswer}
                                                onChange={() =>
                                                    setAnswers((prev) => ({ ...prev, [question.id]: key }))
                                                }
                                                disabled={!!score} // Disable inputs after submission
                                            />
                                            <span>{value}</span>
                                        </label>
                                        {score !== null && (
                                            <>
                                                {isUserAnswer && isCorrectAnswer && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {isUserAnswer && !isCorrectAnswer && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                {!isUserAnswer && isCorrectAnswer && (
                                                    <span className="text-sm text-green-500">(Correct Answer)</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {score !== null && !isCorrect && (
                            <p className="text-sm text-red-500 mt-2">
                                Correct Answer: {question.options[question.correctAnswer]}
                            </p>
                        )}
                    </div>
                );
            })}
            {score !== null ? (
                <div className="mt-4">
                    <p className="font-semibold text-xl text-yellow-200">Your score: {score} / {quiz.questions.length}</p>
                </div>
            ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    Submit Quiz
                </Button>
            )}
        </div>
    );
};