import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectService } from './project.service.js';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryFilters } from './project.types.js';
import { ProjectStatus } from '@prisma/client';

import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class ProjectController {
  constructor(private service: ProjectService) {}

  private getContext(request: FastifyRequest) {
    const vendorId = request.user?.vendor_id || (request.body as any)?.vendor_id || (request.query as any)?.vendor_id || 1;
    const userId = request.user?.id || (request.body as any)?.user_id || (request.query as any)?.user_id || 1;
    return { vendorId: Number(vendorId), userId: Number(userId) };
  }

  create = async (request: FastifyRequest<{ Body: CreateProjectInput }>, reply: FastifyReply) => {
    const { vendorId, userId } = this.getContext(request);
    const result = await this.service.create(vendorId, userId, request.body);
    return reply.status(201).send(successResponse(result, 'Project created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: ProjectQueryFilters }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const { projects, total, page, limit } = await this.service.findAll(vendorId, request.query);
    return reply.send(
      successResponse(projects, 'Projects retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const result = await this.service.findById(vendorId, Number(request.params.id));
    return reply.send(successResponse(result, 'Project details retrieved successfully'));
  };

  getFullDetails = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const result = await this.service.getFullDetails(vendorId, Number(request.params.id));
    return reply.send(successResponse(result, 'Full project details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: number }; Body: UpdateProjectInput }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const result = await this.service.update(vendorId, Number(request.params.id), request.body);
    return reply.send(successResponse(result, 'Project updated successfully'));
  };

  updateStatus = async (request: FastifyRequest<{ Params: { id: number }; Body: { status: ProjectStatus } }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const result = await this.service.updateStatus(vendorId, Number(request.params.id), request.body.status);
    return reply.send(successResponse(result, 'Project status updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    await this.service.softDelete(vendorId, Number(request.params.id));
    return reply.send(successResponse(null, 'Project deleted successfully'));
  };

  search = async (request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const query = request.query.q || '';
    const result = await this.service.search(vendorId, query);
    return reply.send(successResponse(result, 'Project search results retrieved'));
  };

  getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    const { vendorId } = this.getContext(request);
    const result = await this.service.getStats(vendorId);
    return reply.send(successResponse(result, 'Project statistics retrieved successfully'));
  };
}
