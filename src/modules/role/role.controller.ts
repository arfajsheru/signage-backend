import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleService } from './role.service.js';
import { CreateRoleInput, UpdateRoleInput, RoleQueryFilters } from './role.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class RoleController {
  constructor(private service: RoleService) {}

  create = async (request: FastifyRequest<{ Body: CreateRoleInput }>, reply: FastifyReply) => {
    const role = await this.service.create(request.body);
    return reply.status(201).send(successResponse(role, 'Role created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: RoleQueryFilters }>, reply: FastifyReply) => {
    const { roles, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(successResponse(roles, 'Roles retrieved successfully', getMeta(total, page, limit)));
  };

  getOne = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const role = await this.service.findById(request.params.id);
    return reply.send(successResponse(role, 'Role details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateRoleInput }>, reply: FastifyReply) => {
    const role = await this.service.update(request.params.id, request.body);
    return reply.send(successResponse(role, 'Role updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Role deleted successfully'));
  };
}
