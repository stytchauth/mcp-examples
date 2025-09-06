# Workers + Stytch Task App MCP Server

This is a Workers server that composes two functions:

- A REST API built using Hono on top of [Workers KV](https://developers.cloudflare.com/kv/)
- A [Model Context Protocol](https://modelcontextprotocol.io/introduction) Server built using on top of [Workers Durable Objects](https://developers.cloudflare.com/durable-objects/)

User and client identity is managed using [Stytch](https://stytch.com/). Put together, these features show how to extend a traditional full-stack application for use by an AI agent.

This demo uses the [Stytch Consumer](https://stytch.com/b2c) product, which is purpose-built for Consumer SaaS authentication requirements.

[//]: # "If you are more interested in Stytch's [B2B](https://stytch.com/b2b) product, see [this demo](https://github.com/stytchauth/mcp-stytch-b2b-okr-manager/) instead."

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Within the sign up flow select **Consumer Authentication** as the authentication type you are interested in. Once your account is set up a Project called "My first project" will be automatically created for you.

2. Navigate to [Connected Apps](https://stytch.com/dashboard/connected-apps?env=test) to enable Dynamic Client Registration

3. Navigate to [Project Settings](https://stytch.com/dashboard/project-settings?env=test) to view your Project ID and API keys. You will need these values later.

### On your machine

Create a `.dev.vars` file by running the command below which copies the contents of `.dev.vars.template`

```bash
cp .dev.vars.template .dev.vars
```

Open `.dev.vars` in the text editor of your choice, and set the environment variables using the `Project ID`, `Secret`, and `Project Domain` found on [Project Settings](https://stytch.com/dashboard/project-settings?env=test).

```
// This is what a completed .dev.vars file will look like
STYTCH_PROJECT_ID=project-test-6c20cd16-73d5-44f7-852c-9a7e7b2ccf62
STYTCH_PROJECT_SECRET=your-stytch-secret-key
STYTCH_DOMAIN=https://cname-word-1234.customers.stytch.dev
```

## Running locally

After completing all the setup steps above the application can be run with the command:

```bash
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend dev
```

The application will be available at [`http://localhost:3000`](http://localhost:3000) and the MCP server will be available at `http://localhost:3000/mcp`.

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

```bash
npx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3000/mcp`

## Deploy to Cloudflare Workers

Click the button - **you'll need to configure environment variables after the initial deployment**.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/stytchauth/mcp-stytch-consumer-todo-list.git)

Or, if you want to follow the steps by hand:

1. Create a KV namespace for the Task app to use

```
wrangler kv namespace create TASKS
```

2. Update the KV namespace ID in `wrangler.jsonc` with the ID you received:

```
"kv_namespaces": [
   {
      "binding": "TASKS",
      "id": "your-kv-namespace-id"
   }
]
```

3. Upload your Stytch Env Vars for use by the worker

```bash
yarn dlx wrangler secret bulk .dev.vars
```

4. Deploy the worker

```
yarn workspace @mcp-examples/tasklist-cfworkers-mcpsdk-backend deploy
```

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!
