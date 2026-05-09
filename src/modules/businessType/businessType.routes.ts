import { FastifyInstance } from 'fastify';
import { BusinessTypeController } from './businessType.controller.js';
import { BusinessTypeService } from './businessType.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export default async function businessTypeRoutes(fastify: FastifyInstance) {
  const service = new BusinessTypeService(fastify.prisma);
  const controller = new BusinessTypeController(service);

  fastify.post('/', controller.create);
  fastify.get('/', controller.getAll);
  fastify.get('/:id', controller.getOne);
  fastify.put('/:id', controller.update);
  fastify.delete('/:id', controller.delete);
}
