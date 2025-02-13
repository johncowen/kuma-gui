NODE_VERSION?=v$(shell cat .nvmrc)
NPM_VERSION?=$(shell cat $(NPM_WORKSPACE_ROOT)/package.json | jq -r '.engines.npm')

.PHONY: check/node
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		echo "Make sure node-$(NODE_VERSION) is installed (see .nvmrc)"; \
		exit 1; \
	)
	@npm ls -g "npm@$(NPM_VERSION)" | grep "empty" > /dev/null && ( \
		echo "Make sure npm@$(NPM_VERSION) is installed. Try npm install -g npm@$(NPM_VERSION)"; \
		exit 1; \
	) || (exit 0)

.PHONY: .lint
.lint: lint/js lint/ts lint/css lint/lock lint/gherkin

.PHONY: .lint/script
.lint/script: lint/js lint/ts  ## Dev: Run lint checks on both JS/TS

.PHONY: lint/js
lint/js:
	@npx eslint \
		$(if $(CI),,--fix) \
		.

.PHONY: lint/ts
lint/ts:
	@npx vue-tsc \
		--noEmit

.PHONY: lint/css
lint/css:
	@npx stylelint \
		$(if $(CI),,--fix) --allow-empty-input \
		./src/**/*.{css,scss,vue}

.PHONY: lint/gherkin
lint/gherkin:
	@find ./features \
		-name '*.feature' \
		-exec npx gherkin-utils format '{}' +

.PHONY: lint/lock
lint/lock:
	@cd $(NPM_WORKSPACE_ROOT) ; \
		npx lockfile-lint \
			--path package-lock.json \
			--allowed-hosts npm \
			--validate-https \
		&& npx license-checker-rseidelsohn \
				--summary \
				--excludePrivatePackages \
				--excludePackagesStartingWith '$(shell cat package.json | jq -rj '"@" + .["license-checker"].allowOrgs.[] + "/;"' | rev | cut -c2- | rev)' \
				--excludePackages 'new-date@1.0.3;tosource@2.0.0-alpha.3;' \
				--onlyAllow '\
					Python-2.0;\
					Apache*;\
					Apache-2.0;\
					BlueOak-1.0.0;\
					BSD;\
					BSD-3-Clause;\
					CC-BY-3.0;\
					CC-BY-4.0;\
					CC0-1.0;\
					ISC;\
					MIT;\
					MPL-2.0;\
					Unlicense;\
					WTFPL;\
			'
