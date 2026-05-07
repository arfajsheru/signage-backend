import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service.js';
import { CreateUserInput, UpdateUserInput, UserQueryFilters, LoginInput } from './user.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class UserController {
  constructor(private service: UserService) {}

  register = async (
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) => {
    const user = await this.service.create(request.body);
    return reply.status(201).send(successResponse(user, 'User registered successfully'));
  };

  login = async (
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) => {
    const result = await this.service.login(request.body);
    return reply.send(successResponse(result, 'Login successful'));
  };

  getAll = async (
    request: FastifyRequest<{ Querystring: UserQueryFilters }>,
    reply: FastifyReply
  ) => {
    const { users, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(users, 'Users retrieved successfully', getMeta(total, page, limit))
    );
  };

  getMe = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user!.id;
    const user = await this.service.findById(userId);
    return reply.send(successResponse(user, 'Current user profile retrieved'));
  };

  update = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserInput }>,
    reply: FastifyReply
  ) => {
    const user = await this.service.update(request.params.id, request.body);
    return reply.send(successResponse(user, 'User updated successfully'));
  };
}
