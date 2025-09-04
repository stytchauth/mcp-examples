from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud
import models
import schemas
from database import engine, get_db
from mcp_server_standalone import mcp  
from stytch_client import stytch_client

# SETUP steps
models.Base.metadata.create_all(bind=engine)
# Build MCP ASGI app first to wire lifespan
mcp_app = mcp.http_app(path="/")
# Pass MCP lifespan into FastAPI so StreamableHTTP session manager is initialized
app = FastAPI(title="Ticket Board API", version="1.0.0", lifespan=mcp_app.lifespan)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the MCP endpoints at /mcp
app.mount("/mcp", mcp_app)

async def verify_stytch_session(authorization: str = Header(None)):
    """Verify Stytch B2B session (JWT or token) against Stytch API"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization[7:]

    session = await stytch_client.verify_session(token)
    if not session or not session.get("organization_id"):
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    return session

@app.get("/")
async def root():
    return {"message": "Ticket Board API"}

@app.get("/api/tickets", response_model=schemas.TicketListResponse)
async def get_tickets(
    session: dict = Depends(verify_stytch_session),
    db: Session = Depends(get_db)
):
    """Get all tickets for the organization"""
    org_id = session["organization_id"]
    
    # Ensure organization exists
    crud.get_or_create_organization(db, org_id)
    
    tickets = crud.get_tickets(db, org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.post("/api/tickets", response_model=schemas.TicketListResponse)
async def create_ticket(
    ticket_data: schemas.TicketCreate,
    session: dict = Depends(verify_stytch_session),
    db: Session = Depends(get_db)
):
    """Create a new ticket"""
    org_id = session["organization_id"]
    
    # Ensure organization exists
    crud.get_or_create_organization(db, org_id)
    
    # Create the ticket
    crud.create_ticket(db, ticket_data, org_id)
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(db, org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.post("/api/tickets/{ticket_id}/status", response_model=schemas.TicketListResponse)
async def update_ticket_status(
    ticket_id: str,
    status_data: schemas.TicketStatusUpdate,
    session: dict = Depends(verify_stytch_session),
    db: Session = Depends(get_db)
):
    """Update ticket status"""
    org_id = session["organization_id"]
    
    # Validate status
    valid_statuses = ["backlog", "in-progress", "review", "done"]
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    # Update the ticket
    ticket = crud.update_ticket_status(db, ticket_id, status_data.status, org_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(db, org_id)
    return schemas.TicketListResponse(tickets=tickets)

@app.delete("/api/tickets/{ticket_id}", response_model=schemas.TicketListResponse)
async def delete_ticket(
    ticket_id: str,
    session: dict = Depends(verify_stytch_session),
    db: Session = Depends(get_db)
):
    """Delete a ticket"""
    org_id = session["organization_id"]
    
    # Delete the ticket
    success = crud.delete_ticket(db, ticket_id, org_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Return all tickets for the organization
    tickets = crud.get_tickets(db, org_id)
    return schemas.TicketListResponse(tickets=tickets)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
