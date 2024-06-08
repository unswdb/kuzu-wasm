.DEFAULT_GOAL := help

.PHONY: check_environment
check_environment:
	@echo "emcc from: `which emcc`"
	@echo "emcmake from: `which emcmake`"

.PHONY: wasm_dev 
wasm_dev: check_environment ## Compile kuzu-wasm in development mode
	./scripts/build_wasm.sh dev

.PHONY: wasm_relsize
wasm_relsize: check_environment  ## Compile kuzu-wasm in relsize mode
	./scripts/build_wasm.sh relsize

.PHONY: wasm_relperf
wasm_relperf: check_environment ## Compile kuzu-wasm in relperf mode
	./scripts/build_wasm.sh relperf

# wasm_package = $(packages/kuzu-wasm/src/kuzu-wasm.wasm, \
# 				packages/kuzu-wasm/src/kuzu-wasm.js, \
# 				packages/kuzu-wasm/src/kuzu-wasm.worker.mjs)
.PHONY: wasm_package
wasm_package: wasm_relperf ## Package kuzu-wasm
	mkdir -p packages/kuzu-wasm/src
	cp build/relperf/kuzu-wasm.* packages/kuzu-wasm/src/

.PHONY: shell 
shell: wasm_package ## Build kuzu-shell application
	yarn
	yarn install
	yarn workspace @kuzu/kuzu-shell build:release

.PHONY: shell-dev 
shell-dev: ## Start kuzu-shell in development mode
	yarn workspace @kuzu/kuzu-shell start

dev: ## Start kuzu-shell in development mode
	./scripts/run.sh

.PHONY: clean
clean:  ## Clean the repository
	rm -rf build
	rm -rf kuzu/build
	rm -rf packages/*/node_modules
	rm -rf packages/*/build

.PHONY: help
help:  ## Display this help information
	@echo  "\033[1mAvailable commands:\033[0m"
	@grep -E '^[a-z.A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' | sort
