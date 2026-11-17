#!/usr/bin/env bash
# Production deploy for the IHDUA Droplet. Run as root:
#
#   bash /opt/ihdua/deploy.sh
#   REBUILD_ALL=true bash /opt/ihdua/deploy.sh
#
# Options (environment variables):
#   DEPLOY_BRANCH=main
#   BUILD_BACKEND / BUILD_FRONTEND / BUILD_AI_CHATBOT / BUILD_NGINX = true/false
#   REBUILD_ALL=true
#   REINDEX_CHATBOT=true
#   GIT_FETCH_URL=<url>
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/ihdua}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
REBUILD_ALL="${REBUILD_ALL:-false}"
REINDEX_CHATBOT="${REINDEX_CHATBOT:-false}"
BUILD_BACKEND="${BUILD_BACKEND:-}"
BUILD_FRONTEND="${BUILD_FRONTEND:-}"
BUILD_AI_CHATBOT="${BUILD_AI_CHATBOT:-}"
BUILD_NGINX="${BUILD_NGINX:-}"
GIT_FETCH_URL="${GIT_FETCH_URL:-origin}"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

compose() { docker compose --env-file .env.prod -f docker-compose.prod.yml "$@"; }
log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!!  %s\033[0m\n' "$*"; }

wait_for() {
  local label="$1" timeout="$2" waited=0
  shift 2
  until "$@" >/dev/null 2>&1; do
    if ((waited >= timeout)); then
      warn "$label was not ready after ${timeout}s"
      return 1
    fi
    sleep 3
    waited=$((waited + 3))
  done
  echo "$label is up (${waited}s)"
}

on_error() {
  warn "Deploy failed at line $1. Containers still run the last successful build unless they were already restarted."
  compose ps || true
  compose logs --tail 40 backend frontend ai-chatbot || true
}

main() {
  trap 'on_error $LINENO' ERR
  cd "$APP_DIR"
  [[ -f .env.prod ]] || { echo ".env.prod not found in $APP_DIR"; exit 1; }

  exec 9>/tmp/ihdua-deploy.lock
  flock -w 1800 9

  log "Updating code to origin/$DEPLOY_BRANCH"
  local prev head changed
  prev="$(git rev-parse HEAD)"
  GIT_TERMINAL_PROMPT=0 git fetch --quiet "$GIT_FETCH_URL" \
    "+refs/heads/$DEPLOY_BRANCH:refs/remotes/origin/$DEPLOY_BRANCH"
  git checkout --quiet --force -B "$DEPLOY_BRANCH" "origin/$DEPLOY_BRANCH"
  head="$(git rev-parse HEAD)"
  git log -1 --format='%h %s (%an)'

  changed=""
  [[ "$prev" != "$head" ]] && changed="$(git diff --name-only "$prev" "$head")"
  has_change() { grep -qE "$1" <<<"$changed"; }

  local rebuild_ai=false
  local rebuild_backend=false
  local rebuild_frontend=false
  local reload_nginx=false

  if [[ "$REBUILD_ALL" == "true" ]]; then
    rebuild_ai=true
    rebuild_backend=true
    rebuild_frontend=true
  elif [[ -n "$BUILD_BACKEND" || -n "$BUILD_FRONTEND" || -n "$BUILD_AI_CHATBOT" || -n "$BUILD_NGINX" ]]; then
    [[ "$BUILD_AI_CHATBOT" == "true" ]] && rebuild_ai=true
    [[ "$BUILD_BACKEND" == "true" ]] && rebuild_backend=true
    [[ "$BUILD_FRONTEND" == "true" ]] && rebuild_frontend=true
    [[ "$BUILD_NGINX" == "true" ]] && reload_nginx=true
  else
    if has_change '^ai-chatbot/'; then rebuild_ai=true; fi
    if has_change '^backend/'; then rebuild_backend=true; fi
    if has_change '^frontend/'; then rebuild_frontend=true; fi
    if has_change '^nginx/'; then reload_nginx=true; fi
  fi

  if has_change '^nginx/'; then reload_nginx=true; fi

  # Host git can be ahead of running images (e.g. git pull without rebuild).
  # If repo package.json has seed:funding:prod but the live container does not, force rebuild.
  if [[ "$rebuild_backend" != "true" ]] && grep -q 'seed:funding:prod' backend/package.json 2>/dev/null; then
    if ! compose exec -T backend node -e "process.exit(require('./package.json').scripts['seed:funding:prod']?0:1)" >/dev/null 2>&1; then
      warn "Backend image is stale (missing seed:funding:prod). Forcing backend rebuild."
      rebuild_backend=true
    fi
  fi

  local services=()
  if [[ "$rebuild_ai" == "true" ]]; then services+=(ai-chatbot); fi
  if [[ "$rebuild_backend" == "true" ]]; then services+=(backend); fi
  if [[ "$rebuild_frontend" == "true" ]]; then services+=(frontend); fi

  log "Services to build: ${services[*]:-none}"

  if ((${#services[@]} == 0)); then
    log "No service code changed; skipping image builds"
  else
    for service in "${services[@]}"; do
      log "Building $service"
      compose build "$service"
    done
  fi

  log "Starting containers"
  compose up -d --remove-orphans

  # Recreate nginx after any app rebuild so upstream DNS is refreshed (avoids 502).
  if [[ "$reload_nginx" == "true" ]] || ((${#services[@]} > 0)); then
    log "Recreating nginx (config and/or upstream IPs)"
    compose up -d --force-recreate nginx
  else
    compose exec -T nginx nginx -s reload 2>/dev/null || true
  fi

  log "Waiting for services"
  if [[ "$rebuild_backend" == "true" ]]; then
    wait_for "Backend API" 240 curl -fsS http://localhost/api/health
  fi
  if [[ "$rebuild_frontend" == "true" ]]; then
    wait_for "Website" 180 curl -fsS -o /dev/null http://localhost/
  fi
  if [[ "$rebuild_ai" == "true" ]]; then
    wait_for "AI chatbot" 120 compose exec -T ai-chatbot \
      python -c "import urllib.request; urllib.request.urlopen('http://localhost:8001/health', timeout=5)"
  fi
  wait_for "Website root" 30 curl -fsS -o /dev/null http://localhost/

  if [[ "$rebuild_backend" == "true" ]]; then
    log "Database migrations"
    compose exec -T backend pnpm run migration:run:prod

    log "Admin seed (skipped if the admin already exists)"
    compose exec -T backend pnpm run seed:admin:prod | sed '/password:/d'

    # Idempotent: creates/updates the CMS funding projects from the seed deck
    log "Funding projects seed"
    if ! compose exec -T backend pnpm run seed:funding:prod; then
      warn "Funding seed failed (script missing in image?). Rebuild backend and re-run."
    fi
  else
    log "Skipping database migrations & seeds (backend code unchanged)"
  fi

  if [[ "$REINDEX_CHATBOT" == "true" || "$rebuild_ai" == "true" ]]; then
    log "Chatbot knowledge sync"
    local force_sync=False
    [[ "$REINDEX_CHATBOT" == "true" ]] && force_sync=True
    if ! compose exec -T ai-chatbot python -c "
from app.services.sync_service import full_sync
r = full_sync(force=$force_sync)
print(r)
" 2>&1; then
      warn "Chatbot sync failed. The site is live; re-run with REINDEX_CHATBOT=true."
    fi
  else
    log "Skipping chatbot knowledge sync (set REINDEX_CHATBOT=true to force)"
  fi

  log "Cleaning up stopped containers / unused images"
  docker container prune -f
  docker image prune -f
  docker network prune -f
  docker builder prune -f --reserved-space 4gb
  docker system df
  df -h /

  log "Deployed $(git log -1 --format='%h %s')"
  compose ps
}

main "$@"; exit
