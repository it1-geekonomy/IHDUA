import os
import uvicorn
from app.config import settings

if __name__ == "__main__":
    port = int(os.getenv("PORT", getattr(settings, "PORT", 8001)))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
