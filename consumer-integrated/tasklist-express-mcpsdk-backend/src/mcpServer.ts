import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TodoService, Todo } from "./TodoService";

function formatResponse(description: string, newState: Todo[]) {
  return {
    content: [{
      type: "text" as const,
      text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}`
    }]
  };
}

export function createMcpServer(userID: string): McpServer {
  const todoService = new TodoService(userID);
  const server = new McpServer({ name: 'TaskList Service', version: '1.0.0' });

  server.resource("Todos", new ResourceTemplate("todoapp://todos/{id}", {
    list: async () => {
      const todos = await todoService.get();
      return {
        resources: todos.map(todo => ({
          name: todo.text,
          uri: `todoapp://todos/${todo.id}`
        }))
      };
    }
  }),
  async (uri, { id }) => {
    const todos = await todoService.get();
    const todo = todos.find(todo => todo.id === id);
    return {
      contents: [
        {
          uri: uri.href,
          text: todo ? `text: ${todo.text} completed: ${todo.completed}` : 'NOT FOUND',
        },
      ],
    };
  });

  server.tool('createTodo', 'Add a new TODO task', { todoText: z.string() }, async ({ todoText }) => {
    const todos = await todoService.add(todoText);
    return formatResponse('TODO added successfully', todos);
  });

  server.tool('markTodoComplete', 'Mark a TODO as complete', { todoID: z.string() }, async ({ todoID }) => {
    const todos = await todoService.markCompleted(todoID);
    return formatResponse('TODO completed successfully', todos);
  });

  server.tool('deleteTodo', 'Mark a TODO as deleted', { todoID: z.string() }, async ({ todoID }) => {
    const todos = await todoService.delete(todoID);
    return formatResponse('TODO deleted successfully', todos);
  });

  return server;
}