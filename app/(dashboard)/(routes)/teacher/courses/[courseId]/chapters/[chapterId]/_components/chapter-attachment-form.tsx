"use client";

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ChapterAttachmentFormProps {
    initialData: { muxData:MuxData | null } & {  attachments:Attachment[] } & Chapter;
    chapterId: string;
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1),
});

// Explicitly define the type
type FormSchemaType = z.infer<typeof formSchema>;

export const ChapterAttachmentForm = ({
    initialData,
    chapterId,
    courseId
}: ChapterAttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    // const onSubmit = async (values: FormSchemaType) => {
    //     try {
    //         await axios.post(`/api/courses/${courseId}/attachments`, values);
    //         toast.success("Course updated successfully!")
    //         toggleEdit();
    //         router.refresh();
    //     } catch {
    //         toast.error("Something went wrong!");
            
    //     }
    // };

    const onSubmit = async (values: FormSchemaType) => {
        const validationResult = formSchema.safeParse(values);
        if (!validationResult.success) {
            toast.error("Invalid file URL!");
            return;
        }
    
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/attachments`, values);
            toast.success("Chapter updated successfully!");
            toggleEdit();
            router.refresh();
        } catch(error) {
            console.log(error);
            toast.error(`Something went wrong! ${error}`);
        }
    };
    

    const onDelete = async(id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/attachments`);
            toast.success("Attachment deleted!");
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setDeletingId(null);
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id}
                                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="chapterAttachment"
                    onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url });
                        }
                    }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything that your students might need to complete chapter.
                    </div>
                </div>
            )}
        </div>
     );
}
