import {useState, useEffect, FormEvent} from 'react';
import {withLoginRequired} from "./Auth.js";
import type {Ticket} from "./types.js";
import {useStytchMember, useStytchOrganization, useStytchMemberSession} from "@stytch/react/b2b";

const SprintPlanner = withLoginRequired(() => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketAssignee, setNewTicketAssignee] = useState('');
    const {member} = useStytchMember();
    const {organization} = useStytchOrganization();
    const {session} = useStytchMemberSession();

    // Fetch tickets on component mount
    useEffect(() => {
        if (session) {
            getTickets().then(tickets => setTickets(tickets));
        }
    }, [session]);

    const createTicket = (title: string, assignee: string) => {
        if (!session) return Promise.reject('No session');
        
        return fetch('/api/tickets', {
            method: 'POST',
            body: JSON.stringify({ title, assignee })
        })
        .then(res => res.json())
        .then(res => res.tickets);
    };

    const getTickets = () => {
        if (!session) return Promise.reject('No session');
        
        return fetch('/api/tickets', {
        })
        .then(res => res.json())
        .then(res => res.tickets);
    };

    const updateTicketStatus = (id: string, status: Ticket['status']) => {
        if (!session) return Promise.reject('No session');
        
        return fetch(`/api/tickets/${id}/status`, {
            method: 'POST',
            body: JSON.stringify({ status })
        })
        .then(res => res.json())
        .then(res => res.tickets);
    };

    const deleteTicket = (id: string) => {
        if (!session) return Promise.reject('No session');
        
        return fetch(`/api/tickets/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(res => res.tickets);
    };

    const onAddTicket = (evt: FormEvent) => {
        evt.preventDefault();
        if (!newTicketTitle.trim() || !newTicketAssignee.trim()) return;
        
        createTicket(newTicketTitle, newTicketAssignee).then(tickets => setTickets(tickets));
        setNewTicketTitle('');
        setNewTicketAssignee('');
    };

    const onUpdateStatus = (id: string, newStatus: Ticket['status']) => {
        updateTicketStatus(id, newStatus).then(tickets => setTickets(tickets));
    };

    const onDeleteTicket = (id: string) => {
        deleteTicket(id).then(tickets => setTickets(tickets));
    };

    const statusColumns: {status: Ticket['status'], title: string, color: string}[] = [
        {status: 'backlog', title: 'Backlog', color: 'bg-gray-100'},
        {status: 'in-progress', title: 'In Progress', color: 'bg-blue-100'},
        {status: 'review', title: 'Review', color: 'bg-yellow-100'},
        {status: 'done', title: 'Done', color: 'bg-green-100'}
    ];

    const getTicketsByStatus = (status: Ticket['status']) => 
        tickets.filter(ticket => ticket.status === status);

    return (
        <div className="sprintPlanner">
            <div className="boardHeader">
                <h2>Sprint Planner</h2>
                {organization && <p>Organization: {organization.organization_name}</p>}
            </div>

            {/* Create Ticket Form */}
            <form onSubmit={onAddTicket} className="createTicketForm">
                <input
                    type='text'
                    placeholder="Ticket title"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    required
                />
                <input
                    type='text'
                    placeholder="Assignee (member ID)"
                    value={newTicketAssignee}
                    onChange={(e) => setNewTicketAssignee(e.target.value)}
                    required
                />
                <button type="submit" className="primary">Create Ticket</button>
            </form>

            {/* Ticket Board */}
            <div className="boardColumns">
                {statusColumns.map(column => (
                    <div key={column.status} className={`column ${column.color}`}>
                        <h3>{column.title}</h3>
                        <div className="tickets">
                            {getTicketsByStatus(column.status).map(ticket => (
                                <div key={ticket.id} className="ticket">
                                    <div className="ticketHeader">
                                        <h4>{ticket.title}</h4>
                                        <button 
                                            onClick={() => onDeleteTicket(ticket.id)} 
                                            className="deleteBtn"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <p className="assignee">Assignee: {ticket.assignee}</p>
                                    <div className="statusControls">
                                        {statusColumns.map(statusCol => (
                                            <button
                                                key={statusCol.status}
                                                onClick={() => onUpdateStatus(ticket.id, statusCol.status)}
                                                className={`statusBtn ${ticket.status === statusCol.status ? 'active' : ''}`}
                                            >
                                                {statusCol.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default SprintPlanner;