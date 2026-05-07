import { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createUserSchema, loginSchema, updateUserSchema, userQuerySchema } from './user.schema.js';

export default async function userRoutes(fastify: FastifyInstance) {
  const service = new UserService(fastify.prisma);
  const controller = new UserController(service);

  // Public Routes
  fastify.post('/register', { schema: createUserSchema }, controller.register);
  fastify.post('/login', { schema: loginSchema }, controller.login);

  // Protected Routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.get('/me', controller.getMe);
    protectedRoutes.get('/', { schema: userQuerySchema }, controller.getAll);
    protectedRoutes.put('/:id', { schema: updateUserSchema }, controller.update);
  });
}
