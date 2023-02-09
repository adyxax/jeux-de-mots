PATH:=$(PATH):$(PWD)/node_modules/.bin

SHELL:=bash
.SHELLFLAGS := -eu -o pipefail -c
.ONESHELL:
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
.DEFAULT_GOAL := help

.PHONY: check
check: node_modules ## make check  # Check syntax with eslint
	eslint main.js fixtures.js tests/
	(cd static; eslint index.js)

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: serve
serve: node_modules ## make serve  # run a self reloading development web server
	rm -f jdm.db sessions.db
	NODE_ENV=development node fixtures.js
	NODE_ENV=development nodemon main.js

.PHONY: run
run: node_modules  ## make run    # run a production web server
	NODE_ENV=production node main.js

.PHONY: test
test: check ## make test   # run tests
	@rm -f testjdm.db testsessions.db
	NODE_ENV=test node fixtures.js
	NODE_ENV=test vitest --config .vite.config.ts
	@rm -f testjdm.db testsessions.db

node_modules:  package-lock.json  package.json
	npm install
	@touch node_modules
