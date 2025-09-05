import { Todo } from "./TodoService";

export class TodoClient {
  private static createHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  static async getTodos(): Promise<Todo[]> {
    const response = await fetch('/api/todos');

    if (!response.ok) {
      throw new Error('Failed to load todos');
    }

    const data = await response.json();
    return data.todos;
  }

  static async createTodo(text: string): Promise<Todo[]> {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: this.createHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    const data = await response.json();
    return data.todos;
  }

  static async completeTodo(id: string): Promise<Todo[]> {
    const response = await fetch(`/api/todos/${id}/complete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to complete todo');
    }

    const data = await response.json();
    return data.todos;
  }

  static async deleteTodo(id: string): Promise<Todo[]> {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    const data = await response.json();
    return data.todos;
  }
}