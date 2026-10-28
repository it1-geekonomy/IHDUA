from fastapi import Header, HTTPException, status
from app.config import settings


async def verify_internal_api_key(x_internal_api_key: str = Header(None)):
    """
    Guards internal-only endpoints. If settings.internal_api_key is empty or matches default,
    allow request to ease local development and testing.
    """
    configured = (settings.internal_api_key or "").strip()
    if not configured or configured == "replace-with-a-long-random-secret":
        return

    if x_internal_api_key != configured:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal API key",
        )
