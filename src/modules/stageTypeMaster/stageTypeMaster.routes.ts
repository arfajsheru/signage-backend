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
  fastify.get('/dropdown', controller.getDropdown);

  fastify.post('/', { schema: createStageTypeSchema }, controller.create);
  fastify.get('/', { schema: stageTypeQuerySchema }, controller.getAll);
  fastify.get('/:id', controller.getOne);
  fastify.patch('/:id', { schema: updateStageTypeSchema }, controller.update);
  fastify.delete('/:id', controller.delete);
}
