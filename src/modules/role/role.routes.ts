import { FastifyInstance } from 'fastify';
import { RoleController } from './role.controller.js';
import { RoleService } from './role.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createRoleSchema, updateRoleSchema, roleQuerySchema } from './role.schema.js';

export default async function roleRoutes(fastify: FastifyInstance) {
  const service = new RoleService(fastify.prisma);
  const controller = new RoleController(service);

  fastify.register(async (openRoutes) => {
    // Temporarily disabled auth for initial setup
    // openRoutes.addHook('preHandler', authenticate);
    
    openRoutes.post('/', { schema: createRoleSchema }, controller.create);
    openRoutes.get('/', { schema: roleQuerySchema }, controller.getAll);
    openRoutes.get('/:id', controller.getOne);
    openRoutes.put('/:id', { schema: updateRoleSchema }, controller.update);
    openRoutes.delete('/:id', controller.delete);
  });
}
