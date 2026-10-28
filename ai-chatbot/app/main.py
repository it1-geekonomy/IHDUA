from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.rag import warmup
from app.routers import chat, health, sync


@asynccontextmanager
async def lifespan(_: FastAPI):
    warmup.start()
    yield


app = FastAPI(
    lifespan=lifespan,
    title="IHDUA Chatbot AI Service (RAG)",
    description=(
        "Quality RAG chatbot for IHDUA: intents, query rewrite, multi-query retrieval, "
        "pgvector cosine similarity, rerank, grounded generation."
    ),
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(sync.router)
app.include_router(chat.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
