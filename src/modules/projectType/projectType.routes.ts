import { FastifyInstance } from 'fastify';
import { ProjectTypeController } from './projectType.controller.js';
import { ProjectTypeService } from './projectType.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export default async function projectTypeRoutes(fastify: FastifyInstance) {
  const service = new ProjectTypeService(fastify.prisma);
  const controller = new ProjectTypeController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', controller.create);
    protectedRoutes.get('/', controller.getAll);
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.put('/:id', controller.update);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
