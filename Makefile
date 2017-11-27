export PATH := $(PATH):./node_modules/.bin/

WEBPACK_BUILD_OPTS_PROD = -p
WEBPACK_BUILD_OPTS_DEV =

WEBPACK_BUILD_OPTS = $(WEBPACK_BUILD_OPTS_PROD)

build:
	./node_modules/.bin/webpack $(WEBPACK_BUILD_OPTS)

watch:
	./node_modules/.bin/webpack -w

serve:
	./node_modules/.bin/http-server -c-1 lib
