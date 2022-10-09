SHELL:=bash

.PHONY: check
check: ## make check  # Check syntax of eventline jobs
	eslint index.js

.PHONY: init
init: ## make init  # initialize project dependencies
	npm install eslint

.PHONY: serve
serve: ## make serve  # run a python web server
	python -m http.server 8000

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
