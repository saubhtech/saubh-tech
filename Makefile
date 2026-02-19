# ─── Saubh.Tech Platform — Makefile ───
# Usage: make <target>

.PHONY: help install dev build start clean lint typecheck deploy validate-i18n translate
.PHONY: dev-up dev-down dev-logs dev-ps migrate migrate-prod seed studio test-e2e

# ─── Variables ───────────────────────────────────────────────────────────────

COMPOSE_FILE := infra/compose/dev/docker-compose.dev.yml
ENV_FILE     := infra/compose/dev/.env.dev
COMPOSE      := docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE)
API          := pnpm --filter @saubhtech/api

# ─── Default ─────────────────────────────────────────────────────────────────

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Docker Dev Infrastructure ───────────────────────────────────────────────

dev-up: ## Start all dev services (postgres, redis, minio, keycloak)
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "❌ Missing $(ENV_FILE)"; \
		echo "   Run: cp infra/compose/dev/.env.dev.example $(ENV_FILE)"; \
		echo "   Then edit $(ENV_FILE) with your local secrets."; \
		exit 1; \
	fi
	$(COMPOSE) up -d
	@echo ""
	@echo "✅ Dev stack started. Check health: make dev-ps"
	@echo "   Postgres:  localhost:5432"
	@echo "   PG Test:   localhost:5433"
	@echo "   Redis:     localhost:6379"
	@echo "   MinIO API: localhost:9000  Console: localhost:9001"
	@echo "   Keycloak:  localhost:8080"

dev-down: ## Stop all dev services
	$(COMPOSE) down
	@echo "✅ Dev stack stopped."

dev-logs: ## Tail logs from all dev services
	$(COMPOSE) logs -f

dev-ps: ## Show status of dev services
	$(COMPOSE) ps

# ─── Setup ───────────────────────────────────────────────────────────────────

install: ## Install all dependencies
	pnpm install

# ─── Development ─────────────────────────────────────────────────────────────

dev: ## Start web app in dev mode (Turbopack)
	pnpm --filter @saubhtech/web dev

build: ## Build web app for production
	pnpm --filter @saubhtech/web build

start: ## Start production server
	pnpm --filter @saubhtech/web start

# ─── Database ────────────────────────────────────────────────────────────────

migrate: ## Run Prisma migrations (dev — creates + applies)
	$(API) prisma:migrate

migrate-prod: ## Run Prisma migrations (deploy — applies only)
	$(API) prisma:migrate:prod

seed: ## Seed the database with initial data
	$(API) prisma:seed

studio: ## Open Prisma Studio (database GUI)
	$(API) prisma:studio

# ─── Quality ─────────────────────────────────────────────────────────────────

lint: ## Lint all packages
	pnpm -r lint

typecheck: ## Type-check shared package
	pnpm --filter @saubhtech/shared typecheck

# ─── Testing ─────────────────────────────────────────────────────────────────

test-e2e: ## Run end-to-end tests (stub — wire to Playwright/Cypress)
	@echo "⚠️  test-e2e: not yet wired. Add your test runner command here."

# ─── i18n ────────────────────────────────────────────────────────────────────

validate-i18n: ## Validate all translation files against en.ts
	pnpm exec ts-node scripts/validate-i18n.ts

translate: ## Run auto-translation engine (requires server)
	python3 scripts/auto-translate.py --status

translate-run: ## Run auto-translation for all pending languages
	python3 scripts/auto-translate.py

translate-dry: ## Preview translation changes without writing
	python3 scripts/auto-translate.py --dry-run

# ─── Cleanup ─────────────────────────────────────────────────────────────────

clean: ## Remove build artifacts and node_modules
	pnpm -r exec rm -rf .next node_modules dist
	rm -rf node_modules

# ─── Deploy ──────────────────────────────────────────────────────────────────

deploy: ## Deploy to production server (SSH required)
	ssh -p 5104 admin1@103.67.236.186 \
		'cd /data/projects/saubh-gig && git pull origin main && pnpm install && pnpm build && pm2 restart saubh-gig'
