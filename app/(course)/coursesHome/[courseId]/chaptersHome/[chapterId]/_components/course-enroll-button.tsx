"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
    price,
    courseId,
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            // const response  = await axios.post(`/api/courses/${courseId}/checkout`);
            router.push('/sign-in');

            // window.location.assign(response.data.url);

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto font-semibold text-rose-500">
            Please Sign in to Enroll
        </Button>
     );
}