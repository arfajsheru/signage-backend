import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectTypeService } from './projectType.service.js';
import { successResponse } from '../../utils/response.js';

export class ProjectTypeController {
  constructor(private service: ProjectTypeService) {}

  create = async (request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body.name);
    return reply.status(201).send(successResponse(result, 'Project type created successfully'));
  };

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.findAll();
    return reply.send(successResponse(result, 'Project types retrieved successfully'));
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const result = await this.service.findById(request.params.id);
    return reply.send(successResponse(result, 'Project type retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: { name: string } }>, reply: FastifyReply) => {
    const result = await this.service.update(request.params.id, request.body.name);
    return reply.send(successResponse(result, 'Project type updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Project type deleted successfully'));
  };
}
