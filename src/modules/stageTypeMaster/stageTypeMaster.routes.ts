import { FastifyInstance } from 'fastify';
import { StageTypeMasterController } from './stageTypeMaster.controller.js';
import { StageTypeMasterService } from './stageTypeMaster.service.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  createStageTypeSchema, 
  updateStageTypeSchema, 
  stageTypeQuerySchema 
} from './stageTypeMaster.schema.js';

export default async function stageTypeMasterRoutes(fastify: FastifyInstance) {
  const service = new StageTypeMasterService(fastify.prisma);
  const controller = new StageTypeMasterController(service);

  // Dropdown should be accessible (maybe authenticated but without strict role?)
  fastify.get('/dropdown', { preHandler: authenticate }, controller.getDropdown);

  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    
    protectedRoutes.post('/', { schema: createStageTypeSchema }, controller.create);
    protectedRoutes.get('/', { schema: stageTypeQuerySchema }, controller.getAll);
    protectedRoutes.get('/:id', controller.getOne);
    protectedRoutes.patch('/:id', { schema: updateStageTypeSchema }, controller.update);
    protectedRoutes.delete('/:id', controller.delete);
  });
}
