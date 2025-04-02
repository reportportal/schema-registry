const fs = require('fs');

/**
 * Generates metadata from a JSON schema file
 * @param {string} schemaFilePath - Path to the JSON schema file
 * @param {string} metadataFilePath - Path to save the generated metadata
 * @param {Object} options - Additional metadata options
 * @param {string} [options.version="1.0"] - Schema version
 * @param {string} [options.author] - Schema author
 * @param {string} [options.license="Apache-2.0"] - Schema license
 * @returns {Object} Generated metadata object
 * @throws {Error} If file doesn't exist or isn't valid JSON
 */
function generateMetadata(schemaFilePath, metadataFilePath, options = {}) {
  if (!schemaFilePath) {
    throw new Error('Schema file path is required');
  }

  try {
    if (!fs.existsSync(schemaFilePath)) {
      throw new Error(`Schema file not found at path: ${schemaFilePath}`);
    }

    const schemaContent = fs.readFileSync(schemaFilePath, 'utf8');
    const schema = JSON.parse(schemaContent);
    const metadata = getMetadata(schema, options);

    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2), 'utf8');
    return metadata;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in schema file: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extracts metadata from a JSON schema
 * @param {Object} schema - JSON schema object
 * @param {Object} options - Additional metadata options
 * @param {string} [options.version="1.0"] - Schema version
 * @param {string} [options.author] - Schema author
 * @param {string} [options.license="Apache-2.0"] - Schema license
 * @returns {Object} Generated metadata object
 */
function getMetadata(schema, options = {}) {
  if (!schema) {
    throw new Error('Schema object is required');
  }

  const name = schema.title || 'Untitled Schema';
  const description = schema.description || 'No description provided';
  const schemaUrl = schema.$id;

  const version = options.version || "1.0";
  const author = options.author || "Unknown";
  const license = options.license || "Apache-2.0";
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  return {
    name,
    description,
    version,
    author,
    license,
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(schemaUrl && { schemaUrl })
  };
}

module.exports = {
  generateMetadata,
  getMetadata
};