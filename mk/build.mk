.PHONY: build
build:
	npm run build

.PHONY: build/sync
build/sync:
	make build

build/types:
	@npx openapi-typescript \
		../kuma/docs/generated/openapi.yaml \
		-o src/types/auto-generated.d.ts
