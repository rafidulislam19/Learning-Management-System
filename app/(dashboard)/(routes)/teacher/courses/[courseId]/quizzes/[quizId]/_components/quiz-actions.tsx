"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface QuizActionsProps {
    disabled: boolean;
    courseId: string;
    quizId: string;
    isPublished: boolean;
};
export const QuizActions = ({
    disabled,
    courseId,
    quizId,
    isPublished
}: QuizActionsProps ) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}/unpublish`);
                toast.success("Quiz Unpublished!");
            } else {
                await axios.patch(`/api/courses/${courseId}/quizzes/${quizId}/publish`);
                toast.success("Quiz Published!");
            }

            router.refresh();

        } catch (error) {
            toast.error("Something went wrong!");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}/quizzes/${quizId}`);

            toast.success("Quiz deleted!");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);

        } catch {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    return ( 
        <div className="flex items-center gap-x-2">
            <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
     );
}