import { FastifyInstance } from 'fastify';
import { StageFileController } from './stageFile.controller.js';
import { StageFileService } from './stageFile.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { updateStageFileSchema, stageFileQuerySchema, projectStageParamsSchema } from './stageFile.schema.js';

export default async function stageFileRoutes(fastify: FastifyInstance) {
  const service = new StageFileService(fastify.prisma);
  const controller = new StageFileController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/upload', controller.upload);
    protectedRoutes.get('/', { schema: stageFileQuerySchema }, controller.getAll);
    protectedRoutes.get('/stats', controller.getStats);
    
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.patch('/:id', { schema: updateStageFileSchema }, controller.update);
    protectedRoutes.delete('/:id', controller.delete);
    
    protectedRoutes.get('/:id/preview', controller.preview);
    protectedRoutes.get('/:id/download', controller.download);
  });

  // Alias for stage specific files
  fastify.get('/project-stages/:projectStageId/files', { preHandler: authenticate, schema: projectStageParamsSchema }, controller.getByStage);
}
