from fastmcp import FastMCP
from pydantic import BaseModel
from typing import List

from .services.todos import TodoService, Task

mcp = FastMCP("TaskList Service")

class TasksResponse(BaseModel):
    tasks: List[Task]

@mcp.tool()
async def createTask(user_id: str, taskText: str) -> TasksResponse:
    service = TodoService(user_id)
    todos = await service.add(taskText)
    return TasksResponse(todos=todos)

@mcp.tool()
async def markTaskComplete(user_id: str, taskID: str) -> TasksResponse:
    service = TodoService(user_id)
    todos = await service.mark_completed(taskID)
    return TasksResponse(todos=todos)

@mcp.tool()
async def deleteTask(user_id: str, taskID: str) -> TasksResponse:
    service = TodoService(user_id)
    todos = await service.delete(taskID)
    return TasksResponse(todos=todos)

@mcp.resource("resource://tasks/{user_id}")
async def tasks(user_id: str) -> TasksResponse:
    service = TodoService(user_id)
    todos = await service.get()
    return TasksResponse(todos=todos)

@mcp.resource("resource://tasks/{user_id}/{task_id}")
async def task(user_id: str, task_id: str) -> TasksResponse:
    service = TodoService(user_id)
    todo = await service.get_by_id(task_id)
    return TasksResponse(todos=[todo] if todo else [])