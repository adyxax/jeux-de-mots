PATH:=$(PATH):$(PWD)/node_modules/.bin
SHELL:=bash

.PHONY: check
check: ## make check  # Check syntax of entry points
	eslint main.js test.js test/
	(cd static; eslint index.js)

.PHONY: init
init: ## make init  # initialize project dependencies
	npm install

.PHONY: serve
serve: ## make serve  # run a self reloading nodejs web server
	NODE_ENV=development nodemon main.js

.PHONY: run
run: ## make run  # run a production nodejs web server
	NODE_ENV=production node main.js

.PHONY: test
test: check ## make test  # run tests
	@rm -f testjdm.db testsessions.db
	NODE_ENV=test node test.js
	NODE_ENV=test ava --watch test/
	@rm -f testjdm.db testsessions.db

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
