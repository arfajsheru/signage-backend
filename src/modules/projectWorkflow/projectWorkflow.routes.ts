import { FastifyInstance } from 'fastify';
import { ProjectWorkflowController } from './projectWorkflow.controller.js';
import { ProjectWorkflowService } from './projectWorkflow.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  createProjectWorkflowSchema, 
  updateProjectWorkflowSchema, 
  reorderWorkflowSchema,
  projectWorkflowQuerySchema,
  businessTypeParamsSchema
} from './projectWorkflow.schema.js';

export default async function projectWorkflowRoutes(fastify: FastifyInstance) {
  const service = new ProjectWorkflowService(fastify.prisma);
  const controller = new ProjectWorkflowController(service);

  fastify.post('/', { schema: createProjectWorkflowSchema }, controller.create);
  fastify.get('/', { schema: projectWorkflowQuerySchema }, controller.getAll);
  fastify.patch('/reorder', { schema: reorderWorkflowSchema }, controller.reorder);
  
  fastify.get('/:id', controller.getOne);
  fastify.patch('/:id', { schema: updateProjectWorkflowSchema }, controller.update);
  fastify.delete('/:id', controller.delete);
  
  fastify.get('/business-type/:businessTypeId', { schema: businessTypeParamsSchema }, controller.getByBusinessType);
  fastify.get('/dropdown/:businessTypeId', { schema: businessTypeParamsSchema }, controller.getDropdown);
}
