# Ticket Board FastAPI Backend + MCP Server

A FastAPI backend for the Ticket Board application with Stytch B2B authentication, plus a separate MCP (Model Context Protocol) server for AI agent integration.

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
export STYTCH_PROJECT_ID="your_project_id"
export STYTCH_SECRET="your_secret"
export STYTCH_DOMAIN="your project domain"
```

Alternatively, this can be set in a .env.local file, copied from env.template

## Running the Servers

```bash
python run.py
```
- **Port**: 8000
- **Purpose**: Backend API endpoints for frontend, as well as MCP server
- **URL**: `http://localhost:8000`

## API Endpoints

### REST API (Port 8000)
- `GET /api/tickets` - Get all tickets for the organization
- `POST /api/tickets` - Create a new ticket
- `POST /api/tickets/{id}/status` - Update ticket status
- `DELETE /api/tickets/{id}` - Delete a ticket

### MCP Server (Port 8001)
- **Protocol**: Model Context Protocol (MCP)
- **Tools Available**: 9 ticket management tools
- **Frontend**: Connects to API server (port 8000)
- **AI Agents**: Connect to MCP server (port 8001)

## Development

- **Virtual Environment**: Always activate your virtual environment before running the servers
- **Database**: SQLite database with SQLAlchemy ORM for persistent storage
- **Auto-reload**: Both servers automatically reload when you make code changes
- **CORS**: Configured for frontend integration at `http://localhost:5173`
- **Authentication**: Stytch B2B session verification (currently mocked for development)
- **Separation**: Clean separation between API and MCP functionality

## MCP Tools Available

The MCP server provides the following tools for AI agents:

- **`list_tickets`** - List all tickets for an organization
- **`get_ticket`** - Get a specific ticket by ID
- **`create_ticket`** - Create a new ticket
- **`update_ticket_status`** - Update ticket status
- **`delete_ticket`** - Delete a ticket
- **`list_organizations`** - List all organizations
- **`get_organization`** - Get organization details
- **`search_tickets`** - Search tickets with filters
- **`get_ticket_statistics`** - Get ticket statistics and analytics