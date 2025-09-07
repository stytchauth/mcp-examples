import { useStytchMemberSession } from "@stytch/react/b2b";

/**
 * Hook to get authentication headers for API calls
 */
export const useAuthHeaders = (): Record<string, string> => {
    const { session } = useStytchMemberSession();
    
    if (!session) {
        return {};
    }
    
    // Store JWT in a cookie for backend auth; do not send Authorization header
    // Note: cookie is accessible to JS here (not httpOnly) since it's set client-side
    document.cookie = `stytch_session_jwt=${session.session_token}; Path=/; SameSite=Lax`;
    
    return {
        'Content-Type': 'application/json'
    };
};
