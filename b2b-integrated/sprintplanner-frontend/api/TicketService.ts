import { Ticket } from "../types";

// Define the environment type
type Env = {
    TICKETS: any; // KV namespace for storing tickets
}

/**
 * The `TicketService` class provides methods for managing tickets backed by Cloudflare KV storage.
 * This includes operations such as retrieving tickets, adding new tickets,
 * updating ticket status, and deleting tickets.
 */
class TicketService {
    constructor(
        private env: Env,
        private organizationID: string,
    ) {
    }

    get = async (): Promise<Ticket[]> => {
        const tickets = await this.env.TICKETS.get<Ticket[]>(this.organizationID, "json")
        return tickets || [];
    }

    #set = async (tickets: Ticket[]): Promise<Ticket[]> => {
        // Sort by creation date, newest first
        const sorted = tickets.sort((t1, t2) => 
            new Date(t2.createdAt).getTime() - new Date(t1.createdAt).getTime()
        );

        await this.env.TICKETS.put(this.organizationID, JSON.stringify(sorted))
        return sorted
    }

    add = async (title: string, assignee: string): Promise<Ticket[]> => {
        const tickets = await this.get()
        const now = new Date().toISOString();
        
        const newTicket: Ticket = {
            id: Date.now().toString(),
            title,
            assignee,
            status: 'backlog',
            createdAt: now,
            updatedAt: now
        }
        
        tickets.push(newTicket)
        return this.#set(tickets)
    }

    updateStatus = async (ticketID: string, newStatus: Ticket['status']): Promise<Ticket[]> => {
        const tickets = await this.get()
        const ticket = tickets.find(t => t.id === ticketID);
        
        if (ticket) {
            ticket.status = newStatus;
            ticket.updatedAt = new Date().toISOString();
            return this.#set(tickets);
        }
        
        return tickets;
    }

    delete = async (ticketID: string): Promise<Ticket[]> => {
        const tickets = await this.get()
        const cleaned = tickets.filter(t => t.id !== ticketID);
        return this.#set(cleaned);
    }
}

export const ticketService = (env: Env, organizationID: string) => new TicketService(env, organizationID)
