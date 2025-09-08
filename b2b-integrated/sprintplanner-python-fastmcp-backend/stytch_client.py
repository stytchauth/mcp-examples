import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from stytch import Client

# Load local environment for backend (project ID/secret, etc.)
load_dotenv(".env.local")

class StytchClient:
    def __init__(self):
        self.project_id = os.getenv("STYTCH_PROJECT_ID")
        self.secret = os.getenv("STYTCH_SECRET")
        self.domain = os.getenv("STYTCH_DOMAIN")

        if not self.project_id or not self.secret:
            raise ValueError("STYTCH_PROJECT_ID and STYTCH_SECRET must be set")

        # Initialize official SDK client
        self.client = Client(
            project_id=self.project_id,
            secret=self.secret,
            environment="test",
            custom_base_url=self.domain,
        )

    async def verify_session(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify a Stytch B2B session (JWT or opaque token) using the official SDK."""
        try:
            is_jwt = token.count(".") == 2
            if is_jwt:
                resp = self.client.b2b.sessions.authenticate_jwt(session_jwt=token)
            else:
                resp = self.client.b2b.sessions.authenticate(session_token=token)

            # Extract canonical fields
            member = getattr(resp, "member", None)
            organization = getattr(resp, "organization", None)
            session = getattr(resp, "session", None)

            return {
                "member_id": getattr(member, "member_id", None) if member else None,
                "organization_id": getattr(organization, "organization_id", None) if organization else None,
                "session_id": getattr(session, "id", None) if session else None,
            }
        except Exception as e:
            print(f"Error verifying Stytch session: {e}")
            return None

# Global client instance
stytch_client = StytchClient()
