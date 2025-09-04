#!/usr/bin/env python3
"""
Database initialization script for the Ticket Board application
"""

from database import engine
import models
import crud
import schemas
from sqlalchemy.orm import Session
from database import SessionLocal

def init_db():
    """Initialize the database with tables and sample data"""
    
    # Create all tables
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    
    # Create sample data
    print("Creating sample data...")
    db = SessionLocal()
    
    try:
        # Create a sample organization
        sample_org = crud.create_organization(db, "Sample Organization")
        print(f"✅ Created organization: {sample_org.name}")
        
        # Create some sample tickets
        sample_tickets = [
            {"title": "Set up development environment", "assignee": "Developer", "description": "Install all required tools and dependencies"},
            {"title": "Design user interface", "assignee": "Designer", "description": "Create wireframes and mockups"},
            {"title": "Write API documentation", "assignee": "Technical Writer", "description": "Document all endpoints and usage examples"},
            {"title": "Set up CI/CD pipeline", "assignee": "DevOps Engineer", "description": "Configure automated testing and deployment"}
        ]
        
        for ticket_data in sample_tickets:
            crud.create_ticket(db, schemas.TicketCreate(**ticket_data), sample_org.id)
        
        print(f"✅ Created {len(sample_tickets)} sample tickets")
        print("🎉 Database initialization complete!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
