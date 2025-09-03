import {useState, useEffect, FormEvent} from 'react';
import {withLoginRequired} from "./utils/withLoginRequired";
import {Todo} from "../types";

const handleTodoResponse = async (res: Response) => {
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }
    const body: {todos: Todo[]} = await res.json();
    return body.todos
}

const createTodo = (todoText: string) =>
    fetch(`${window.location.origin}/api/todos`, {
        method: 'POST',
        body: JSON.stringify({todoText})
    }).then(handleTodoResponse)

const getTodos = () =>
    fetch(`${window.location.origin}/api/todos`, {
        method: 'GET',
    }).then(handleTodoResponse)

const deleteTodo = (id: string) =>
    fetch(`${window.location.origin}/api/todos/${id}`, {
        method: 'DELETE',
    }).then(handleTodoResponse)

const markComplete = (id: string) =>
    fetch(`${window.location.origin}/api/todos/${id}/complete`, {
        method: 'POST',
    }).then(handleTodoResponse)

const TodoEditor = withLoginRequired(() => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState('');

    // Fetch todos on component mount
    useEffect(() => {
        getTodos().then((todos) => setTodos(todos));
    }, []);

    const onAddTodo = (evt: FormEvent) => {
        evt.preventDefault();
        createTodo(newTodoText).then((todos) => setTodos(todos));
        setNewTodoText('');
    };

    const onCompleteTodo = (id: string) => {
        markComplete(id).then((todos) => setTodos(todos));
    };

    const onDeleteTodo = (id: string) => {
        deleteTodo(id).then((todos) => setTodos(todos));
    };

    return (
        <div className="todoEditor">
            <p>
                The TODO items shown below can be edited via the UI + REST API, or via the MCP Server.
                Connect to the MCP Server running at <span><b><code>{window.location.origin}/mcp</code></b></span>{' '}
                with your MCP Client to try it out.
            </p>
            <ul>
                <form onSubmit={onAddTodo}>
                    <li>
                        <input
                            type='text'
                            value={newTodoText}
                            onChange={(e) => setNewTodoText(e.target.value)}
                        />
                        <button type="submit" className="primary">Add TODO</button>
                    </li>
                </form>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <div>
                            {todo.completed ? <>✔️ <s>{todo.text}</s></> : todo.text}
                        </div>
                        <div>
                            {!todo.completed && <button onClick={() => onCompleteTodo(todo.id)}>Complete</button>}
                            <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default TodoEditor;