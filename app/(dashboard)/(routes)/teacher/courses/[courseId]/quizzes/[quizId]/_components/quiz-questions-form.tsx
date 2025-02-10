// "use client"
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Pencil, PlusCircle, Trash, Save, X } from "lucide-react";

// interface QuizQuestionsFormProps {
//     initialData: {
//         questions: {
//             id: string;
//             questionText: string;
//             options: { [key: string]: string };
//             correctAnswer: string;
//         }[];
//     };
//     courseId: string;
//     quizId: string;
// }

// const formSchema = z.object({
//     questionText: z.string().min(1, {
//         message: "Question text is required",
//     }),
//     options: z.record(z.string().min(1, {
//         message: "Option text is required",
//     })),
//     correctAnswer: z.string().min(1, {
//         message: "Correct answer is required",
//     }),
// });

// export const QuizQuestionsForm = ({
//     initialData,
//     courseId,
//     quizId,
// }: QuizQuestionsFormProps) => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [questions, setQuestions] = useState(initialData.questions || []);
//     const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

//     const toggleEdit = () => setIsEditing((current) => !current);

//     const router = useRouter();

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             questionText: "",
//             options: { A: "", B: "", C: "", D: "" }, // Initialize options with empty values
//             correctAnswer: "",
//         },
//     });

//     const { isSubmitting, isValid } = form.formState;

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         try {
//             if (editingQuestionId) {
//                 // If editing an existing question
//                 const updatedQuestions = questions.map((q) =>
//                     q.id === editingQuestionId
//                         ? { ...q, questionText: values.questionText, options: values.options, correctAnswer: values.correctAnswer }
//                         : q
//                 );

//                 await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
//                     questions: updatedQuestions,
//                 });

//                 toast.success("Question updated");
//                 setQuestions(updatedQuestions);
//                 setEditingQuestionId(null); // Reset editing state
//             } else {
//                 // If adding a new question
//                 const newQuestion = {
//                     id: Math.random().toString(), // Temporary ID for local state
//                     questionText: values.questionText,
//                     options: values.options,
//                     correctAnswer: values.correctAnswer,
//                 };

//                 const updatedQuestions = [...questions, newQuestion];

//                 await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
//                     questions: updatedQuestions,
//                 });

//                 toast.success("Question added");
//                 setQuestions(updatedQuestions);
//             }

//             // Reset the form fields
//             form.reset({
//                 questionText: "",
//                 options: { A: "", B: "", C: "", D: "" }, // Reset options to empty
//                 correctAnswer: "",
//             });
//             setIsEditing(false); // Close the editing form
//             router.refresh();
//         } catch (error) {
//             console.error("Error in onSubmit:", error);
//             toast.error("Something went wrong");
//         }
//     };

//     const onDeleteQuestion = async (questionId: string) => {
//         try {
//             const updatedQuestions = questions.filter((q) => q.id !== questionId);
//             await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
//                 questions: updatedQuestions,
//             });
//             toast.success("Question deleted");
//             setQuestions(updatedQuestions);
//             router.refresh();
//         } catch (error) {
//             console.error(error);
//             toast.error("Something went wrong");
//         }
//     };

//     const onEditQuestion = (questionId: string) => {
//         const questionToEdit = questions.find((q) => q.id === questionId);
//         if (questionToEdit) {
//             form.reset({
//                 questionText: questionToEdit.questionText,
//                 options: questionToEdit.options,
//                 correctAnswer: questionToEdit.correctAnswer,
//             });
//             setEditingQuestionId(questionId);
//             setIsEditing(true);
//         }
//     };

//     return (
//         <div className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
//             <div className="font-medium flex items-center justify-between">
//                 Quiz Questions
//                 <Button onClick={toggleEdit} variant="ghost">
//                     {isEditing ? (
//                         <>Cancel</>
//                     ) : (
//                         <>
//                             <PlusCircle className="h-4 w-4 mr-2" />
//                             Add a question
//                         </>
//                     )}
//                 </Button>
//             </div>
//             {!isEditing && (
//                 <div className="mt-2">
//                     {questions.length === 0 && (
//                         <p className="text-sm text-slate-500 italic">No questions added yet</p>
//                     )}
//                     {questions.map((question, index) => (
//                         <div key={question.id} className="flex items-center justify-between p-2 border rounded-md mb-2">
//                             <div>
//                                 <p className="font-medium">{index + 1}. {question.questionText}</p>
//                                 <div className="text-sm text-slate-600">
//                                     {Object.entries(question.options).map(([key, value]) => (
//                                         <p key={key}>{key}: {value}</p>
//                                     ))}
//                                 </div>
//                                 <p className="text-sm text-green-600">Correct Answer: {question.correctAnswer}</p>
//                             </div>
//                             <div className="flex items-center gap-x-2">
//                                 <Button
//                                     onClick={() => onEditQuestion(question.id)}
//                                     variant="ghost"
//                                     size="sm"
//                                 >
//                                     <Pencil className="h-4 w-4" />
//                                 </Button>
//                                 <Button
//                                     onClick={() => onDeleteQuestion(question.id)}
//                                     variant="ghost"
//                                     size="sm"
//                                 >
//                                     <Trash className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             {isEditing && (
//                 <Form {...form}>
//                     <form
//                         onSubmit={form.handleSubmit(onSubmit)}
//                         className="space-y-4 mt-4"
//                     >
//                         <FormField
//                             control={form.control}
//                             name="questionText"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isSubmitting}
//                                             placeholder="Enter the question"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <div className="space-y-2">
//                             {["A", "B", "C", "D"].map((optionKey) => (
//                                 <FormField
//                                     key={optionKey}
//                                     control={form.control}
//                                     name={`options.${optionKey}`}
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Input
//                                                     disabled={isSubmitting}
//                                                     placeholder={`Option ${optionKey}`}
//                                                     {...field}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             ))}
//                         </div>
//                         <FormField
//                             control={form.control}
//                             name="correctAnswer"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isSubmitting}
//                                             placeholder="Enter the correct answer (e.g., A, B, C, D)"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <div className="flex items-center gap-x-2">
//                             <Button
//                                 disabled={!isValid || isSubmitting}
//                                 type="submit"
//                             >
//                                 {editingQuestionId ? "Save Changes" : "Add Question"}
//                             </Button>
//                             {editingQuestionId && (
//                                 <Button
//                                     onClick={() => {
//                                         setEditingQuestionId(null);
//                                         form.reset({
//                                             questionText: "",
//                                             options: { A: "", B: "", C: "", D: "" },
//                                             correctAnswer: "",
//                                         });
//                                     }}
//                                     variant="ghost"
//                                 >
//                                     <X className="h-4 w-4 mr-2" />
//                                     Cancel Edit
//                                 </Button>
//                             )}
//                         </div>
//                     </form>
//                 </Form>
//             )}
//         </div>
//     );
// };

"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash, Save, X } from "lucide-react";

interface QuizQuestionsFormProps {
    initialData: {
        questions: {
            id: string;
            questionText: string;
            options: { [key: string]: string };
            correctAnswer: string;
        }[];
    };
    courseId: string;
    quizId: string;
}

const formSchema = z.object({
    questionText: z.string().min(1, {
        message: "Question text is required",
    }),
    options: z.record(z.string().min(1, {
        message: "Option text is required",
    })),
    correctAnswer: z.string().min(1, {
        message: "Correct answer is required",
    }).refine(
        (value) => ["A", "B", "C", "D"].includes(value),
        {
            message: "Correct answer must match one of the options (A, B, C, D)",
        }
    ),
});

export const QuizQuestionsForm = ({
    initialData,
    courseId,
    quizId,
}: QuizQuestionsFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [questions, setQuestions] = useState(initialData.questions || []);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            questionText: "",
            options: { A: "", B: "", C: "", D: "" }, // Initialize options with empty values
            correctAnswer: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (editingQuestionId) {
                // If editing an existing question
                const updatedQuestions = questions.map((q) =>
                    q.id === editingQuestionId
                        ? { ...q, questionText: values.questionText, options: values.options, correctAnswer: values.correctAnswer }
                        : q
                );

                await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
                    questions: updatedQuestions,
                });

                toast.success("Question updated");
                setQuestions(updatedQuestions);
                setEditingQuestionId(null); // Reset editing state
            } else {
                // If adding a new question
                const newQuestion = {
                    id: Math.random().toString(), // Temporary ID for local state
                    questionText: values.questionText,
                    options: values.options,
                    correctAnswer: values.correctAnswer,
                };

                const updatedQuestions = [...questions, newQuestion];

                await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
                    questions: updatedQuestions,
                });

                toast.success("Question added");
                setQuestions(updatedQuestions);
            }

            // Reset the form fields
            form.reset({
                questionText: "",
                options: { A: "", B: "", C: "", D: "" }, // Reset options to empty
                correctAnswer: "",
            });
            setIsEditing(false); // Close the editing form
            router.refresh();
        } catch (error) {
            console.error("Error in onSubmit:", error);
            toast.error("Something went wrong");
        }
    };

    const onDeleteQuestion = async (questionId: string) => {
        try {
            const updatedQuestions = questions.filter((q) => q.id !== questionId);
            await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}`, {
                questions: updatedQuestions,
            });
            toast.success("Question deleted");
            setQuestions(updatedQuestions);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const onEditQuestion = (questionId: string) => {
        const questionToEdit = questions.find((q) => q.id === questionId);
        if (questionToEdit) {
            form.reset({
                questionText: questionToEdit.questionText,
                options: questionToEdit.options,
                correctAnswer: questionToEdit.correctAnswer,
            });
            setEditingQuestionId(questionId);
            setIsEditing(true);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Quiz Questions
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a question
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="mt-2">
                    {questions.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No questions added yet</p>
                    )}
                    {questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-2 border rounded-md mb-2">
                            <div>
                                <p className="font-medium">{index + 1}. {question.questionText}</p>
                                <div className="text-sm text-slate-600">
                                    {Object.entries(question.options).map(([key, value]) => (
                                        <p key={key}>{key}: {value}</p>
                                    ))}
                                </div>
                                <p className="text-sm text-green-600">Correct Answer: {question.correctAnswer}</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <Button
                                    onClick={() => onEditQuestion(question.id)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => onDeleteQuestion(question.id)}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="questionText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Enter the question"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            {["A", "B", "C", "D"].map((optionKey) => (
                                <FormField
                                    key={optionKey}
                                    control={form.control}
                                    name={`options.${optionKey}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder={`Option ${optionKey}`}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormField
                            control={form.control}
                            name="correctAnswer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Enter the correct answer (e.g., A, B, C, D)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                {editingQuestionId ? "Save Changes" : "Add Question"}
                            </Button>
                            {editingQuestionId && (
                                <Button
                                    onClick={() => {
                                        setEditingQuestionId(null);
                                        form.reset({
                                            questionText: "",
                                            options: { A: "", B: "", C: "", D: "" },
                                            correctAnswer: "",
                                        });
                                    }}
                                    variant="ghost"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};