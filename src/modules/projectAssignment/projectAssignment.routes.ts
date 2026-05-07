import { FastifyInstance } from 'fastify';
import { ProjectAssignmentController } from './projectAssignment.controller.js';
import { ProjectAssignmentService } from './projectAssignment.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export default async function projectAssignmentRoutes(fastify: FastifyInstance) {
  const service = new ProjectAssignmentService(fastify.prisma);
  const controller = new ProjectAssignmentController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', controller.assign);
    protectedRoutes.get('/:projectId', controller.getUsers);
    protectedRoutes.delete('/:projectId/:userId', controller.remove);
  });
}
