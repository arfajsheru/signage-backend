import { FastifyInstance } from 'fastify';
import { StageApprovalController } from './stageApproval.controller.js';
import { StageApprovalService } from './stageApproval.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  createStageApprovalSchema, 
  updateStageApprovalSchema, 
  rejectStageApprovalSchema,
  stageApprovalQuerySchema 
} from './stageApproval.schema.js';

export default async function stageApprovalRoutes(fastify: FastifyInstance) {
  const service = new StageApprovalService(fastify.prisma);
  const controller = new StageApprovalController(service);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', { schema: createStageApprovalSchema }, controller.create);
    protectedRoutes.get('/', { schema: stageApprovalQuerySchema }, controller.getAll);
    protectedRoutes.get('/stats', controller.getStats);
    
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.patch('/:id', { schema: updateStageApprovalSchema }, controller.update);
    protectedRoutes.delete('/:id', controller.delete);
    
    protectedRoutes.patch('/:id/approve', controller.approve);
    protectedRoutes.patch('/:id/reject', { schema: rejectStageApprovalSchema }, controller.reject);
  });

  // Project Stage specific routes
  fastify.get('/project-stages/:projectStageId/approvals', { preHandler: authenticate }, controller.getByStage);
  fastify.get('/project-stages/:projectStageId/approval-timeline', { preHandler: authenticate }, controller.getTimeline);
}
