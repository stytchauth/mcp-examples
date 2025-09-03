import {Hono} from "hono";
import {todoService} from "./TodoService";
import {Consumer} from "@hono/stytch-auth";

/**
 * The Hono app exposes the TODO Service via REST endpoints for consumption by the frontend
 */
export const TodoAPI = new Hono<{ Bindings: Env }>()

    .get('/healthcheck', async (c) => {
        const errors: Array<{variable: string, description: string}> = [];
        
        if (!c.env.STYTCH_PROJECT_ID) {
            errors.push({
                variable: 'STYTCH_PROJECT_ID',
                description: 'Your Stytch project ID (e.g., project-test-6c20cd16-73d5-44f7-852c-9a7e7b2ccf62)'
            });
        }
        if (!c.env.STYTCH_PROJECT_SECRET) {
            errors.push({
                variable: 'STYTCH_PROJECT_SECRET',
                description: 'Your Stytch secret key from Project Settings'
            });
        }
        if (!c.env.STYTCH_DOMAIN) {
            errors.push({
                variable: 'STYTCH_DOMAIN',
                description: 'Your Stytch domain (e.g., https://cname-word-1234.customers.stytch.dev)'
            });
        }
        
        if (errors.length > 0) {
            return c.json({ 
                status: 'error', 
                errors,
                message: 'Backend configuration is incomplete. Add missing variables to .dev.vars file.',
                configFile: '.dev.vars'
            }, 500);
        }
        
        return c.json({ 
            status: 'ok', 
            message: 'All environment variables are configured correctly' 
        });
    })

    // authenticateSessionLocal() verifies the Stytch Session Token stored in the cookies
    // and makes the session information available to later endpoints via getStytchSession()
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
