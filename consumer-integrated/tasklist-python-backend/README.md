# Tasklist Python Backend (FastAPI + MCP)

A Python implementation of the Tasklist backend and MCP server, mirroring the Express backend API.

## Features
- FastAPI server with REST endpoints under `/api`
- SQLite-backed `TodoService` with per-user isolation
- Stytch-based auth for session cookies and bearer tokens
- OAuth Protected Resource metadata at `/.well-known/oauth-protected-resource`
- MCP server stub exposed at `/mcp` (HTTP transport TBD)

## Requirements
- Python 3.10+
- `pip install -r requirements.txt`
- A `.env.local` file with:
  - `STYTCH_PROJECT_ID`
  - `STYTCH_PROJECT_SECRET`
  - `STYTCH_DOMAIN` (e.g. https://test.stytch.com)
  - `PORT` (optional, default 3001)

## Running
```bash
cd consumer-integrated/tasklist-python-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port ${PORT:-3001}
```

Then open the frontend and point it at the same origin for API.
