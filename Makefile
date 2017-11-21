export PATH := $(PATH):./node_modules/.bin/

WEBPACK_BUILD_OPTS = -p

build:
	./node_modules/.bin/webpack $(WEBPACK_BUILD_OPTS)

watch:
	./node_modules/.bin/webpack -w

serve:
	./node_modules/.bin/http-server -c-1 lib
