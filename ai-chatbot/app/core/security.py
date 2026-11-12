from __future__ import annotations

import secrets
from fastapi import Header, HTTPException, status
from app.config import settings


async def verify_internal_api_key(x_internal_api_key: str = Header(None)):
    """
    Guards internal-only endpoints. Validates X-Internal-Api-Key strictly.
    Rejects missing or invalid keys using constant-time comparison.
    """
    configured = (settings.internal_api_key or settings.sync_api_key or "").strip()
    if not configured:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal API key is not configured on the server",
        )

    if not x_internal_api_key or not secrets.compare_digest(x_internal_api_key.strip(), configured):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing internal API key",
        )
