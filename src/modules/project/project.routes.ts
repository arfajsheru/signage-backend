import { FastifyInstance } from 'fastify';
import { ProjectController } from './project.controller.js';
import { ProjectService } from './project.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export default async function projectRoutes(fastify: FastifyInstance) {
  const service = new ProjectService(fastify.prisma);
  const controller = new ProjectController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', controller.create);
    protectedRoutes.get('/', controller.getAll);
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.put('/:id', controller.update);
    protectedRoutes.patch('/:id/status', controller.updateStatus);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
