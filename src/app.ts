import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import prismaPlugin from './plugins/prisma.js';
import multipart from '@fastify/multipart';
import vendorRoutes from './modules/vendor/vendor.routes.js';
import userRoutes from './modules/user/user.routes.js';
import projectTypeRoutes from './modules/projectType/projectType.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import projectAssignmentRoutes from './modules/projectAssignment/projectAssignment.routes.js';
import stageTypeMasterRoutes from './modules/stageTypeMaster/stageTypeMaster.routes.js';
import projectWorkflowRoutes from './modules/projectWorkflow/projectWorkflow.routes.js';
import documentTypeRoutes from './modules/documentType/documentType.routes.js';
import { errorResponse } from './utils/response.js';
import { AppError } from './utils/errors.js';

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  // 1. Register Swagger (BEFORE routes)
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Signage CRM API',
        description: 'Professional API documentation for Signage SaaS',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:5001' }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // 2. Register Global Plugins
  await app.register(cors);
  await app.register(prismaPlugin);
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // 3. Global Error Handler
  app.setErrorHandler((error: any, request, reply) => {
    app.log.error(error);

    // If it's our custom AppError
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(errorResponse(error.message));
    }

    // Default Error
    const statusCode = error.statusCode || 500;
    const message = statusCode >= 500 ? 'Internal Server Error' : error.message;
    
    reply.status(statusCode).send(errorResponse(message, process.env.NODE_ENV === 'development' ? error.stack : undefined));
  });

  // 4. Routes
  await app.register(vendorRoutes, { prefix: '/vendors' });
  await app.register(userRoutes, { prefix: '/users' });
  await app.register(projectTypeRoutes, { prefix: '/project-types' });
  await app.register(projectRoutes, { prefix: '/projects' });
  await app.register(projectAssignmentRoutes, { prefix: '/project-assignments' });
  await app.register(stageTypeMasterRoutes, { prefix: '/stage-types' });
  await app.register(projectWorkflowRoutes, { prefix: '/project-workflows' });
  await app.register(documentTypeRoutes, { prefix: '/document-types' });

  app.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });

  app.get('/', async () => {
    return { 
      success: true, 
      message: '🚀 Signage Backend is LIVE bro!',
      docs: '/docs',
      time: new Date().toLocaleTimeString()
    };
  });

  return app;
};
