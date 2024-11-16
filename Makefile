.DEFAULT_GOAL := help
SOURCE_FILES := $(shell find . -name '*.cpp' -o -name '*.h') CMakeLists.txt

# kuzu/patched: ## Patch files
# 	@cd kuzu && \
# 	if git apply --check ../patches/*.patch > /dev/null 2>&1; then \
# 		echo "Applying patches..."; \
# 		git apply ../patches/*.patch; \
# 	fi
# 	touch kuzu/patched

.PHONY: check_environment
check_environment: ## check_environment
	@echo "emcc from: `which emcc`"
	@echo "emcmake from: `which emcmake`"
	@echo "emcmake from: `which npm`"

.PHONY: wasm_dev 
wasm_dev_target = build/dev/kuzu-wasm.wasm 
$(wasm_dev_target): $(SOURCE_FILES)
	./scripts/build_wasm.sh dev
wasm_dev: $(wasm_dev_target) ## Compile kuzu-wasm in development mode

.PHONY: wasm_relsize 
wasm_relsize_target := build/relsize/kuzu-wasm.wasm
$(wasm_relsize_target):  $(SOURCE_FILES)
	./scripts/build_wasm.sh relsize
wasm_relsize: $(wasm_relsize_target) ## Compile kuzu-wasm in development mode

.PHONY: wasm_relperf
wasm_relperf_target := build/relperf/kuzu-wasm.wasm 
$(wasm_relperf_target): $(SOURCE_FILES)
	./scripts/build_wasm.sh relperf
wasm_relperf: $(wasm_relperf_target) ## Compile kuzu-wasm in relperf mode

node_modules:
	yarn install
	rm -rf packages/*/node_modules


.PHONY: package
package: $(wasm_relperf_target) node_modules ## Package kuzu-wasm
	mkdir -p packages/kuzu-wasm/dist
	cp build/relperf/kuzu-wasm.* packages/kuzu-wasm/dist/
	cp README.md packages/kuzu-wasm/
	cp LICENSE.txt packages/kuzu-wasm/
	yarn workspace @kuzu/kuzu-wasm release

.PHONY: package_dev
package_dev: $(wasm_dev_target) node_modules ## Package kuzu-wasm
	mkdir -p packages/kuzu-wasm/dist
	cp build/dev/kuzu-wasm.* packages/kuzu-wasm/dist/
	yarn workspace @kuzu/kuzu-wasm debug

.PHONY: shell 
shell: package ## Build kuzu-shell application
	yarn workspace @kuzu/kuzu-shell build:release

.PHONY: shell_dev 
shell_dev:  ## Start kuzu-shell in development mode
	yarn workspace @kuzu/kuzu-shell start

dev: ## use kuzu_dev in plain html
	./scripts/run.sh

benchmark: package ## Run benchmark
	yarn workspace @kuzu/benchmarks main

.PHONY: clean
clean:  ## Clean the repository
	rm -rf build
	rm -rf kuzu/build
	rm -rf packages/*/node_modules
	rm -rf node_modules
	rm -rf packages/*/dist

.PHONY: help
help:  ## Display this help information
	@echo  "\033[1mAvailable commands:\033[0m"
	@grep -E '^[a-z.A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' | sort
