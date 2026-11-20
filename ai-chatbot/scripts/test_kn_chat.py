import json
import os
import urllib.request
from pathlib import Path


def load_key() -> str:
    for line in Path(".env").read_text(encoding="utf-8").splitlines():
        if line.startswith("AI_SERVICE_INTERNAL_KEY="):
            return line.split("=", 1)[1].strip().strip("\"'")
        if line.startswith("INTERNAL_API_KEY="):
            return line.split("=", 1)[1].strip().strip("\"'")
    return os.getenv("AI_SERVICE_INTERNAL_KEY", "")


def ask(message: str) -> str:
    key = load_key()
    body = json.dumps(
        {"message": message, "language": "kn"},
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:8001/chat",
        data=body,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "X-Internal-Api-Key": key,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as res:
        data = json.loads(res.read().decode("utf-8"))
    return data.get("answer") or ""


def main() -> None:
    q = "ಮಹಿಳೆಯರ ಸಬಲೀಕರಣಕ್ಕಾಗಿ ಯಾವ ಯೋಜನೆಗಳಿವೆ?"
    ans = ask(q)
    print("FALLBACK", "ಊಹಿಸಲು" in ans)
    print(ans[:600])


if __name__ == "__main__":
    main()
