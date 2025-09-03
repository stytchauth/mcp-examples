import {McpServer, ResourceTemplate} from '@modelcontextprotocol/sdk/server/mcp.js'
import {z} from 'zod'
import {todoService} from "./TodoService";
import {Todo} from "../types";

function formatResponse(description: string, newState: Todo[]): {
    content: Array<{ type: 'text', text: string }>
} {
    return {
        content: [{
            type: "text",
            text: `Success! ${description}\n\nNew state:\n${JSON.stringify(newState, null, 2)}}`
        }]
    };
}

// Creates a stateless MCP Server instance to process the request
// The MCP Server will be bound to the provided userID and will only access that user's information
export function createMcpServer(env: Env, userID: string): McpServer {
    const todoSvc = todoService(env, userID);

    const server = new McpServer({name: 'TaskList Service', version: '1.0.0'})

    server.resource("Todos", new ResourceTemplate("todoapp://todos/{id}", {
            list: async () => {
                const todos = await todoSvc.get()

                return {
                    resources: todos.map(todo => ({
                        name: todo.text,
                        uri: `todoapp://todos/${todo.id}`
                    }))
                }
            }
        }),
        async (uri, {id}) => {
            const todos = await todoSvc.get();
            const todo = todos.find(todo => todo.id === id);
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: todo ? `text: ${todo.text} completed: ${todo.completed}` : 'NOT FOUND',
                    },
                ],
            }
        }
    )

    server.tool('createTodo', 'Add a new TODO task', {todoText: z.string()}, async ({todoText}) => {
        const todos = await todoSvc.add(todoText)
        return formatResponse('TODO added successfully', todos)
    })

    server.tool('markTodoComplete', 'Mark a TODO as complete', {todoID: z.string()}, async ({todoID}) => {
        const todos = await todoSvc.markCompleted(todoID)
        return formatResponse('TODO completed successfully', todos)
    })

    server.tool('deleteTodo', 'Mark a TODO as deleted', {todoID: z.string()}, async ({todoID}) => {
        const todos = await todoSvc.delete(todoID)
        return formatResponse('TODO deleted successfully', todos)
    })

    return server
}