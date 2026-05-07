import { FastifyReply, FastifyRequest } from 'fastify';
import { StageApprovalService } from './stageApproval.service.js';
import { CreateStageApprovalInput, UpdateStageApprovalInput, StageApprovalQueryFilters } from './stageApproval.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class StageApprovalController {
  constructor(private service: StageApprovalService) {}

  create = async (request: FastifyRequest<{ Body: CreateStageApprovalInput }>, reply: FastifyReply) => {
    const userId = request.user!.id;
    const result = await this.service.create(userId, request.body);
    return reply.status(201).send(successResponse(result, 'Stage approval created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: StageApprovalQueryFilters }>, reply: FastifyReply) => {
    const { approvals, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(approvals, 'Stage approvals retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const result = await this.service.findById(request.params.id);
    return reply.send(successResponse(result, 'Stage approval details retrieved successfully'));
  };

  getByStage = async (request: FastifyRequest<{ Params: { projectStageId: string } }>, reply: FastifyReply) => {
    const result = await this.service.findByStageId(request.params.projectStageId);
    return reply.send(successResponse(result, 'Project stage approvals retrieved successfully'));
  };

  approve = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const userId = request.user!.id;
    const result = await this.service.approve(request.params.id, userId);
    return reply.send(successResponse(result, 'Stage approved successfully'));
  };

  reject = async (request: FastifyRequest<{ Params: { id: string }; Body: { remarks: string } }>, reply: FastifyReply) => {
    const userId = request.user!.id;
    const result = await this.service.reject(request.params.id, userId, request.body.remarks);
    return reply.send(successResponse(result, 'Stage rejected successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateStageApprovalInput }>, reply: FastifyReply) => {
    const userId = request.user!.id;
    const result = await this.service.update(request.params.id, userId, request.body);
    return reply.send(successResponse(result, 'Stage approval updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Stage approval deleted successfully'));
  };

  getTimeline = async (request: FastifyRequest<{ Params: { projectStageId: string } }>, reply: FastifyReply) => {
    const result = await this.service.getTimeline(request.params.projectStageId);
    return reply.send(successResponse(result, 'Stage approval timeline retrieved successfully'));
  };

  getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getStats();
    return reply.send(successResponse(result, 'Stage approval statistics retrieved successfully'));
  };
}
