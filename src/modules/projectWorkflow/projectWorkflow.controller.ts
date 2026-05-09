import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectWorkflowService } from './projectWorkflow.service.js';
import { 
  CreateProjectWorkflowInput, 
  BulkCreateProjectWorkflowInput,
  UpdateProjectWorkflowInput, 
  ProjectWorkflowQueryFilters,
  ReorderWorkflowItem
} from './projectWorkflow.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class ProjectWorkflowController {
  constructor(private service: ProjectWorkflowService) {}

  create = async (request: FastifyRequest<{ Body: CreateProjectWorkflowInput | BulkCreateProjectWorkflowInput }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body);
    return reply.status(201).send(successResponse(result, 'Workflow stage created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: ProjectWorkflowQueryFilters }>, reply: FastifyReply) => {
    const { workflows, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(workflows, 'Workflows retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const result = await this.service.findById(Number(request.params.id));
    return reply.send(successResponse(result, 'Workflow stage details retrieved successfully'));
  };

  getByBusinessType = async (request: FastifyRequest, reply: FastifyReply) => {
    const { businessTypeId } = request.params as { businessTypeId: number };
    const result = await this.service.getByBusinessType(businessTypeId);
    return reply.send(successResponse(result, 'Business type workflow retrieved successfully'));
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const body = request.body as UpdateProjectWorkflowInput;
    const result = await this.service.update(id, body);
    return reply.send(successResponse(result, 'Workflow stage updated successfully'));
  };

  reorder = async (request: FastifyRequest<{ Body: ReorderWorkflowItem[] }>, reply: FastifyReply) => {
    const result = await this.service.reorder(request.body);
    return reply.send(successResponse(result, 'Workflow reordered successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    await this.service.delete(Number(request.params.id));
    return reply.send(successResponse(null, 'Workflow stage deleted successfully'));
  };

  getDropdown = async (request: FastifyRequest, reply: FastifyReply) => {
    const { businessTypeId } = request.params as { businessTypeId: number };
    const result = await this.service.getDropdown(businessTypeId);
    return reply.send(successResponse(result, 'Workflow dropdown retrieved successfully'));
  };
}
