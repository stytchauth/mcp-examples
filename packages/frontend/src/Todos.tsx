import {useState, useEffect, FormEvent} from 'react';
import {hc} from 'hono/client'
import {withLoginRequired} from "./utils/withLoginRequired";
import {Todo} from "../types.d";

const client = hc(`${window.location.origin}/api`) as any

const createTodo = (todoText: string) =>
    client.todos.$post({json: {todoText}})
        .then((res: any) => res.json())
        .then((res: any) => res.todos)

const getTodos = () =>
    client.todos.$get({})
        .then((res: any) => res.json())
        .then((res: any) => res.todos)

const deleteTodo = (id: string) =>
    client.todos[':id'].$delete({param: {id}})
        .then((res: any) => res.json())
        .then((res: any) => res.todos)

const markComplete = (id: string) =>
    client.todos[':id']['complete'].$post({param: {id}})
        .then((res: any) => res.json())
        .then((res: any) => res.todos)

const TodoEditor = withLoginRequired(() => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState('');

    // Fetch todos on component mount
    useEffect(() => {
        getTodos().then((todos: any) => setTodos(todos));
    }, []);

    const onAddTodo = (evt: FormEvent) => {
        evt.preventDefault();
        createTodo(newTodoText).then((todos: any) => setTodos(todos));
        setNewTodoText('');
    };

    const onCompleteTodo = (id: string) => {
        markComplete(id).then((todos: any) => setTodos(todos));
    };

    const onDeleteTodo = (id: string) => {
        deleteTodo(id).then((todos: any) => setTodos(todos));
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