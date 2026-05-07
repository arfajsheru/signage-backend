import { FastifyInstance } from 'fastify';
import { ProjectController } from './project.controller.js';
import { ProjectService } from './project.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  createProjectSchema, 
  updateProjectSchema, 
  updateProjectStatusSchema, 
  projectQuerySchema 
} from './project.schema.js';

export default async function projectRoutes(fastify: FastifyInstance) {
  const service = new ProjectService(fastify.prisma);
  const controller = new ProjectController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    // Core Project APIs
    protectedRoutes.post('/', { schema: createProjectSchema }, controller.create);
    protectedRoutes.get('/', { schema: projectQuerySchema }, controller.getAll);
    protectedRoutes.get('/stats', controller.getStats);
    protectedRoutes.get('/search', controller.search);
    
    // Single Project APIs
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.get('/:id/full-details', controller.getFullDetails);
    
    protectedRoutes.patch('/:id', { schema: updateProjectSchema }, controller.update);
    protectedRoutes.patch('/:id/status', { schema: updateProjectStatusSchema }, controller.updateStatus);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
