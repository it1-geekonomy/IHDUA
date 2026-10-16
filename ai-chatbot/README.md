# IHDUA AI Chatbot

Standalone AI chatbot service for IHDUA.

## Getting started

```bash
pnpm install
pnpm dev
```

Runs at [http://localhost:5000](http://localhost:5000).

## Endpoints

- `GET /health` — health check
- `POST /chat` — `{ "message": "..." }` → chatbot reply
