const fs = require('fs');
const path = require('path');

function bundleSchemas(mainSchemaPath, outputPath) {

  const mainSchema = JSON.parse(fs.readFileSync(mainSchemaPath, 'utf8'));
  const processedSchemas = new Set();
  const mainBasePath = path.dirname(mainSchemaPath);
  
  function processSchema(schema, basePath) {
    if (typeof schema !== 'object' || schema === null) return schema;
    
    if (Array.isArray(schema)) {
      return schema.map(item => processSchema(item, basePath));
    }
    
    const result = {};
    
    for (const [key, value] of Object.entries(schema)) {
      if (key === '$ref' && typeof value === 'string' && (value.startsWith('../') || value.startsWith('./'))) {
        const schemaPath = path.resolve(basePath, value);
        
        if (processedSchemas.has(schemaPath)) {
          result[key] = value;
        } else {
          processedSchemas.add(schemaPath);
          
          const referencedSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
          delete referencedSchema.$id;
          delete referencedSchema.$schema;
          delete referencedSchema.title;
          delete referencedSchema.description;
          
          const baseSchemaDirectory = path.dirname(schemaPath);
          Object.assign(result, processSchema(referencedSchema, baseSchemaDirectory));
        }
      } else if (typeof value === 'object' && value !== null) {
        result[key] = processSchema(value, basePath);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  const bundledSchema = processSchema(mainSchema, mainBasePath);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(bundledSchema, null, 2));
  console.log(`Bundled schema written to ${outputPath}`);
}