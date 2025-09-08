import httpx
import os
import base64
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load local environment for backend (project ID/secret, etc.)
load_dotenv(".env.local")

class StytchClient:
    def __init__(self):
        self.project_id = os.getenv("STYTCH_PROJECT_ID")
        self.secret = os.getenv("STYTCH_SECRET")
        # Use B2B base path
        self.base_url = "https://test.stytch.com/v1/b2b"
        
        if not self.project_id or not self.secret:
            raise ValueError("STYTCH_PROJECT_ID and STYTCH_SECRET must be set")
    
    async def verify_session(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify a Stytch B2B session (JWT or token) and return session data"""
        try:
            # Build HTTP Basic auth header: base64(project_id:secret)
            credentials = f"{self.project_id}:{self.secret}".encode("utf-8")
            basic_auth = base64.b64encode(credentials).decode("utf-8")

            # Decide whether the provided token is a JWT or an opaque token
            is_jwt = token.count(".") == 2

            payload: Dict[str, Any] = {
                ("session_jwt" if is_jwt else "session_token"): token
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/sessions/authenticate",
                    headers={
                        "Authorization": f"Basic {basic_auth}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Response can include member/org at top-level or nested
                    member_id = data.get("member_id") or (data.get("member") or {}).get("member_id")
                    organization_id = data.get("organization_id") or (data.get("organization") or {}).get("organization_id")
                    session_id = data.get("session_id") or (data.get("session") or {}).get("id")
                    return {"member_id": member_id, "organization_id": organization_id, "session_id": session_id}
                else:
                    print(f"Stytch API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"Error verifying Stytch session: {e}")
            return None

# Global client instance
stytch_client = StytchClient()
