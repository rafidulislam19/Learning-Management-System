"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const FailPage = () => {
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
                    className="w-16 h-16 text-red-500 mx-auto mb-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-5.707-9.707a1 1 0 011.414-1.414L12 13.586l3.293-3.293a1 1 0 011.414 1.414L13.414 15l3.293 3.293a1 1 0 01-1.414 1.414L12 16.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 15 7.293 11.707z"
                        clipRule="evenodd"
                    />
                </svg>
                <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed!</h1>
                <p className="text-gray-700 mb-4">Transaction ID: <span className="font-semibold">{transactionId}</span></p>
                <p className="text-sm text-gray-500">Redirecting to your course...</p>
            </div>
        </div>
    );
};

export default FailPage;
