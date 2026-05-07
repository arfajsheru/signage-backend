import { FastifyReply, FastifyRequest } from 'fastify';
import { StageTypeMasterService } from './stageTypeMaster.service.js';
import { CreateStageTypeInput, UpdateStageTypeInput, StageTypeQueryFilters } from './stageTypeMaster.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class StageTypeMasterController {
  constructor(private service: StageTypeMasterService) {}

  create = async (request: FastifyRequest<{ Body: CreateStageTypeInput }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body);
    return reply.status(201).send(successResponse(result, 'Stage type created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: StageTypeQueryFilters }>, reply: FastifyReply) => {
    const { stageTypes, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(stageTypes, 'Stage types retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const result = await this.service.findById(request.params.id);
    return reply.send(successResponse(result, 'Stage type details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateStageTypeInput }>, reply: FastifyReply) => {
    const result = await this.service.update(request.params.id, request.body);
    return reply.send(successResponse(result, 'Stage type updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Stage type deleted successfully'));
  };

  getDropdown = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getDropdown();
    return reply.send(successResponse(result, 'Stage type dropdown data retrieved successfully'));
  };
}
