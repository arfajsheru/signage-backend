import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectWorkflowService } from './projectWorkflow.service.js';
import { 
  CreateProjectWorkflowInput, 
  UpdateProjectWorkflowInput, 
  ProjectWorkflowQueryFilters,
  ReorderWorkflowItem
} from './projectWorkflow.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class ProjectWorkflowController {
  constructor(private service: ProjectWorkflowService) {}

  create = async (request: FastifyRequest<{ Body: CreateProjectWorkflowInput }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body);
    return reply.status(201).send(successResponse(result, 'Workflow stage created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: ProjectWorkflowQueryFilters }>, reply: FastifyReply) => {
    const { workflows, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(workflows, 'Workflows retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const result = await this.service.findById(request.params.id);
    return reply.send(successResponse(result, 'Workflow stage details retrieved successfully'));
  };

  getByBusinessType = async (request: FastifyRequest<{ Params: { businessTypeId: string } }>, reply: FastifyReply) => {
    const result = await this.service.getByBusinessType(request.params.businessTypeId);
    return reply.send(successResponse(result, 'Business type workflow retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateProjectWorkflowInput }>, reply: FastifyReply) => {
    const result = await this.service.update(request.params.id, request.body);
    return reply.send(successResponse(result, 'Workflow stage updated successfully'));
  };

  reorder = async (request: FastifyRequest<{ Body: ReorderWorkflowItem[] }>, reply: FastifyReply) => {
    const result = await this.service.reorder(request.body);
    return reply.send(successResponse(result, 'Workflow reordered successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Workflow stage deleted successfully'));
  };

  getDropdown = async (request: FastifyRequest<{ Params: { businessTypeId: string } }>, reply: FastifyReply) => {
    const result = await this.service.getDropdown(request.params.businessTypeId);
    return reply.send(successResponse(result, 'Workflow dropdown retrieved successfully'));
  };
}
