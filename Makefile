VERSION := $(shell git describe --tags --abbrev=0)

all: release

release:
		@for dir in src/schemas/*; do \
			if [ -d "$$dir" ]; then \
				subdir=$$(basename $$dir); \
				mkdir -p docs/$$subdir/v${VERSION}; \
				cp $$dir/* docs/$$subdir/v${VERSION}/; \
			fi; \
		done