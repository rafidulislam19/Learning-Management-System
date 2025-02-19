"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react"
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

// Explicitly define the type
type FormSchemaType = z.infer<typeof formSchema>;
export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    // const onSubmit = async (values: FormSchemaType) => {
    //     try {
    //         await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
    //         toast.success("Chapter updated successfully!")
    //         toggleEdit();
    //         router.refresh();
    //     } catch {
    //         toast.error("Something went wrong!");
            
    //     }
    // }

    const onSubmit = async (values: FormSchemaType) => {
        const validationResult = formSchema.safeParse(values);
        if (!validationResult.success) {
            toast.error("Invalid video URL!");
            return;
        }
    
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated successfully!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    };
    

    return ( 
        <div className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit video
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer 
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                        {/* Video Uploaded! */}
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="chapterVideo"
                    onChange={(url) => {
                        if (url) {
                            onSubmit({ videoUrl: url });
                        }
                    }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload the video for this chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
     );
}
