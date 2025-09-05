import * as stytch from 'stytch';

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
}

/**
 * The `TodoService` class provides methods for managing a to-do list using Stytch user metadata storage.
 */
export class TodoService {
    constructor(
        private client: stytch.Client,
        private userID: string
    ) {
    }

    get = async (): Promise<Todo[]> => {
        const user = await this.client.users.get({ user_id: this.userID });
        return user.untrusted_metadata?.todos || [];
    }
    
    set = async (todos: Todo[]): Promise<Todo[]> => {
        const sorted = todos.sort((t1, t2) => {
            if (t1.completed === t2.completed) {
                return t1.id.localeCompare(t2.id);
            }
            return t1.completed ? 1 : -1;
        });

        await this.client.users.update({ 
            user_id: this.userID, 
            untrusted_metadata: { todos: sorted } 
        });
        return sorted;
    }

    add = async (todoText: string): Promise<Todo[]> => {
        const todos = await this.get();
        const newTodo: Todo = {
            id: Date.now().toString(),
            text: todoText,
            completed: false
        }
        todos.push(newTodo);
        return this.set(todos);
    }

    delete = async (todoID: string): Promise<Todo[]> => {
        const todos = await this.get();
        const cleaned = todos.filter(t => t.id !== todoID);
        return this.set(cleaned);
    }

    markCompleted = async (todoID: string): Promise<Todo[]> => {
        const todos = await this.get();
        const todoIndex = todos.findIndex(t => t.id === todoID);

        if (todoIndex === -1) {
            return todos;
        }
        const updatedTodos = [
            ...todos.slice(0, todoIndex),
            { ...todos[todoIndex], completed: true },
            ...todos.slice(todoIndex + 1)
        ];
        return this.set(updatedTodos);
    }
}