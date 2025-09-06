# Express.js + Stytch Task App MCP Server

This is an Express.js server that provides both REST API and MCP (Model Context Protocol) functionality for a task list application. It demonstrates how to integrate Stytch authentication with an Express.js backend to create AI-accessible applications.

## Features

- **REST API**: Full CRUD operations for task management
- **MCP Server**: Model Context Protocol server for AI agent integration
- **SQLite Database**: Reliable SQL database storage with user isolation
- **Stytch Authentication**: OAuth token validation and user management
- **Health Check**: Configuration validation endpoint

This demo uses the [Stytch Consumer](https://stytch.com/b2c) product, which is purpose-built for Consumer SaaS authentication requirements.

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Within the sign up flow select **Consumer Authentication** as the authentication type you are interested in. Once your account is set up a Project called "My first project" will be automatically created for you.

2. Navigate to [Connected Apps](https://stytch.com/dashboard/connected-apps?env=test) to enable Dynamic Client Registration

3. Navigate to [Project Settings](https://stytch.com/dashboard/project-settings?env=test) to view your Project ID and API keys. You will need these values later.

### On your machine

Create an `.env.local` file by running the command below which copies the contents of `.env.template`:

```bash
cp .env.template .env.local
```

Open `.env.local` in the text editor of your choice, and set the environment variables using the `Project ID` and `Secret` found on [Project Settings](https://stytch.com/dashboard/project-settings?env=test).

```
# This is what a completed .env.local file will look like
STYTCH_PROJECT_ID=project-test-6c20cd16-73d5-44f7-852c-9a7e7b2ccf62
STYTCH_PROJECT_SECRET=your-stytch-secret-key
STYTCH_DOMAIN=https://cname-word-1234.customers.stytch.dev
```

## Running locally

After completing all the setup steps above the application can be run with the command:

```bash
yarn workspace @mcp-examples/tasklist-express-mcpsdk-backend dev
```

The server will be available at:

- **API**: `http://localhost:3001/api`
- **MCP**: `http://localhost:3001/mcp`
- **Health Check**: `http://localhost:3001/api/healthcheck`

### Testing the MCP Server

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3001/mcp`

## API Endpoints

### REST API

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `POST /api/tasks/:id/complete` - Mark task as complete
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/healthcheck` - Check server configuration

### MCP Tools

- `createTask(taskText: string)` - Add a new task
- `markTaskComplete(taskID: string)` - Mark a task as complete
- `deleteTask(taskID: string)` - Delete a task

### MCP Resources

- `taskapp://tasks/{id}` - Individual task resources

## Storage

This implementation uses SQLite database storage in a `tasks.db` file. The database automatically creates the necessary tables and indexes on startup. Each user's tasks are isolated by `user_id` in the database, providing secure multi-user support with proper data separation.

## Authentication

The server implements OAuth Protected Resource discovery according to the MCP specification:

- `/.well-known/oauth-protected-resource` - Resource metadata
- `/.well-known/oauth-authorization-server` - Authorization server metadata

All API and MCP endpoints require a valid Stytch OAuth token in the Authorization header.

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!
