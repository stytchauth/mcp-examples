# Stytch Sprint Planner MCP Server Frontend

This is a Vite React frontend application that can be used with any of the compatible MCP Server backends:

```
mcp-examples
`- b2b-integrated
   `- sprintplanner-python-fastmcp-backend
```

This demo uses the [Stytch B2B](https://stytch.com/b2b) product, which is purpose-built for Consumer SaaS authentication requirements.

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### Pick a backend

Navigate to one of the backend folders and follow the instructions to configure the backend with your Stytch credentials. Follow the directions in their README to setup and run them.

### In the Stytch Dashboard

1. Navigate to [Frontend SDKs](https://stytch.com/dashboard/sdk-configuration?env=test) to enable the Frontend SDK in Test

2. Navigate to [Project Settings](https://stytch.com/dashboard/project-settings?env=test) to view your Project ID and API keys. You will need these values later.

### On your machine

Create an `.env.local` file by running the command below which copies the contents of `.env.template`.

```bash
cp .env.template .env.local
```

Open `.env.local` in the text editor of your choice, and set the environment variables using the `public_token` found on [Project Settings](https://stytch.com/dashboard/project-settings?env=test).

```
# This is what a completed .env.local file will look like
VITE_STYTCH_PUBLIC_TOKEN=public-token-test-abc123-abcde-1234-0987-0000-abcd1234
```

## Running locally

After completing all the setup steps above the application can be run with the command:

```bash
npm run dev
```

The application will be available at [`http://localhost:5173/`](http://localhost:5173/). The MCP server and API Backends will be available according to the described backend README.

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3000/mcp`

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!
