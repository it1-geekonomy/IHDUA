from __future__ import annotations

from collections import OrderedDict
from threading import Lock

_CACHE: OrderedDict[str, dict] = OrderedDict()
_LOCK = Lock()
_MAX_SIZE = 256


def get(query: str) -> dict | None:
    q = query.strip().lower()
    with _LOCK:
        if q in _CACHE:
            _CACHE.move_to_end(q)
            return dict(_CACHE[q])
    return None


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
