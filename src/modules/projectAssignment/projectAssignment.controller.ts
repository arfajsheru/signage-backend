import { FastifyReply, FastifyRequest } from 'fastify';
import { ProjectAssignmentService } from './projectAssignment.service.js';
import { successResponse } from '../../utils/response.js';

export class ProjectAssignmentController {
  constructor(private service: ProjectAssignmentService) {}

  assign = async (request: FastifyRequest<{ Body: { project_id: number; user_id: number } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const { project_id, user_id } = request.body;
    const result = await this.service.assignUser(vendorId, project_id, user_id);
    return reply.status(201).send(successResponse(result, 'User assigned to project successfully'));
  };

  remove = async (request: FastifyRequest<{ Params: { projectId: number; userId: number } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const { projectId, userId } = request.params;
    await this.service.removeUser(vendorId, projectId, userId);
    return reply.send(successResponse(null, 'User removed from project successfully'));
  };

  getUsers = async (request: FastifyRequest<{ Params: { projectId: number } }>, reply: FastifyReply) => {
    const vendorId = request.user!.vendor_id;
    const result = await this.service.getProjectUsers(vendorId, Number(request.params.projectId));
    return reply.send(successResponse(result, 'Project users retrieved successfully'));
  };
}
