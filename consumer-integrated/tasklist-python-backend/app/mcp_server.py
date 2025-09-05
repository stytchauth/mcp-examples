from fastmcp import FastMCP
from pydantic import BaseModel
from typing import List

from .services.todos import TodoService, Todo

mcp = FastMCP("TaskList Service")

class TodosResponse(BaseModel):
    todos: List[Todo]

@mcp.tool()
async def createTodo(user_id: str, todoText: str) -> TodosResponse:
    service = TodoService(user_id)
    todos = await service.add(todoText)
    return TodosResponse(todos=todos)

@mcp.tool()
async def markTodoComplete(user_id: str, todoID: str) -> TodosResponse:
    service = TodoService(user_id)
    todos = await service.mark_completed(todoID)
    return TodosResponse(todos=todos)

@mcp.tool()
async def deleteTodo(user_id: str, todoID: str) -> TodosResponse:
    service = TodoService(user_id)
    todos = await service.delete(todoID)
    return TodosResponse(todos=todos)

@mcp.resource("resource://tasks/{user_id}")
async def tasks(user_id: str) -> TodosResponse:
    service = TodoService(user_id)
    todos = await service.get()
    return TodosResponse(todos=todos)

@mcp.resource("resource://tasks/{user_id}/{todo_id}")
async def task(user_id: str, todo_id: str) -> TodosResponse:
    service = TodoService(user_id)
    todo = await service.get_by_id(todo_id)
    return TodosResponse(todos=[todo] if todo else [])