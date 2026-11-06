# IHDUA AI Chatbot — Python FastAPI RAG Service

Production-ready Retrieval-Augmented Generation (RAG) microservice for IHDUA built on FastAPI, SQLAlchemy, PostgreSQL, and pgvector.

---

## ⚡ Quick Start: How to Run the Chatbot

If your environment and database are already set up, run the service with:

### Windows (PowerShell)
```powershell
cd ai-chatbot
.\venv\Scripts\Activate.ps1
python run.py
```
> Alternatively: `uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload`

### macOS / Linux
```bash
cd ai-chatbot
source venv/bin/activate
python3 run.py
```

### Production (PM2)
```bash
pm2 start ecosystem.config.cjs
```

---

## 🧪 Testing the Chatbot

Once the server is running on `http://localhost:8001`:

1. **Interactive Swagger UI (Recommended for manual testing)**:  
   Open [http://localhost:8001/docs](http://localhost:8001/docs) in your browser to inspect endpoints and try the `/chat` endpoint interactively.

2. **Health Check**:  
   `GET http://localhost:8001/health`

3. **Direct Chat API Call**:  
   `POST http://localhost:8001/chat`  
   Header: `Content-Type: application/json`  
   Body:
   ```json
   {
     "message": "Tell me about Adarsha Academy KRS"
   }
   ```

4. **Full-Stack / Visual Chatbot Widget**:  
   To use the chatbot in the website interface:
   - Start this AI chatbot service on port `8001`.
   - In a separate terminal, start the Next.js frontend:
     ```powershell
     cd ../frontend
     pnpm dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) and click the floating chat icon in the bottom corner.

---

## 🏗️ Architecture

1. **Fast Intents**: Greetings, thank you, contact, donate — zero latency responses.
2. **Query Normalization & Multi-Query Expansion**: Rewrites queries and builds targeted queries for education, women SHGs, healthcare, donations, and locations.
3. **pgvector Cosine Search**: Efficient vector similarity search in Postgres (`document_chunks` table with HNSW index).
4. **Keyword & Title Boost**: Combines vector cosine similarity with keyword and category bonuses.
5. **Reranking**: Filters and picks top-k relevant chunks based on similarity threshold.
6. **Grounded Generation**: OpenAI `gpt-4o-mini` generation strictly grounded in retrieved chunks with fallback recoveries.
7. **Sources & Links**: Formatted internal links with page validation.

---

## 🛠️ First-Time Setup & Installation

### Prerequisites
- Python 3.10+
- PostgreSQL with `pgvector` enabled (run via Docker from the `backend/` directory or port 5435)
- OpenAI API key

---

### Step 1: Create Virtual Environment & Install Dependencies

**Windows (PowerShell):**
```powershell
cd ai-chatbot
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**macOS / Linux:**
```bash
cd ai-chatbot
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

### Step 2: Configure Environment Variables

Create `.env` in `ai-chatbot/` (refer to `.env.example`):
```ini
PORT=8001
DB_HOST=localhost
DB_PORT=5435
DB_NAME=ihdua_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
INTERNAL_API_KEY=replace-with-a-long-random-secret
SITE_CRAWL_URL=http://localhost:3000
SITE_BASE_URL=https://ihdua.org
```

---

### Step 3: Run Database Migrations (pgvector)

Ensure your PostgreSQL container is running, then run:

```powershell
alembic upgrade head
```

This creates the `vector` extension, `document_chunks` table with HNSW index, and `rag_meta` table.

---

### Step 4: Index Knowledge Base & Site Pages

To ingest the curated markdown documents and crawl site pages into pgvector:

```powershell
python -c "from app.services.sync_service import full_sync; print(full_sync(force=True))"
```

---

### Step 5: Start the Server

```powershell
python run.py
```
or:
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```
