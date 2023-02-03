PATH:=$(PATH):$(PWD)/node_modules/.bin

SHELL:=bash
.SHELLFLAGS := -eu -o pipefail -c
.ONESHELL:
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

.PHONY: check
check: ## make check  # Check syntax of entry points
	eslint main.js fixtures.js tests/
	(cd static; eslint index.js)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: init
init: ## make init   # initialize project dependencies
	npm install

.PHONY: serve
serve: ## make serve  # run a self reloading development web server
	rm -f jdm.db sessions.db
	NODE_ENV=development node fixtures.js
	NODE_ENV=development nodemon main.js

.PHONY: run
run: ## make run    # run a production web server
	NODE_ENV=production node main.js

.PHONY: test
test: check ## make test   # run tests
	@rm -f testjdm.db testsessions.db
	NODE_ENV=test node fixtures.js
	NODE_ENV=test vitest --config .vite.config.ts
	@rm -f testjdm.db testsessions.db

.DEFAULT_GOAL := help
