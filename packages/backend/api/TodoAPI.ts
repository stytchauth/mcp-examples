import {Hono} from "hono";
import {todoService} from "./TodoService";
import {Consumer} from "@hono/stytch-auth";

/**
 * The Hono app exposes the TODO Service via REST endpoints for consumption by the frontend
 */
export const TodoAPI = new Hono<{ Bindings: Env }>()
    .use('/*', Consumer.authenticateSessionLocal())

    .get('/todos', async (c) => {
        const {user_id} = Consumer.getStytchSession(c)
        const todos = await todoService(c.env, user_id).get()
        return c.json({todos})
    })

    .post('/todos', async (c) => {
        const {user_id} = Consumer.getStytchSession(c)
        const newTodo = await c.req.json<{ todoText: string }>();
        const todos = await todoService(c.env, user_id).add(newTodo.todoText)
        return c.json({todos})
    })

    .post('/todos/:id/complete', async (c) => {
        const {user_id} = Consumer.getStytchSession(c)
        const todos = await todoService(c.env, user_id).markCompleted(c.req.param().id)
        return c.json({todos})
    })

    .delete('/todos/:id', async (c) => {
        const {user_id} = Consumer.getStytchSession(c)
        const todos = await todoService(c.env, user_id).delete(c.req.param().id)
        return c.json({todos})
    })
