"""
Standalone MCP Server for the Ticket Board application
"""

from dotenv import load_dotenv
from fastmcp import FastMCP
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.requests import Request as StarletteRequest
from starlette.responses import JSONResponse
from fastmcp.server.auth import BearerAuthProvider
from fastmcp.server.dependencies import get_access_token, AccessToken
from jose import jwt
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
from database import SessionLocal
import crud
import models
import schemas
import os


load_dotenv(".env.local")

auth = BearerAuthProvider(
    jwks_uri=f"{os.getenv('STYTCH_DOMAIN')}/.well-known/jwks.json",
    issuer=f"stytch.com/{os.getenv("STYTCH_PROJECT_ID")}",
    algorithm="RS256",
    audience=os.getenv("STYTCH_PROJECT_ID")
)

# Create FastMCP instance
mcp = FastMCP("ticket-board-mcp", auth=auth)

@mcp.custom_route("/.well-known/oauth-protected-resource", methods=["GET", "OPTIONS"])
async def oauth_metadata(request) -> JSONResponse:
    base_url = str(request.base_url).rstrip("/")

    return JSONResponse(
        {
            "resource": base_url,
            "authorization_servers": [os.getenv("STYTCH_DOMAIN")],
            "scopes_supported": ["openid", "email", "profile"]
        }
    )

@mcp.tool()
async def list_tickets(organization_id: str) -> List[Dict[str, Any]]:
    """List all tickets for a specific organization"""
    db = SessionLocal()
    try:
        tickets = crud.get_tickets(db, organization_id)
        return [
            {
                "id": ticket.id,
                "title": ticket.title,
                "assignee": ticket.assignee,
                "status": ticket.status,
                "description": ticket.description,
                "created_at": ticket.created_at.isoformat(),
                "updated_at": ticket.updated_at.isoformat()
            }
            for ticket in tickets
        ]
    finally:
        db.close()

@mcp.tool()
async def get_ticket(ticket_id: str, organization_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific ticket by ID for a specific organization"""
    db = SessionLocal()
    try:
        ticket = crud.get_ticket(db, ticket_id, organization_id)
        if ticket:
            return {
                "id": ticket.id,
                "title": ticket.title,
                "assignee": ticket.assignee,
                "status": ticket.status,
                "description": ticket.description,
                "created_at": ticket.created_at.isoformat(),
                "updated_at": ticket.updated_at.isoformat()
            }
        return None
    finally:
        db.close()

@mcp.tool()
async def create_ticket(
    title: str, 
    assignee: str, 
    organization_id: str, 
    description: Optional[str] = None
) -> Dict[str, Any]:
    """Create a new ticket for a specific organization"""
    db = SessionLocal()
    try:
        # Ensure organization exists
        crud.get_or_create_organization(db, organization_id)
        
        # Create ticket data
        ticket_data = schemas.TicketCreate(
            title=title,
            assignee=assignee,
            description=description
        )
        
        # Create the ticket
        ticket = crud.create_ticket(db, ticket_data, organization_id)
        
        return {
            "id": ticket.id,
            "title": ticket.title,
            "assignee": ticket.assignee,
            "status": ticket.status,
            "description": ticket.description,
            "created_at": ticket.created_at.isoformat(),
            "updated_at": ticket.updated_at.isoformat()
        }
    finally:
        db.close()

@mcp.tool()
async def update_ticket_status(
    ticket_id: str, 
    status: str, 
    organization_id: str
) -> Optional[Dict[str, Any]]:
    """Update the status of a ticket"""
    db = SessionLocal()
    try:
        ticket = crud.update_ticket_status(db, ticket_id, status, organization_id)
        if ticket:
            return {
                "id": ticket.id,
                "title": ticket.title,
                "assignee": ticket.assignee,
                "status": ticket.status,
                "description": ticket.description,
                "created_at": ticket.created_at.isoformat(),
                "updated_at": ticket.updated_at.isoformat()
            }
        return None
    finally:
        db.close()

@mcp.tool()
async def delete_ticket(ticket_id: str, organization_id: str) -> bool:
    """Delete a ticket from a specific organization"""
    db = SessionLocal()
    try:
        return crud.delete_ticket(db, ticket_id, organization_id)
    finally:
        db.close()

@mcp.tool()
async def list_organizations() -> List[Dict[str, Any]]:
    """List all organizations in the system"""
    db = SessionLocal()
    try:
        organizations = db.query(models.Organization).all()
        return [
            {
                "id": org.id,
                "name": org.name,
                "created_at": org.created_at.isoformat(),
                "updated_at": org.updated_at.isoformat()
            }
            for org in organizations
        ]
    finally:
        db.close()

@mcp.tool()
async def get_organization(organization_id: str) -> Optional[Dict[str, Any]]:
    """Get a specific organization by ID"""
    db = SessionLocal()
    try:
        org = crud.get_organization(db, organization_id)
        info = org.name if org else None
        return info
    finally:
        db.close()

@mcp.tool()
async def search_tickets(
    organization_id: str,
    status: Optional[str] = None,
    assignee: Optional[str] = None,
    title_contains: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Search tickets with filters"""
    db = SessionLocal()
    try:
        tickets = crud.get_tickets(db, organization_id)
        
        # Apply filters
        if status:
            tickets = [t for t in tickets if t.status == status]
        if assignee:
            tickets = [t for t in tickets if t.assignee.lower() == assignee.lower()]
        if title_contains:
            tickets = [t for t in tickets if title_contains.lower() in t.title.lower()]
        
        return [
            {
                "id": ticket.id,
                "title": ticket.title,
                "assignee": ticket.assignee,
                "status": ticket.status,
                "description": ticket.description,
                "created_at": ticket.created_at.isoformat(),
                "updated_at": ticket.updated_at.isoformat()
            }
            for ticket in tickets
        ]
    finally:
        db.close()

@mcp.tool()
async def get_ticket_statistics(organization_id: str) -> Dict[str, Any]:
    """Get statistics about tickets for an organization"""
    db = SessionLocal()
    try:
        tickets = crud.get_tickets(db, organization_id)
        
        total_tickets = len(tickets)
        status_counts = {}
        assignee_counts = {}
        
        for ticket in tickets:
            # Count by status
            status_counts[ticket.status] = status_counts.get(ticket.status, 0) + 1
            
            # Count by assignee
            assignee_counts[ticket.assignee] = assignee_counts.get(ticket.assignee, 0) + 1
        
        return {
            "total_tickets": total_tickets,
            "status_distribution": status_counts,
            "assignee_distribution": assignee_counts,
            "organization_id": organization_id
        }
    finally:
        db.close()


@mcp.resource("organizations://all", mime_type="application/json")
async def organizations_resource() -> List[Dict[str, Any]]:
    db = SessionLocal()
    try:
        orgs = db.query(models.Organization).all()
        return [
            {
                "id": org.id,
                "name": org.name,
                "created_at": org.created_at.isoformat() if org.created_at else None,
                "updated_at": org.updated_at.isoformat() if org.updated_at else None,
            }
            for org in orgs
        ]
    finally:
        db.close()

@mcp.resource("tickets://{organization_id}", mime_type="application/json")
async def tickets_resource(organization_id: str) -> List[Dict[str, Any]]:
    db = SessionLocal()
    try:
        tickets = crud.get_tickets(db, organization_id)
        return [
            {
                "id": t.id,
                "title": t.title,
                "assignee": t.assignee,
                "status": t.status,
                "description": t.description,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None,
            }
            for t in tickets
        ]
    finally:
        db.close()

if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="127.0.0.1",
        port=8001,
        middleware=[
            Middleware(
                CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            )
        ]
    )
