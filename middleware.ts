import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default clerkMiddleware((auth, req: NextRequest) => {
    const publicPaths = [
        "/api/webhook", // IPN webhook
        // Exclude dynamic success, fail, and cancel pages from Clerk authentication
        /^\/courses\/[^/]+\/checkout\/(?:success|fail|cancel)$/,
    ];

    const url = req.nextUrl.pathname;
    const method = req.method;

    const isPublicPath = publicPaths.some((path) =>
        typeof path === "string" ? url.startsWith(path) : path.test(url)
    );

    if (isPublicPath) {
        console.log(`Bypassing Clerk authentication for: ${url} [${method}]`);
        return NextResponse.next(); // Allow access without authentication
    }

    // Authenticate for all other routes
     auth();
});

// Matcher config to exclude public paths from Clerk authentication
export const config = {
    matcher: [
        "/((?!_next/static|favicon.ico|api/payment-redirect).*)",
    ],
};
