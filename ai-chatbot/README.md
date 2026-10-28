# IHDUA AI Chatbot — Python FastAPI RAG Service

Production-ready RAG service for IHDUA built on FastAPI, SQLAlchemy, PostgreSQL, and pgvector.

## Architecture

1. **Fast Intents**: Greetings, thank you, contact, donate — zero latency.
2. **Query Normalization & Multi-Query Expansion**: Rewrites queries and builds targeted queries for education, women SHGs, healthcare, donations, and locations.
3. **pgvector Cosine Search**: Efficient vector similarity search in Postgres (`document_chunks` table).
4. **Keyword & Title Boost**: Combines vector cosine similarity with keyword and category bonuses.
5. **Reranking**: Picks top-k relevant chunks based on similarity threshold.
6. **Grounded Generation**: OpenAI `gpt-4o-mini` generation strictly grounded in retrieved chunks with fallback recoveries.
7. **Sources & Links**: Formatted internal links with page validation.

## Getting Started

### 1. Environment Setup

Windows (PowerShell):

```powershell
cd ai-chatbot
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

macOS / Linux:

```bash
cd ai-chatbot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure `.env`

Ensure `.env` contains:
- `PORT=8001`
- `DB_HOST=localhost`
- `DB_PORT=5435`
- `DB_NAME=ihdua_db`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `OPENAI_API_KEY=your-openai-key`
- `OPENAI_MODEL=gpt-4o-mini`
- `OPENAI_EMBEDDING_MODEL=text-embedding-3-small`

### 3. Run Database Migration (pgvector)

```powershell
alembic upgrade head
```

This creates the `vector` extension, `document_chunks` table with HNSW index, and `rag_meta` table.

### 4. Index Knowledge Base & Site Pages

```powershell
python -c "from app.services.sync_service import full_sync; print(full_sync(force=True))"
```

This indexes all curated static documents and crawls public website pages from `http://localhost:3000`.

### 5. Start the Server

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Health check:
`GET http://localhost:8001/health`

Chat query:
`POST http://localhost:8001/chat` with body `{ "message": "Tell me about Adarsha Academy KRS" }`
