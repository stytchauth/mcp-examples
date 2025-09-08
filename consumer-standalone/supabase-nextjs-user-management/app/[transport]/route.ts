import { type AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { createMcpHandler, withMcpAuth } from '@vercel/mcp-adapter';
import * as stytch from 'stytch';
import { initializeMCPServer } from '@/utils/mcp';

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_SECRET as string,
  custom_base_url: process.env.STYTCH_IDP_DOMAIN,
});

// create an authenticated handler for the MCP server
const createAuthenticatedHandler = () => {
  try {
    return withMcpAuth(
      createMcpHandler(initializeMCPServer),
      async (_, token): Promise<AuthInfo | undefined> => {
        if (!token) return;

        const { audience, scope, expires_at, ...rest } = await client.idp.introspectTokenLocal(token);

        return {
          token,
          clientId: audience as string,
          scopes: scope.split(' '),
          expiresAt: expires_at,
          extra: rest,
        } satisfies AuthInfo;
      },
      { required: true },
    );
  } catch (error) {
    // if there's an error (e.g., missing env vars), return a placeholder handler
    return async () => {
      return new Response('MCP Server not available: ' + (error as Error).message, { status: 503 });
    };
  }
};

const authenticatedHandler = createAuthenticatedHandler();

export { authenticatedHandler as GET, authenticatedHandler as POST, authenticatedHandler as DELETE };
