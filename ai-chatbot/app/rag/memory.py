from __future__ import annotations

import time
import uuid
from collections import OrderedDict
from threading import Lock

from app.config import settings

_SESSIONS: OrderedDict[str, list[dict]] = OrderedDict()
_LOCK = Lock()
_MAX_SESSIONS = 500


def resolve_session_id(session_id: str | None) -> str:
    if session_id and session_id.strip():
        return session_id.strip()
    return str(uuid.uuid4())


def get_history(session_id: str) -> list[dict]:
    with _LOCK:
        return list(_SESSIONS.get(session_id, []))


def append_turn(session_id: str, role: str, content: str) -> None:
    with _LOCK:
        turns = _SESSIONS.setdefault(session_id, [])
        turns.append({"role": role, "content": content, "time": time.time()})
        max_turns = settings.conversation_memory_size * 2
        if len(turns) > max_turns:
            _SESSIONS[session_id] = turns[-max_turns:]
        _SESSIONS.move_to_end(session_id)
        while len(_SESSIONS) > _MAX_SESSIONS:
            _SESSIONS.popitem(last=False)
