from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import models
import schemas

# Organization CRUD operations
def get_organization(db: Session, org_id: str) -> Optional[models.Organization]:
    return db.query(models.Organization).filter(models.Organization.id == org_id).first()

def create_organization(db: Session, name: str) -> models.Organization:
    db_org = models.Organization(name=name)
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

def get_or_create_organization(db: Session, org_id: str, name: str = "Default Organization") -> models.Organization:
    """Get existing organization or create a new one"""
    org = get_organization(db, org_id)
    if not org:
        org = create_organization(db, name)
    return org

# Ticket CRUD operations
def get_tickets(db: Session, org_id: str) -> List[models.Ticket]:
    return db.query(models.Ticket).filter(models.Ticket.organization_id == org_id).all()

def get_ticket(db: Session, ticket_id: str, org_id: str) -> Optional[models.Ticket]:
    return db.query(models.Ticket).filter(
        and_(models.Ticket.id == ticket_id, models.Ticket.organization_id == org_id)
    ).first()

def create_ticket(db: Session, ticket: schemas.TicketCreate, org_id: str) -> models.Ticket:
    db_ticket = models.Ticket(
        title=ticket.title,
        assignee=ticket.assignee,
        description=ticket.description,
        organization_id=org_id
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def update_ticket_status(db: Session, ticket_id: str, status: str, org_id: str) -> Optional[models.Ticket]:
    ticket = get_ticket(db, ticket_id, org_id)
    if ticket:
        ticket.status = status
        db.commit()
        db.refresh(ticket)
    return ticket

def update_ticket(db: Session, ticket_id: str, ticket_update: schemas.TicketUpdate, org_id: str) -> Optional[models.Ticket]:
    ticket = get_ticket(db, ticket_id, org_id)
    if ticket:
        update_data = ticket_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(ticket, field, value)
        db.commit()
        db.refresh(ticket)
    return ticket

def delete_ticket(db: Session, ticket_id: str, org_id: str) -> bool:
    ticket = get_ticket(db, ticket_id, org_id)
    if ticket:
        db.delete(ticket)
        db.commit()
        return True
    return False
