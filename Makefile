VERSION := 1.0
MAJOR_VERSION := $(shell echo $(VERSION) | cut -d. -f1)
REGESTRY_URL := https://schema.reportportal.io
PUBLISH_DIR := docs
TARGET := manifest.json

all: publish

bundle:
	@for file in src/schemas/${TARGET}; do \
		base_filename=$$(basename $$file .json); \
		echo "Running bundle for $$file"; \
		npm run bundle -- $$file ${PUBLISH_DIR}/$$base_filename.schema.json; \
		cp $$file ${PUBLISH_DIR}/$$base_filename.v${MAJOR_VERSION}.schema.json; \
	done

identify: bundle
	@for file in ${PUBLISH_DIR}/*.schema.json; do \
		echo "Running identify for $$file"; \
		npm run identify -- $$file ${REGESTRY_URL} docs; \
	done

metadata: identify
	@for file in ${PUBLISH_DIR}/*.schema.json; do \
		filename=$$(basename $$file); \
		if [ "$${filename##*.v*.schema.json}" != "$$filename" ] && [ "$${filename##*.v${MAJOR_VERSION}.schema.json}" = "$$filename" ]; then \
			: # Do nothing for these files \
		else \
			base_filename=$$(basename $$file .schema.json); \
			echo "Running metadata for $$file"; \
			npm run metadata -- $$file \
			${PUBLISH_DIR}/$$base_filename.metadata.json \
			-v ${VERSION} \
			-a "ReportPortal"; \
		fi \
	done

publish: metadata