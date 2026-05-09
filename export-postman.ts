import { writeFileSync } from 'fs';
import { buildApp } from './src/app.js';

async function generate() {
  const app = await buildApp();
  await app.ready();
  
  const swaggerObj = app.swagger();
  
  // Write the OpenAPI JSON to a file
  writeFileSync('Signage-API-Collection.json', JSON.stringify(swaggerObj, null, 2));
  
  console.log('✅ Postman Collection (OpenAPI format) generated successfully!');
  console.log('👉 File saved as: Signage-API-Collection.json');
  console.log('📌 You can directly import this file into Postman.');
  
  process.exit(0);
}

generate().catch(console.error);
