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

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', { schema: createProjectWorkflowSchema }, controller.create);
    protectedRoutes.get('/', { schema: projectWorkflowQuerySchema }, controller.getAll);
    protectedRoutes.patch('/reorder', { schema: reorderWorkflowSchema }, controller.reorder);
    
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.patch('/:id', { schema: updateProjectWorkflowSchema }, controller.update);
    protectedRoutes.delete('/:id', controller.delete);
    
    protectedRoutes.get('/business-type/:businessTypeId', { schema: businessTypeParamsSchema }, controller.getByBusinessType);
    protectedRoutes.get('/dropdown/:businessTypeId', { schema: businessTypeParamsSchema }, controller.getDropdown);
  });
}
