import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectService } from './project.service.js';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryFilters } from './project.types.js';
import { ProjectStatus } from '@prisma/client';

import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class ProjectController {
  constructor(private service: ProjectService) {}

  create = async (request: FastifyRequest<{ Body: CreateProjectInput }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const userId = request.user!.id;
    const result = await this.service.create(vendorId, userId, request.body);
    return reply.status(201).send(successResponse(result, 'Project created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: ProjectQueryFilters }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const { projects, total, page, limit } = await this.service.findAll(vendorId, request.query);
    return reply.send(
      successResponse(projects, 'Projects retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.findById(vendorId, request.params.id);
    return reply.send(successResponse(result, 'Project details retrieved successfully'));
  };

  getFullDetails = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.getFullDetails(vendorId, request.params.id);
    return reply.send(successResponse(result, 'Full project details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateProjectInput }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.update(vendorId, request.params.id, request.body);
    return reply.send(successResponse(result, 'Project updated successfully'));
  };

  updateStatus = async (request: FastifyRequest<{ Params: { id: string }; Body: { status: ProjectStatus } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.updateStatus(vendorId, request.params.id, request.body.status);
    return reply.send(successResponse(result, 'Project status updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    await this.service.softDelete(vendorId, request.params.id);
    return reply.send(successResponse(null, 'Project deleted successfully'));
  };

  search = async (request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const query = request.query.q || '';
    const result = await this.service.search(vendorId, query);
    return reply.send(successResponse(result, 'Project search results retrieved'));
  };

  getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.getStats(vendorId);
    return reply.send(successResponse(result, 'Project statistics retrieved successfully'));
  };
}
