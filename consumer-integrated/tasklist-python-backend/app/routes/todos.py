from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from typing import List

from ..services.todos import TodoService, Task

router = APIRouter()

class TodosResponse(BaseModel):
    todos: List[Task]

class CreateTodoBody(BaseModel):
    todoText: str

@router.get('/todos', response_model=TodosResponse)
async def get_todos(request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).get()
    return { 'todos': todos }

@router.post('/todos', response_model=TodosResponse)
async def create_todo(body: CreateTodoBody, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).add(body.todoText)
    return { 'todos': todos }

@router.post('/todos/{todo_id}/complete', response_model=TodosResponse)
async def complete_todo(todo_id: str, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).mark_completed(todo_id)
    return { 'todos': todos }

@router.delete('/todos/{todo_id}', response_model=TodosResponse)
async def delete_todo(todo_id: str, request: Request):
    user_id = request.state.user.user_id  # type: ignore[attr-defined]
    todos = await TodoService(user_id).delete(todo_id)
    return { 'todos': todos }
