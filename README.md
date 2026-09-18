# IHDUA

Monorepo with three separate apps:

| Folder | Role | Default port |
|--------|------|--------------|
| `frontend/` | Next.js website | 3000 |
| `backend/` | API server | 4000 |
| `ai-chatbot/` | AI chatbot service | 5000 |

## Run locally

Each app has its own dependencies — install and start from that folder.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend

```bash
cd backend
pnpm install
pnpm dev
```

### AI chatbot

```bash
cd ai-chatbot
pnpm install
pnpm dev
```
