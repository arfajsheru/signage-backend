import { writeFileSync } from 'fs';
import { buildApp } from './src/app.js';

/**
 * Format string to Title Case nicely
 */
function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate a nice human-readable name for a route
 */
function generateRequestName(method: string, path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return 'Health Check';

  // Make resource singular (e.g., vendors -> Vendor, project-types -> Project Type)
  let rawResource = parts[0];
  if (rawResource.endsWith('s')) rawResource = rawResource.slice(0, -1);
  const resource = toTitleCase(rawResource);
  
  if (method === 'post' && parts.length === 1) return `Create ${resource}`;
  if (method === 'get' && parts.length === 1) return `Get ${resource} List`;
  
  const hasId = parts[1]?.includes('{');
  
  if (method === 'get' && hasId) {
    if (parts.length === 2) return `Get ${resource} Details`;
    if (parts.length > 2) return `Get ${resource} ${toTitleCase(parts.slice(2).join(' '))}`;
  }
  
  if ((method === 'put' || method === 'patch') && hasId) {
     if (parts.length === 2) return `Update ${resource}`;
     if (parts.length > 2) return `Update ${resource} ${toTitleCase(parts.slice(2).join(' '))}`;
  }
  
  if (method === 'delete' && hasId) {
    if (parts.length === 2) return `Delete ${resource}`;
    if (parts.length > 2) return `Delete ${resource} ${toTitleCase(parts.slice(2).join(' '))}`;
  }
  
  // Custom or nested routes without ID in second position
  if (parts[1] && !parts[1].includes('{')) {
     if (method === 'post') return `${toTitleCase(parts[1])} ${resource}`;
     return `${method === 'get' ? 'Get' : toTitleCase(method)} ${resource} ${toTitleCase(parts[1])}`;
  }

  return `${method.toUpperCase()} ${path}`;
}

/**
 * Generate dummy value for JSON schema property
 */
function getDummyValue(prop: any): any {
  if (prop.default !== undefined) return prop.default;
  if (prop.example !== undefined) return prop.example;
  
  switch (prop.type) {
    case 'string':
      if (prop.format === 'email') return 'admin@example.com';
      if (prop.format === 'date-time') return new Date().toISOString();
      if (prop.enum) return prop.enum[0];
      return "example_string";
    case 'number':
    case 'integer':
      return 1;
    case 'boolean':
      return true;
    case 'array':
      return prop.items ? [getDummyValue(prop.items)] : [];
    case 'object':
      if (prop.properties) return generateExampleBody(prop);
      return {};
    default:
      return "mixed";
  }
}

/**
 * Build a full JSON object from OpenAPI schema
 */
function generateExampleBody(schema: any): any {
  if (!schema || !schema.properties) return {};
  const example: any = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    example[key] = getDummyValue(prop);
  }
  return example;
}

async function generate() {
  console.log('🚀 Starting Perfect Postman Collection Generator...');
  
  const app = await buildApp();
  await app.ready();
  
  // Get Swagger spec
  const swagger: any = app.swagger();
  
  // Base Collection Template
  const collection = {
    info: {
      name: "Signage ERP Professional",
      description: "Auto-generated production-grade Postman collection for the complete Signage ERP backend.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [] as any[],
    variable: [
      { key: "baseUrl", value: "http://localhost:5001", type: "string" },
      { key: "token", value: "YOUR_JWT_TOKEN", type: "string" }
    ]
  };

  const folders: Record<string, any> = {};

  // Group paths into folders
  for (const [path, methods] of Object.entries(swagger.paths)) {
    // Determine folder name from the first path segment
    const segment = path.split('/')[1] || 'Core';
    const folderName = toTitleCase(segment);

    if (!folders[folderName]) {
      folders[folderName] = {
        name: folderName,
        item: []
      };
      collection.item.push(folders[folderName]);
    }

    // Replace swagger params {id} with postman params {{id}} in URL
    const postmanUrlPath = path.split('/').map(p => {
       if (p.startsWith('{') && p.endsWith('}')) return `{{${p.substring(1, p.length - 1)}}}`;
       return p;
    });

    for (const [method, endpoint] of Object.entries(methods as any)) {
      const isMultipart = endpoint.consumes?.includes('multipart/form-data');
      
      const reqItem: any = {
        name: generateRequestName(method, path),
        request: {
          method: method.toUpperCase(),
          header: [],
          url: {
            raw: `{{baseUrl}}${postmanUrlPath.join('/')}`,
            host: ["{{baseUrl}}"],
            path: postmanUrlPath.filter(Boolean)
          }
        },
        response: []
      };

      // Handle Authorization Header dynamically. 
      // If the route has "authenticate" hook, we add the Bearer token.
      // Fastify swagger doesn't easily expose hook info unless specifically defined in security schema.
      // But we can safely add it to all routes EXCEPT explicit public ones (like /users/login, /users/register)
      const isPublic = path.includes('/login') || path.includes('/register') || path === '/' || path === '/health';
      if (!isPublic) {
        reqItem.request.header.push({
          key: "Authorization",
          value: "Bearer {{token}}",
          type: "text",
          description: "JWT Authorization header"
        });
      }

      // Query parameters
      if (endpoint.parameters) {
        reqItem.request.url.query = endpoint.parameters
          .filter((p: any) => p.in === 'query')
          .map((p: any) => ({
            key: p.name,
            value: getDummyValue(p.schema || p).toString(),
            description: p.description || ''
          }));
      }

      // Body parameters
      if (endpoint.requestBody && endpoint.requestBody.content) {
        const jsonContent = endpoint.requestBody.content['application/json'];
        const multipartContent = endpoint.requestBody.content['multipart/form-data'];

        if (jsonContent && jsonContent.schema) {
          const bodySchema = jsonContent.schema;
          const exampleBody = generateExampleBody(bodySchema);
          
          reqItem.request.body = {
            mode: "raw",
            raw: JSON.stringify(exampleBody, null, 2),
            options: { raw: { language: "json" } }
          };
        } else if (multipartContent) {
           // File Upload handling
           reqItem.request.body = {
             mode: "formdata",
             formdata: []
           };
           // Basic heuristic for typical file uploads
           reqItem.request.body.formdata.push({
             key: "file",
             type: "file",
             description: "Upload your document here"
           });
           reqItem.request.body.formdata.push({
             key: "document_type_id",
             value: "1",
             type: "text"
           });
           reqItem.request.body.formdata.push({
             key: "project_stage_id",
             value: "1",
             type: "text"
           });
        }
      } else if (endpoint.parameters && endpoint.parameters.some((p: any) => p.in === 'body')) {
          // Swagger 2.0 fallback
          const bodyParam = endpoint.parameters.find((p: any) => p.in === 'body');
          if (bodyParam && bodyParam.schema) {
              const exampleBody = generateExampleBody(bodyParam.schema);
              reqItem.request.body = {
                mode: "raw",
                raw: JSON.stringify(exampleBody, null, 2),
                options: { raw: { language: "json" } }
              };
          }
      } else if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH') {
          // Fallback empty body
          reqItem.request.body = {
            mode: "raw",
            raw: "{}",
            options: { raw: { language: "json" } }
          };
      }

      folders[folderName].item.push(reqItem);
    }
  }

  writeFileSync('Signage-API-Collection.json', JSON.stringify(collection, null, 2));
  console.log('✅ Collection saved to Signage-API-Collection.json');
  
  // Generate environment file
  const environment = {
    id: "signage-env-1234",
    name: "Signage ERP Environment",
    values: [
      { key: "baseUrl", value: "http://localhost:5001", type: "default", enabled: true },
      { key: "token", value: "YOUR_JWT_TOKEN", type: "default", enabled: true },
      { key: "vendor_id", value: "1", type: "default", enabled: true },
      { key: "project_id", value: "1", type: "default", enabled: true },
      { key: "user_id", value: "1", type: "default", enabled: true }
    ]
  };
  writeFileSync('Signage-API-Environment.json', JSON.stringify(environment, null, 2));
  console.log('✅ Environment saved to Signage-API-Environment.json');

  await app.close();
  process.exit(0);
}

generate().catch(console.error);
