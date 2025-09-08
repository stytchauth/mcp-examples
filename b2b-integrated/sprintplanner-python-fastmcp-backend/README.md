# Sprint Planner FastAPI Backend + MCP Server

A FastAPI backend for the Sprint Planner application with Stytch B2B authentication, plus a separate MCP (Model Context Protocol) server for AI agent integration.

This represents a backend API and MCP server implemented in [TECH STACK HERE]. To run a working application locally, you will also need to have a compatible [Frontend](LINK HERE) application running.

## Setup

1. **Create and activate a virtual environment:**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Initialize the database:**

```bash
python init_db.py
```

4. **Set environment variables:**

```bash
cp .env.template .env.local
```

You will then need to set the environment variables for your Stytch project based on the values in the Stytch dashboard.

## Running the Servers

```bash
python main.py
```

## API Endpoints

### REST API (Port 8000)

- `GET /api/tickets` - Get all tickets for the organization
- `POST /api/tickets` - Create a new ticket
- `POST /api/tickets/{id}/status` - Update ticket status
- `DELETE /api/tickets/{id}` - Delete a ticket

### MCP Server (Port 8000)

- **Protocol**: Model Context Protocol (MCP)
- **Tools Available**: 9 ticket management tools
- **Frontend**: Connects to API server (port 8000)
- **AI Agents**: Connect to MCP server (port 8000)

#### MCP Tools Available

The MCP server provides the following tools for AI agents:

- **`list_tickets`** - List all tickets for an organization
- **`get_ticket`** - Get a specific ticket by ID
- **`create_ticket`** - Create a new ticket
- **`update_ticket_status`** - Update ticket status
- **`delete_ticket`** - Delete a ticket
- **`search_tickets`** - Search tickets with filters
- **`get_ticket_statistics`** - Get ticket statistics and analytics

## Testing with MCP Inspector

Test your MCP server using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

```bash
yarn dlx @modelcontextprotocol/inspector@latest
```

Navigate to the URL where the Inspector is running, and input the following values:

- Transport Type: `Streamable HTTP`
- URL: `http://localhost:3001/mcp`

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our [Slack community](https://stytch.com/docs/resources/support/overview)!
