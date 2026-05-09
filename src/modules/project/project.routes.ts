import { FastifyInstance } from 'fastify';
import { ProjectController } from './project.controller.js';
import { ProjectService } from './project.service.js';

import { 
  createProjectSchema, 
  updateProjectSchema, 
  updateProjectStatusSchema, 
  projectQuerySchema 
} from './project.schema.js';

export default async function projectRoutes(fastify: FastifyInstance) {
  const service = new ProjectService(fastify.prisma);
  const controller = new ProjectController(service);

  // Core Project APIs
  fastify.post('/', { schema: createProjectSchema }, controller.create);
  fastify.get('/', { schema: projectQuerySchema }, controller.getAll);
  fastify.get('/stats', controller.getStats);
  fastify.get('/search', controller.search);
  
  // Single Project APIs
  fastify.get('/:id', controller.getOne);
  fastify.get('/:id/full-details', controller.getFullDetails);
  
  fastify.patch('/:id', { schema: updateProjectSchema }, controller.update);
  fastify.patch('/:id/status', { schema: updateProjectStatusSchema }, controller.updateStatus);
  fastify.delete('/:id', controller.delete);
}
