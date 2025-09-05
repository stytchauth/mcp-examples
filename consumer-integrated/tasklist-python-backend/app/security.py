import os
from typing import Any, Dict
from fastapi import HTTPException, Request
from stytch import Client
from dotenv import load_dotenv

load_dotenv('.env.local')

_client: Client | None = None

def get_client() -> Client:
    global _client
    if _client is None:
        # Infer environment from domain and wire custom base URL
        stytch_domain = os.environ.get('STYTCH_DOMAIN')
        _client = Client(
            project_id=os.environ.get('STYTCH_PROJECT_ID'),
            secret=os.environ.get('STYTCH_PROJECT_SECRET'),
            environment='test',
            custom_base_url=stytch_domain,
        )
    return _client

async def authorize_session(request: Request) -> Dict[str, Any]:
    try:
        session_jwt = request.cookies.get('stytch_session_jwt')
        if not session_jwt:
            raise HTTPException(status_code=401, detail='Unauthorized')
        client = get_client()
        auth = client.sessions.authenticate_jwt(session_jwt=session_jwt)
        request.state.user = auth.session
        return {"user": auth.session}
    except Exception:
        raise HTTPException(status_code=401, detail='Unauthorized')

async def authorize_token(request: Request) -> Dict[str, Any]:
    try:
        auth_header = request.headers.get('authorization') or request.headers.get('Authorization')
        if not auth_header or not auth_header.lower().startswith('bearer '):
            www_auth = f"Bearer error=\"Unauthorized\", error_description=\"Unauthorized\", resource_metadata=\"{str(request.base_url).rstrip('/')}/.well-known/oauth-protected-resource\""
            raise HTTPException(status_code=401, detail='Unauthorized', headers={'WWW-Authenticate': www_auth})
        token = auth_header.split(' ', 1)[1]
        client = get_client()
        claims = client.idp.introspect_access_token_local(
            token
        )
        request.state.client = claims
        return {"client": claims}
    except HTTPException as e:
        raise e
    except Exception as e:
        www_auth = f"Bearer error=\"Unauthorized\", error_description=\"Unauthorized\", resource_metadata=\"{str(request.base_url).rstrip('/')}/.well-known/oauth-protected-resource\""
        raise HTTPException(status_code=401, detail='Unauthorized', headers={'WWW-Authenticate': www_auth})
