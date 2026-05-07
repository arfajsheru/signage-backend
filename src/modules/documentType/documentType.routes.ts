import { FastifyInstance } from 'fastify';
import { DocumentTypeController } from './documentType.controller.js';
import { DocumentTypeService } from './documentType.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  createDocumentTypeSchema, 
  updateDocumentTypeSchema, 
  documentTypeQuerySchema 
} from './documentType.schema.js';

export default async function documentTypeRoutes(fastify: FastifyInstance) {
  const service = new DocumentTypeService(fastify.prisma);
  const controller = new DocumentTypeController(service);

  fastify.get('/dropdown', { preHandler: authenticate }, controller.getDropdown);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', { schema: createDocumentTypeSchema }, controller.create);
    protectedRoutes.get('/', { schema: documentTypeQuerySchema }, controller.getAll);
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.patch('/:id', { schema: updateDocumentTypeSchema }, controller.update);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
