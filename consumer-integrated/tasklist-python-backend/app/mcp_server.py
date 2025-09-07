import os
from fastmcp import FastMCP
from pydantic import BaseModel
from typing import List

from .services.todos import TodoService, Task
from mcp.server.auth.middleware.auth_context import get_access_token
from fastmcp.server.auth.providers.jwt import JWTVerifier
from dotenv import load_dotenv

load_dotenv('.env.local')


def _get_user_id_from_token() -> str:
    token = get_access_token()
    if not token:
        raise ValueError("Unauthorized: missing access token")

    for claim_name in ("sub"):
        value = getattr(token, claim_name, None)
        if isinstance(value, str) and value:
            return value

    # Fallback: use client_id if no subject-like claim is available
    if getattr(token, "client_id", None):
        return token.client_id  # type: ignore[attr-defined]

    raise ValueError("Unauthorized: unable to determine user id from token")

# Configure FastMCP with JWT auth so get_access_token() is available
STYTCH_DOMAIN = os.getenv('STYTCH_DOMAIN')
STYTCH_PROJECT_ID = os.getenv('STYTCH_PROJECT_ID')
PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL', 'http://localhost:3001')

mcp = FastMCP(
    "TaskList Service",
    auth=JWTVerifier(
        jwks_uri=f"{STYTCH_DOMAIN}/.well-known/jwks.json" if STYTCH_DOMAIN else None,
        algorithm="RS256",
    ),
    # Ensure we don't double-prefix paths when mounting under /mcp in FastAPI
    streamable_http_path="/",
)

class TasksResponse(BaseModel):
    tasks: List[Task]

@mcp.tool()
async def createTask(taskText: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.add(taskText)
    return TasksResponse(tasks=todos)

@mcp.tool()
async def markTaskComplete(taskID: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.mark_completed(taskID)
    return TasksResponse(tasks=todos)

@mcp.tool()
async def deleteTask(taskID: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.delete(taskID)
    return TasksResponse(tasks=todos)

@mcp.resource("resource://tasks")
async def tasks() -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todos = await service.get()
    return TasksResponse(tasks=todos)

@mcp.resource("resource://tasks/{task_id}")
async def task(task_id: str) -> TasksResponse:
    user_id = _get_user_id_from_token()
    service = TodoService(user_id)
    todo = await service.get_by_id(task_id)
    return TasksResponse(tasks=[todo] if todo else [])