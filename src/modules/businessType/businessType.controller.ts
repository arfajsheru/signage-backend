import { FastifyReply, FastifyRequest } from 'fastify';
import { BusinessTypeService } from './businessType.service.js';
import { successResponse } from '../../utils/response.js';

export class BusinessTypeController {
  constructor(private service: BusinessTypeService) {}

  create = async (request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body.name);
    return reply.status(201).send(successResponse(result, 'Business type created successfully'));
  };

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.findAll();
    return reply.send(successResponse(result, 'Business types retrieved successfully'));
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const result = await this.service.findById(Number(request.params.id));
    return reply.send(successResponse(result, 'Business type details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: { name: string } }>, reply: FastifyReply) => {
    const result = await this.service.update(Number(request.params.id), request.body.name);
    return reply.send(successResponse(result, 'Business type updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(Number(request.params.id));
    return reply.send(successResponse(null, 'Business type deleted successfully'));
  };
}
