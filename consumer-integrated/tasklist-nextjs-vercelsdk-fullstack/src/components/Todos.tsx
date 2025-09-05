"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { withLoginRequired } from "./Auth";
import { useStytchUser } from "@stytch/nextjs";
import { Todo } from "@/services/TodoService";
import { TodoClient } from "@/services/TodoClient";

const TodoEditor = withLoginRequired(() => {
  const [newTodoText, setNewTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const { user } = useStytchUser();

  // Load todos from our API
  const loadTodos = useCallback(async () => {
    if (!user) return;
    
    try {
      const todos = await TodoClient.getTodos();
      setTodos(todos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [user, loadTodos]);

  const onAddTodo = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!user || !newTodoText.trim()) return;

    try {
      const todos = await TodoClient.createTodo(newTodoText);
      setTodos(todos);
      setNewTodoText("");
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const onCompleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todos = await TodoClient.completeTodo(id);
      setTodos(todos);
    } catch (error) {
      console.error('Failed to complete todo:', error);
    }
  };

  const onDeleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todos = await TodoClient.deleteTodo(id);
      setTodos(todos);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="todoEditor">
      <p>
        The TODO items shown below can be edited via the UI + REST API, or via
        the MCP Server. Connect to the MCP Server running at{" "}
        <span>
          <b>
            <code>{window.location.origin}/mcp</code>
          </b>
        </span>{" "}
        with your MCP Client to try it out.
      </p>
      <ul>
        <form onSubmit={onAddTodo}>
          <li>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <button type="submit" className="primary">
              Add TODO
            </button>
          </li>
        </form>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div>
              {todo.completed ? (
                <>
                  ✔️ <s>{todo.text}</s>
                </>
              ) : (
                todo.text
              )}
            </div>
            <div>
              {!todo.completed && (
                <button onClick={() => onCompleteTodo(todo.id)}>
                  Complete
                </button>
              )}
              <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default TodoEditor;