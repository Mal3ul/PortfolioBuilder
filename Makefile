# ═══════════════════════════════════════════════════════════════════
#  PortfolioBuilder – Makefile
# ═══════════════════════════════════════════════════════════════════

COMPOSE_DEV   = docker compose -f docker-dev.yaml
COMPOSE_PROD  = docker compose -f docker-prod.yaml
COMPOSE_UTILS = docker compose -f docker-utils.yaml

.DEFAULT_GOAL := help

# ── Development Environment ──────────────────────────────────────

.PHONY: dev
dev: ## Start the full development stack (proxy + app + database) → http://127.0.0.1:18080
	$(COMPOSE_DEV) up --build

.PHONY: dev-detach
dev-detach: ## Start the development stack in the background
	$(COMPOSE_DEV) up --build -d

.PHONY: dev-down
dev-down: ## Stop and remove the development stack
	$(COMPOSE_DEV) down

.PHONY: dev-down-volumes
dev-down-volumes: ## Stop the development stack and remove volumes (database data)
	$(COMPOSE_DEV) down -v

.PHONY: dev-logs
dev-logs: ## Tail logs from all development services
	$(COMPOSE_DEV) logs -f

.PHONY: dev-ps
dev-ps: ## Show running development containers
	$(COMPOSE_DEV) ps

.PHONY: dev-restart
dev-restart: ## Restart all development services
	$(COMPOSE_DEV) restart

.PHONY: dev-rebuild
dev-rebuild: ## Rebuild images and restart the development stack
	$(COMPOSE_DEV) up --build --force-recreate

.PHONY: dev-psql
dev-psql: ## Open a psql shell on the development database
	$(COMPOSE_DEV) exec pb-database psql -U pb_user -d portfolio_builder

.PHONY: dev-sh
dev-sh: ## Open a shell in the development app container
	$(COMPOSE_DEV) exec pb-app sh

# ── Production Environment ───────────────────────────────────────

.PHONY: prod
prod: ## Start the production stack in the background (tunnel + proxy + app + database)
	$(COMPOSE_PROD) up --build -d

.PHONY: prod-down
prod-down: ## Stop and remove the production stack
	$(COMPOSE_PROD) down

.PHONY: prod-down-volumes
prod-down-volumes: ## Stop the production stack and remove volumes (database data)
	$(COMPOSE_PROD) down -v

.PHONY: prod-logs
prod-logs: ## Tail logs from all production services
	$(COMPOSE_PROD) logs -f

.PHONY: prod-ps
prod-ps: ## Show running production containers
	$(COMPOSE_PROD) ps

.PHONY: prod-restart
prod-restart: ## Restart all production services
	$(COMPOSE_PROD) restart

.PHONY: prod-rebuild
prod-rebuild: ## Rebuild images and restart the production stack
	$(COMPOSE_PROD) up --build --force-recreate -d

.PHONY: prod-build
prod-build: ## Build production images without starting containers
	$(COMPOSE_PROD) build

.PHONY: prod-psql
prod-psql: ## Open a psql shell on the production database
	$(COMPOSE_PROD) exec pb-database psql -U pb_user -d portfolio_builder

# ── Testing ──────────────────────────────────────────────────────

.PHONY: test
test: ## Run the full test suite (unit + integration) in Docker
	$(COMPOSE_UTILS) run --rm test

.PHONY: test-unit
test-unit: ## Run unit tests only (no database)
	$(COMPOSE_UTILS) run --rm test-unit

.PHONY: test-integration
test-integration: ## Run integration tests against an ephemeral database
	$(COMPOSE_UTILS) run --rm test-integration

.PHONY: coverage
coverage: ## Run tests with coverage (HTML report in reports/coverage/)
	$(COMPOSE_UTILS) run --rm coverage

.PHONY: utils-down
utils-down: ## Stop and clean up test containers and ephemeral database
	$(COMPOSE_UTILS) down -v

# ── Deployment ───────────────────────────────────────────────────

.PHONY: deploy
deploy: ## (VPS) Deploy: git pull + build + up + prune
	./deploy.sh

# ── Help ─────────────────────────────────────────────────────────

.PHONY: help
help: ## Show this help
	@echo ''
	@echo '  PortfolioBuilder – available commands'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ''
