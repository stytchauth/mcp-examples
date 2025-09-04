import { Context, Next } from "hono";
import { verifyStytchSession } from "@stytch/vanilla-js/b2b";

export const stytchSessionAuthMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Missing or invalid authorization header" }, 401);
    }
    
    const token = authHeader.substring(7);
    
    try {
        // Verify the Stytch session token
        const session = await verifyStytchSession(token);
        
        // Store the member ID in context for use in handlers
        c.set("memberID", session.member.member_id);
        c.set("organizationID", session.organization.organization_id);
        
        await next();
    } catch (error) {
        console.error("Session verification failed:", error);
        return c.json({ error: "Invalid or expired session" }, 401);
    }
};
