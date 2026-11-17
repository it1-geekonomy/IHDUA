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

## 5. Later deploys (automatic via GitHub Actions)

**Do not only `git pull` on the server.** Host code updates do not update running
containers. Always deploy with Actions or `bash deploy.sh` so images rebuild.

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Detects which folders changed (`frontend`, `backend`, `ai-chatbot`, `nginx`).
2. CI-checks **only** those folders (skipped jobs do not rebuild).
3. SSHs into the Droplet and runs `deploy.sh`, which rebuilds **only** the
   changed Docker images (same path filter), then restarts containers.
4. When backend rebuilds: runs migrations + `seed:admin` + `seed:funding`
   (both seeds are idempotent).

| Change under     | Rebuilds          |
|------------------|-------------------|
| `frontend/`      | frontend only     |
| `backend/`       | backend only      |
| `ai-chatbot/`    | ai-chatbot only   |
| `nginx/`         | nginx reload only |
| docs / other     | pull code, no image rebuild |

Manual run: GitHub → Actions → **Deploy to production** → **Run workflow**
(options: one service, rebuild all, force chatbot re-index).

On the server by hand:

```bash
cd /opt/ihdua
bash deploy.sh
REBUILD_ALL=true bash deploy.sh
REINDEX_CHATBOT=true bash deploy.sh
```

### One-time GitHub Actions setup

1. On the Droplet, create an SSH key for Actions:

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N "" -C "github-actions-deploy"
   cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/github_actions
   ```

2. GitHub → repo → Settings → Secrets and variables → Actions → add:

   | Secret           | Value |
   |------------------|--------|
   | `DEPLOY_HOST`    | `165.22.217.143` |
   | `DEPLOY_USER`    | `root` |
   | `DEPLOY_SSH_KEY` | Full private key (`-----BEGIN` … `-----END`) |

Optional: `DEPLOY_PORT` (default `22`).

Create a GitHub Environment named **production** (workflow uses it) if the
repo asks for one — no extra protection rules required.

The server fetches code with the job’s temporary GitHub token; no PAT needed
on the Droplet after the first clone.

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
