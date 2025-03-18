"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId") || "Unknown";
    const courseId = searchParams.get("courseId") || "";
    const router = useRouter();

    useEffect(() => {
        if (courseId) {
            // Redirect to the course page after 2 seconds
            setTimeout(() => {
                router.push(`/courses/${courseId}`);
            }, 2000);
        }
    }, [courseId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="rounded-lg shadow-md p-8 max-w-md text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-16 h-16 text-green-500 mx-auto mb-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.293-6.707a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L12 13.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3z"
                        clipRule="evenodd"
                    />
                </svg>
                <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
                <p className="text-gray-700 mb-4">Transaction ID: <span className="font-semibold">{transactionId}</span></p>
                <p className="text-sm text-gray-500">Redirecting to your course...</p>
            </div>
        </div>
    );
};

export default SuccessPage;
