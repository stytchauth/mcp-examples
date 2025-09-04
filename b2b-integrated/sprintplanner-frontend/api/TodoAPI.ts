import {Hono} from "hono";
import {ticketService} from "./TicketService";
import {stytchSessionAuthMiddleware} from "./lib/auth";

// Define the environment and context types
type Env = {
    TICKETS: any; // KV namespace for storing tickets
}

type ContextVariables = {
    memberID: string;
    organizationID: string;
}

/**
 * The Hono app exposes the Ticket Service via REST endpoints for consumption by the frontend
 */
export const TicketAPI = new Hono<{ Bindings: Env; Variables: ContextVariables }>()

    .get('/tickets', stytchSessionAuthMiddleware, async (c) => {
        const tickets = await ticketService(c.env, c.var.organizationID).get()
        return c.json({tickets})
    })

    .post('/tickets', stytchSessionAuthMiddleware, async (c) => {
        const newTicket = await c.req.json<{ title: string; assignee: string }>();
        const tickets = await ticketService(c.env, c.var.organizationID).add(newTicket.title, newTicket.assignee)
        return c.json({tickets})
    })

    .post('/tickets/:id/status', stytchSessionAuthMiddleware, async (c) => {
        const { status } = await c.req.json<{ status: string }>();
        const tickets = await ticketService(c.env, c.var.organizationID).updateStatus(c.req.param().id, status as any)
        return c.json({tickets})
    })

    .delete('/tickets/:id', stytchSessionAuthMiddleware, async (c) => {
        const tickets = await ticketService(c.env, c.var.organizationID).delete(c.req.param().id)
        return c.json({tickets})
    })

export type TicketApp = typeof TicketAPI;