from __future__ import annotations

import logging
from threading import Thread

log = logging.getLogger(__name__)


def _warmup_worker() -> None:
    try:
        from app.services import sync_service
        log.info("Running background warmup and fingerprint check...")
        sync_service.full_sync(force=False)
    except Exception as e:
        log.warning("Warmup failed (DB may not be migrated yet): %s", e)


def start() -> None:
    t = Thread(target=_warmup_worker, daemon=True)
    t.start()
