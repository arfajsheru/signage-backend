import { FastifyInstance } from 'fastify';
import { VendorController } from './vendor.controller.js';
import { VendorService } from './vendor.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export default async function vendorRoutes(fastify: FastifyInstance) {
  const service = new VendorService(fastify.prisma);
  const controller = new VendorController(service);

  // Public: Register a new business
  fastify.post('/', controller.create);

  // Protected: Manage businesses
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.get('/', controller.getAll);
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.put('/:id', controller.update);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
