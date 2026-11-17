# Deploying IHDUA to a DigitalOcean Droplet (IP-based)

Everything runs on one Droplet with Docker Compose (`docker-compose.prod.yml`)
and settings in `.env.prod` (copied from `.env.example`).

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml <command>
```

| Service     | What it is                       | Reachable from  |
|-------------|----------------------------------|-----------------|
| nginx       | Reverse proxy on port 80         | Internet        |
| frontend    | Next.js website + CMS            | nginx only      |
| backend     | NestJS API (`/api`, `/api/docs`) | nginx only      |
| ai-chatbot  | Python chatbot (FastAPI)         | backend/frontend|
| postgres    | Postgres 16 + pgvector           | containers only|

Nginx routes:

- `/api/website-images`, `/api/download`, `/api/chat` → Next.js  
- `/api/*` → NestJS  
- everything else → Next.js  

This setup is **HTTP + Droplet IP** (no domain / TLS yet). Port 443 and certbot
folders are reserved for when you add a domain later.

## 1. Create the Droplet

1. DigitalOcean → Create → Droplets  
2. Region: **Bangalore (BLR1)** (or nearest). Image: **Ubuntu 24.04 LTS**  
3. Size: **Basic, 4 GB RAM / 2 vCPU** (2 GB works but builds are slow)  
4. Authentication: **SSH key**  
5. Note the public IP → `YOUR_IP`

## 2. Prepare the server

```bash
ssh root@YOUR_IP
```

On the server:

```bash
git clone <YOUR_GITHUB_REPO_URL> /opt/ihdua
cd /opt/ihdua
git checkout main   # or your deploy branch
bash setup-droplet.sh
```

For a private repo, use a GitHub Personal Access Token as the password.

## 3. Configure environment

```bash
cd /opt/ihdua
cp .env.example .env.prod
nano .env.prod
```

- Set `PUBLIC_URL=http://YOUR_IP` (no trailing slash).  
- Generate secrets with `openssl rand -hex 32` (`DB_PASSWORD`, `JWT_SECRET`, `AI_SERVICE_INTERNAL_KEY`).  
- Copy R2, Razorpay, Resend, OpenAI keys from your local `backend/.env` / `ai-chatbot/.env`.  

`.env.prod` stays only on the server (gitignored).

## 4. First start

```bash
cd /opt/ihdua
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

First build takes several minutes. The backend runs TypeORM migrations on start.

Create the CMS admin:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend pnpm run seed:admin:prod
```

Optional impact seed (categories / initiatives):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec backend pnpm run seed:impact:prod
```

Open:

- Website: `http://YOUR_IP`  
- API health: `http://YOUR_IP/api/health`  
- Swagger: `http://YOUR_IP/api/docs`  
- Admin: `http://YOUR_IP/admin`

### Chatbot knowledge

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec ai-chatbot \
  python -c "from app.services.sync_service import full_sync; print(full_sync(force=True))"
```

## 5. Later deploys

```bash
cd /opt/ihdua
bash deploy.sh
# or force everything:
REBUILD_ALL=true bash deploy.sh
# force chatbot re-index:
REINDEX_CHATBOT=true bash deploy.sh
```

`deploy.sh` rebuilds only changed services, reloads nginx, runs migrations when
the backend changed, and prunes old images.

## Changing PUBLIC_URL / IP

`NEXT_PUBLIC_API_URL` is baked into the frontend at **build** time. After
changing `PUBLIC_URL` in `.env.prod`:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml build frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d frontend nginx
```

## When you get a domain later

1. Point DNS A record to `YOUR_IP`.  
2. Update `PUBLIC_URL=https://yourdomain` and rebuild frontend.  
3. Issue certs with certbot (profile in compose) and switch `nginx/default.conf`
   to HTTPS (same pattern as HCG Foundation).

## Useful commands

```bash
# Logs
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f frontend
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f ai-chatbot
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f nginx

# Restart one service
docker compose --env-file .env.prod -f docker-compose.prod.yml restart backend
```
