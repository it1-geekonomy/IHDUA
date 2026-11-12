from pydantic import BaseModel, Field
from typing import Literal, Optional


class SyncEvent(BaseModel):
    table: str = Field(..., examples=["programs"])
    source_id: str = Field(..., examples=["9a3a4d67-9b47-4a83-9e33-7fe7f37e4ca7"])
    action: Literal["upsert", "delete"]
    content: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    category: Optional[str] = None
    slug: Optional[str] = None
    designation: Optional[str] = None


class PruneRequest(BaseModel):
    table: str = Field(..., examples=["programs"])
    keep_ids: list[str] = Field(default_factory=list)


class FullSyncRequest(BaseModel):
    force: bool = False


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    message: Optional[str] = Field(None, min_length=1, max_length=1000)
    question: Optional[str] = Field(
        None,
        description="Legacy alias for message",
        min_length=1,
        max_length=1000,
    )
    session_id: Optional[str] = Field(None, max_length=100)
    history: Optional[list[ChatTurn]] = Field(None, max_length=10)

    def resolved_message(self) -> str:
        return (self.message or self.question or "").strip()


class ChatSource(BaseModel):
    title: str
    url: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[ChatSource]
    session_id: str
    response_time_ms: int
