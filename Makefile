VERSION := 1.0
MAJOR_VERSION := $(shell echo $(VERSION) | cut -d. -f1)
REGISTRY_URL := https://schema.reportportal.io
PUBLISH_DIR := docs
TARGET := manifest

all: bundle

bundle:
	@for file in src/schemas/${TARGET}.json; do \
		base_filename=$$(basename $$file .json); \
		echo "Running bundle for $$file"; \
		npm run bundle -- $$file ${PUBLISH_DIR}/$$base_filename.schema.json; \
		cp $$file ${PUBLISH_DIR}/$$base_filename.v${MAJOR_VERSION}.schema.json; \
	done

identify:
	@for file in ${PUBLISH_DIR}/${TARGET}.schema.json ${PUBLISH_DIR}/${TARGET}.v${MAJOR_VERSION}.schema.json; do \
		echo "Running identify for $$file"; \
		npm run identify -- $$file ${REGISTRY_URL} docs; \
	done

metadata:
	@for file in ${PUBLISH_DIR}/${TARGET}.schema.json ${PUBLISH_DIR}/${TARGET}.v${MAJOR_VERSION}.schema.json; do \
		filename=$$(basename $$file); \
		base_filename=$$(basename $$file .schema.json); \
		echo "Running metadata for $$file"; \
		npm run metadata -- $$file \
		${PUBLISH_DIR}/$$base_filename.metadata.json \
		-a "ReportPortal"; \
	done