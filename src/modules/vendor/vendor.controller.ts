import { FastifyReply, FastifyRequest } from 'fastify';
import { VendorService, CreateVendorInput, UpdateVendorInput } from './vendor.service.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class VendorController {
  constructor(private service: VendorService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateVendorInput }>,
    reply: FastifyReply
  ) => {
    const vendor = await this.service.create(request.body);
    return reply.status(201).send(successResponse(vendor, 'Business created successfully'));
  };

  getAll = async (
    request: FastifyRequest<{ Querystring: { search?: string; page?: string; limit?: string } }>,
    reply: FastifyReply
  ) => {
    const { vendors, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(vendors, 'Businesses retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const vendor = await this.service.findById(request.params.id);
    return reply.send(successResponse(vendor, 'Business details retrieved successfully'));
  };

  update = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateVendorInput }>,
    reply: FastifyReply
  ) => {
    const vendor = await this.service.update(request.params.id, request.body);
    return reply.send(successResponse(vendor, 'Business updated successfully'));
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    await this.service.delete(request.params.id);
    return reply.send(successResponse(null, 'Business deactivated successfully'));
  };
}
