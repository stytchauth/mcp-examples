export type Ticket = {
    id: string;
    title: string;
    assignee: string; // member ID from the organization
    status: 'backlog' | 'in-progress' | 'review' | 'done';
    createdAt: string;
    updatedAt: string;
}

// Context from the auth process, extracted from the Stytch auth token JWT
// and provided to the MCP Server as this.props
type AuthenticationContext = {
    claims: {
        "iss": string,
        "scope": string,
        "sub": string,
        "aud": string[],
        "client_id": string,
        "exp": number,
        "iat": number,
        "nbf": number,
        "jti": string,
    },
    accessToken: string
}
