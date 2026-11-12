from __future__ import annotations

import logging
from threading import Event, Thread

from app.config import settings

log = logging.getLogger(__name__)

_stop = Event()


def _sync_once() -> None:
    try:
        from app.services import sync_service
        result = sync_service.full_sync(force=False)
        log.info("Knowledge sync: %s", result.get("status"))
    except Exception as e:
        log.warning("Knowledge sync failed (DB may not be migrated yet): %s", e)


def _worker() -> None:
    _sync_once()
    interval = max(0, settings.auto_sync_minutes) * 60
    while interval and not _stop.wait(interval):
        _sync_once()


def start() -> None:
    _stop.clear()
    Thread(target=_worker, daemon=True).start()


def stop() -> None:
    _stop.set()
