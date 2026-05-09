const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace primary keys
content = content.replace(/id\s+String\s+@id\s+@default\(uuid\(\)\)/g, 'id Int @id @default(autoincrement())');

// Replace foreign keys
const fkFields = [
  'vendor_id', 'role_id', 'business_type_id', 'channel_partner_id',
  'created_by', 'user_id', 'project_id', 'stage_id',
  'project_stage_id', 'document_type_id', 'uploaded_by', 'approved_by'
];

fkFields.forEach(field => {
  const regexString = new RegExp(`${field}\\s+String`, 'g');
  const regexStringOptional = new RegExp(`${field}\\s+String\\?`, 'g');
  content = content.replace(regexString, `${field} Int`);
  content = content.replace(regexStringOptional, `${field} Int?`);
});

fs.writeFileSync(schemaPath, content);
console.log('Schema updated.');
