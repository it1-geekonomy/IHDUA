from __future__ import annotations

from collections import OrderedDict
from threading import Lock

_CACHE: OrderedDict[str, dict] = OrderedDict()
_LOCK = Lock()
_MAX_SIZE = 256


def get(query: str, current_version: int | None = None) -> dict | None:
    q = query.strip().lower()
    with _LOCK:
        entry = _CACHE.get(q)
        if entry is not None:
            if current_version is not None and entry.get("version") != current_version:
                _CACHE.pop(q, None)
                return None
            _CACHE.move_to_end(q)
            return dict(entry)
    return None


def clear() -> None:
    with _LOCK:
        _CACHE.clear()


def put(query: str, answer: str, sources: list[dict], version: int) -> None:
    q = query.strip().lower()
    with _LOCK:
        _CACHE[q] = {
            "answer": answer,
            "sources": sources,
            "version": version,
        }
        while len(_CACHE) > _MAX_SIZE:
            _CACHE.popitem(last=False)
