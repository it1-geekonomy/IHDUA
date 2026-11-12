from __future__ import annotations

import time
from collections import defaultdict
from threading import Lock
from fastapi import HTTPException, Request, status


class SlidingWindowRateLimiter:
    def __init__(self, requests_per_minute: int = 30, window_seconds: float = 60.0):
        self.rpm = requests_per_minute
        self.window = window_seconds
        self._history: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def check(self, key: str) -> None:
        now = time.time()
        with self._lock:
            timestamps = [t for t in self._history[key] if now - t < self.window]
            if len(timestamps) >= self.rpm:
                retry_after = int(self.window - (now - timestamps[0]))
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please wait a moment before sending another message.",
                    headers={"Retry-After": str(max(1, retry_after))},
                )
            timestamps.append(now)
            self._history[key] = timestamps

            if len(self._history) > 1000:
                self._history = defaultdict(
                    list,
                    {k: v for k, v in self._history.items() if v and now - v[-1] < self.window},
                )


rate_limiter = SlidingWindowRateLimiter(requests_per_minute=30)


async def check_chat_rate_limit(request: Request):
    # Key by client host IP, or forwarded IP header if behind proxy
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    rate_limiter.check(client_ip)

