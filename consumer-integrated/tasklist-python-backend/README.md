# Tasklist Python Backend

An example of a [consumer](https://stytch.com/docs/guides) application implementing an MCP server using Stytch. This example uses [TECH STACK HERE] to run a backend for a simple task list for users, and surfaces it to both a [Frontend](https://github.com/stytchauth/mcp-examples/tree/main/consumer-integrated/tasklist-frontend) and an MCP server.

To run this server, you will need to run both this repository and the corresponding [frontend](https://github.com/stytchauth/mcp-examples/tree/main/consumer-integrated/tasklist-frontend).

## Setup
1. Setup a python virtual environment and install packages.

```python
cd consumer-integrated/tasklist-python-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

2. Setup your environment variables. We provided a .env.template file. Copy it to local:
```
cp .env.template .env.local
```

Then update the .env.local with your Stytch project values, taken from the dashboard.

## Running

```bash
uvicorn app.main:app --reload --port ${PORT:-3001}
```

Both the API and MCP server will be available at: `localhost:3000`

## Testing with MCP Inspector
Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:
- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3000/mcp`

## API Endpoints

### REST API (Port 8000)
- `GET /todos` - Get all tasks for a user
- `POST /todos` - Create a new task
- `POST /todos/{todo_id}/complete` - Mark a todo item as completed
- `DELETE /todos/{todo_id}` - Delete a todo item

### MCP Server (Port 8000)
- **Protocol**: Model Context Protocol (MCP)
- **Tools Available**: 3 Task list management tools

#### MCP Tools Available

The MCP server provides the following tools for AI agents:

- **`create_task`** - Create a task for the currently authorized user
- **`mark_task_completed`** - Mark a specified task completed
- **`delete_task`** - Delete a task


## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!
