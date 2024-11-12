.PHONY: .build
.build:
	@npx vite \
		-c ./vite.config.production.ts \
		build

.PHONY: .build/sync
.build/sync:
	@$(MAKE) build

.PHONY: build/preview
build/preview:
	@npx vite \
		-c ./vite.config.development.ts \
		--mode preview \
		build

.PHONY: build/docs
build/docs:
	@npx vitepress \
		build

.PHONY: deploy/test
deploy/test:
	@rm -rf gui
	@mkdir gui && \
		mv dist/* gui && \
		mv gui dist/gui && \
		mv dist/gui/mockServiceWorker.js dist/ && \
		cp ../../_redirects dist/_redirects

.PHONY: deploy/e2e
deploy/e2e:
	@$(MAKE) build
	@$(MAKE) deploy/test

.PHONY: deploy/preview
deploy/preview:
	@$(MAKE) build/preview
	@$(MAKE) deploy/test

## To amend the specs see `make generate/oas-for-ts` in the main kuma repository
build/types: ## Regenerate the TS types from kumahq/kuma OpenAPI specs
	@npx openapi-typescript \
		../kuma/docs/generated/openapi.yaml \
		-o src/types/auto-generated.d.ts
