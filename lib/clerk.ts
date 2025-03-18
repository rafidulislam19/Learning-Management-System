import axios from "axios";

// Generate a Clerk session token using the Clerk API
export async function generateClerkSessionToken(userId: string) {
    try {
        // Step 1: Create a Clerk session
        const sessionResponse = await axios.post(
            "https://api.clerk.dev/v1/sessions",
            {
                user_id: userId,
                expires_in_seconds: 600, // Session valid for 10 minutes
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const sessionId = sessionResponse.data.id;
        console.log("Created Clerk session:", sessionResponse.data);

        // Step 2: Generate a session token for the created session
        const tokenResponse = await axios.post(
            `https://api.clerk.dev/v1/sessions/${sessionId}/tokens`,
            {
                token_type: "session",
                expires_in_seconds: 600, // Token valid for 10 minutes
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const sessionToken = tokenResponse.data.jwt;
        console.log("Generated Clerk session token data:", tokenResponse.data);
        console.log("Generated Clerk session token:", sessionToken);
        return sessionToken;
    } catch (error) {
        console.error("Error generating Clerk session token:", error.response?.data || error.message);
        return null;
    }
}

// Verify a Clerk session token using the Clerk API
export async function verifyClerkSessionToken(sessionToken: string) {
    try {
        const response = await axios.get(
            `https://api.clerk.dev/v1/sessions/${sessionToken}`,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.CLERK_API_KEY}`,
                },
            }
        );

        const session = response.data;
        console.log("Verified Clerk session:", session);
        return session;
    } catch (error) {
        console.error("Invalid Clerk session token:", error.response?.data || error.message);
        return null;
    }
}
