PATH:=$(PATH):$(PWD)/node_modules/.bin
SHELL:=bash

.PHONY: check
check: ## make check  # Check syntax of eventline jobs
	eslint main.js
	(cd static; eslint index.js)

.PHONY: init
init: ## make init  # initialize project dependencies
	npm install

.PHONY: serve
serve: ## make serve  # run a self reloading nodejs web server
	nodemon main.js

.PHONY: run
run: ## make run  # run a production nodejs web server
	node main.js

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
