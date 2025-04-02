#!/usr/bin/env node

const { program } = require('commander');
const { bundleSchemas } = require('./src/utils/bundler');
const { updateSchemaId } = require('./src/utils/identify');
const { generateMetadata } = require('./src/utils/metadata');
const packageJson = require('./package.json');

program
  .name('schema')
  .description('Schema Registry CLI tools')
  .version(packageJson.version);

program
  .command('bundle')
  .description('Bundle a schema with all its references into a single file')
  .argument('<inputPath>', 'Path to the main schema file')
  .argument('<outputPath>', 'Path where to save the bundled schema')
  .action((inputPath, outputPath) => {
    console.log(`Bundling schema from ${inputPath} to ${outputPath}...`);
    bundleSchemas(inputPath, outputPath);
  });

program
  .command('identify')
  .description('Identify and update the $id field in a JSON schema file')
  .argument('<filePath>', 'Path to the schema file')
  .argument('<baseUrl>', 'Base URL for schema (e.g., https://schema.reportportal.io)')
  .argument('[replacement]', 'Optional base path to replace with baseUrl')
  .action((filePath, baseUrl, replacement) => {
    console.log(`Updating $id in schema ${filePath}...`);
    const success = updateSchemaId(filePath, baseUrl, replacement);
    if (!success) {
      process.exit(1);
    }
  });

program
  .command('metadata')
  .description('Generate metadata for a schema file')
  .argument('<filePath>', 'Path to the schema file')
  .argument('<outputPath>', 'Path where to save the metadata')
  .option('-a, --author <author>', 'Schema author')
  .option('-l, --license <license>', 'Schema license', 'Apache-2.0')
  .action((filePath, outputPath, options) => {
    console.log(`Generating metadata for schema ${filePath}...`);
    try {
      const metadata = generateMetadata(filePath, outputPath, {
        author: options.author,
        license: options.license
      });
      console.log(`Metadata successfully generated at ${outputPath}`);
      console.log(JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error(`Error generating metadata: ${error.message}`);
      process.exit(1);
    }
  });

program.on('command:*', () => {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);