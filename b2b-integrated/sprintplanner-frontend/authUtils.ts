import { useStytchMemberSession } from "@stytch/react/b2b";

/**
 * Hook to get authentication headers for API calls
 */
export const useAuthHeaders = (): Record<string, string> => {
    const { session } = useStytchMemberSession();
    
    if (!session) {
        return {};
    }
    
    return {
        'Authorization': `Bearer ${session.session_token}`,
        'Content-Type': 'application/json'
    };
};

/**
 * Get auth headers from a session object
 */
export const getAuthHeaders = (session: any): Record<string, string> => {
    if (!session) {
        return {};
    }
    
    return {
        'Authorization': `Bearer ${session.session_token}`,
        'Content-Type': 'application/json'
    };
};
