"use client";

import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";


interface ImageFormProps {
    initialData: Course,
    courseId: string;
}


const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required!",
    }),
});

// Explicitly define the type
type FormSchemaType = z.infer<typeof formSchema>;
export const ImageForm = ({
    initialData,
    courseId,
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }

    // const onSubmit = async (values: FormSchemaType) => {
    //     try {
    //         await axios.patch(`/api/courses/${courseId}`, values);
    //         toast.success("Course updated successfully!")
    //         toggleEdit();
    //         router.refresh();
    //     } catch {
    //         toast.error("Something went wrong!");
            
    //     }
    // }

    const onSubmit = async (values: FormSchemaType) => {
        const validationResult = formSchema.safeParse(values);
        if (!validationResult.success) {
            toast.error("Invalid image URL!");
            return;
        }
    
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated successfully!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong!");
        }
    };
    

    return ( 
        <div className="mt-6 border bg-slate-100 dark:bg-slate-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an Image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Image
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                        alt="Upload"
                        fill
                        className="object-cover rounded-md"
                        src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                    endpoint="courseImage"
                    onChange={(url) => {
                        if (url) {
                            onSubmit({ imageUrl: url });
                        }
                    }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
     );
}
