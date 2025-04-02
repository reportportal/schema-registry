const fs = require('fs');

/**
 * Updates the $id field in a JSON schema file based on file path and base URL
 * @param {string} filePath - Full path to the schema file
 * @param {string} baseUrl  - Base URL for schema (e.g., https://schema.reportportal.io)
 * @param {string} replacement  - String to replace in the file path with the base URL
 * @returns {boolean} - Success status
 */
function updateSchemaId(filePath, baseUrl, replacement = '') {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File '${filePath}' does not exist.`);
      return false;
    }

    baseUrl = baseUrl.replace(/\/$/, '');
    replacement = replacement.replace(/\/$/, '');

    let relativePath;

    if (filePath.startsWith(`${replacement}/`)) {
      relativePath = filePath.substring(replacement.length + 1);
    } else {
      relativePath = filePath;
    }

    const file = fs.readFileSync(filePath, 'utf8');
    const schema = JSON.parse(file);

    schema.$id = `${baseUrl}/${relativePath}`;

    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));

    console.log(`Updated $id from ${filePath} to: ${schema.$id}`);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

module.exports = { updateSchemaId };