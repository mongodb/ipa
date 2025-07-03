# A Self-Documenting Makefile: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html

.PHONY: setup
setup: ## Install dev dependencies
	go install github.com/client9/misspell/cmd/misspell@latest

.PHONY: misspell
misspell: ## Run misspell checks
	misspell -i cancelled -locale US -source text -error ipa

.PHONY: fix-misspell
fix-misspell: ## Fix misspells
	misspell -i cancelled -locale US -source text -w ipa

.PHONY: check
check: misspell ## Run all checks

.PHONY: list
list: ## List all make targets
	@${MAKE} -pRrn : -f $(MAKEFILE_LIST) 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | sort

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
