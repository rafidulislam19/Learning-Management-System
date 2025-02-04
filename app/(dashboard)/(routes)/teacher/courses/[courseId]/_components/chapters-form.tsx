"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, Quiz } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[], quizzes: Quiz[]};
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});
export const ChaptersForm = ({
    initialData,
    courseId,
}: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }
    const toggleCreatingQuiz = () => {
        setIsCreatingQuiz((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    }); 

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created successfully!")
            toggleCreating();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
            
        }
    }
    const onSubmitQuiz = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/quizzes`, values);
            toast.success("Quiz created successfully!")
            toggleCreatingQuiz();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
            
        }
    }

    const onReorder = async (updateData: { id: string; position: number}[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast.success("Chapters reordered!");
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEditChapter = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }
    const onEditQuiz = (id: string) => {
        router.push(`/teacher/courses/${courseId}/quizzes/${id}`);
    }


    return (

        <div className="relative mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add a chapter
                        </>
                    )}
                    
                </Button>
                <Button onClick={toggleCreatingQuiz} variant="ghost">
                        {isCreatingQuiz ? <>Cancel</> : (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Quiz
                            </>
                        )}
                </Button>
            </div>

            {isCreating  && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4">
                        <FormField 
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g 'Introduction to the course'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {isCreatingQuiz  && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitQuiz)}
                    className="space-y-4 mt-4">
                        <FormField 
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g 'Quiz 1'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Create
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && !isCreatingQuiz && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    { !initialData.chapters.length && "No Chapters or Quizzes"}
                    <ChaptersList
                        onEditChapter={onEditChapter}
                        onEditQuiz={onEditQuiz}
                        onReorder={onReorder}
                        items={[...(initialData.chapters || []), ...(initialData.quizzes || [])]}
            />
                </div>
            )}
            {!isCreating &&!isCreatingQuiz && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the  and quizzes.
                </p>
            )}
        </div>
     );
}


// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Loader2, PlusCircle } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Chapter, Course, Quiz } from "@prisma/client";

// import {
//     Form,
//     FormControl, 
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";

// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { Input } from "@/components/ui/input";
// import { ChaptersList } from "./chapters-list";

// interface ChaptersFormProps {
//     initialData: Course & { chapters: Chapter[]; quizzes: Quiz[] };
//     courseId: string;
// }

// const formSchema = z.object({
//     title: z.string().min(1),
// });

// export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
//     const [isCreating, setIsCreating] = useState(false);
//     const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
//     const [isUpdating, setIsUpdating] = useState(false);

//     const router = useRouter();

//     const toggleCreating = () => setIsCreating((current) => !current);
//     const toggleCreatingQuiz = () => setIsCreatingQuiz((current) => !current);

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: { title: "" },
//     });

//     const { isSubmitting, isValid } = form.formState;

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         try {
//             await axios.post(`/api/courses/${courseId}/chapters`, values);
//             toast.success("Chapter created successfully!");
//             toggleCreating();
//             router.refresh();
//         } catch {
//             toast.error("Something went wrong!");
//         }
//     };

//     const onQuizSubmit = async (values: z.infer<typeof formSchema>) => {
//         try {
//             await axios.post(`/api/courses/${courseId}/quizzes`, values);
//             toast.success("Quiz created successfully!");
//             toggleCreatingQuiz();
//             router.refresh();
//         } catch {
//             toast.error("Something went wrong!");
//         }
//     };

//     const onReorder = async (updateData: { id: string; position: number }[]) => {
//         try {
//             setIsUpdating(true);
//             await axios.put(`/api/courses/${courseId}/reorder`, { list: updateData });
//             toast.success("Chapters and Quizzes reordered!");
//             router.refresh();
//         } catch {
//             toast.error("Something went wrong!");
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     const onEditChapter = (id: string) => {
//         router.push(`/teacher/courses/${courseId}/chapters/${id}`);
//     };

//     const onEditQuiz = (id: string) => {
//         router.push(`/teacher/courses/${courseId}/quizzes/${id}`);
//     };

//     return (
//         <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
//             {isUpdating && (
//                 <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
//                     <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
//                 </div>
//             )}

//             <div className="font-medium flex items-center justify-between">
//                 Course Chapters and Quizzes
//                 <div className="flex gap-x-2">
//                     <Button onClick={toggleCreating} variant="ghost">
//                         {isCreating ? "Cancel" : (
//                             <>
//                                 <PlusCircle className="h-4 w-4 mr-2" />
//                                 Add a Chapter
//                             </>
//                         )}
//                     </Button>
//                     <Button onClick={toggleCreatingQuiz} variant="ghost">
//                         {isCreatingQuiz ? "Cancel" : (
//                             <>
//                                 <PlusCircle className="h-4 w-4 mr-2" />
//                                 Add a Quiz
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </div>

//             {isCreating && (
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
//                         <FormField
//                             control={form.control}
//                             name="title"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isSubmitting}
//                                             placeholder="e.g. 'Introduction to the course'"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button disabled={!isValid || isSubmitting} type="submit">
//                             Create Chapter
//                         </Button>
//                     </form>
//                 </Form>
//             )}

//             {isCreatingQuiz && (
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onQuizSubmit)} className="space-y-4 mt-4">
//                         <FormField
//                             control={form.control}
//                             name="title"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormControl>
//                                         <Input
//                                             disabled={isSubmitting}
//                                             placeholder="e.g. 'Quiz 1: Basic Concepts'"
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button disabled={!isValid || isSubmitting} type="submit">
//                             Create Quiz
//                         </Button>
//                     </form>
//                 </Form>
//             )}

//             <ChaptersList
//                 onEditChapter={onEditChapter}
//                 onEditQuiz={onEditQuiz}
//                 onReorder={onReorder}
//                 items={[...(initialData.chapters || []), ...(initialData.quizzes || [])]}
//             />

//             <p className="text-xs text-muted-foreground mt-4">
//                 Drag and drop to reorder the chapters and quizzes.
//             </p>
//         </div>
//     );
// };
