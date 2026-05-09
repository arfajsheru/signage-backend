import { FastifyReply, FastifyRequest } from "fastify";
import { ChannelPartnerService } from "./channelPartner.service.js";
import {
  CreateChannelPartnerInput,
  UpdateChannelPartnerInput,
  ChannelPartnerQueryFilters,
} from "./channelPartner.types.js";
import { successResponse } from "../../utils/response.js";
import { getMeta } from "../../utils/pagination.js";

export class ChannelPartnerController {
  constructor(private service: ChannelPartnerService) {}

  private getVendorId(request: FastifyRequest) {
    const vendorId = request.user?.vendor_id || (request.body as any)?.vendor_id || (request.query as any)?.vendor_id || 1;
    return Number(vendorId);
  }

  create = async (
    request: FastifyRequest<{ Body: CreateChannelPartnerInput }>,
    reply: FastifyReply
  ) => {
    const vendorId = this.getVendorId(request);
    const result = await this.service.create(vendorId, request.body);
    return reply
      .status(201)
      .send(successResponse(result, "Channel Partner created successfully"));
  };

  getAll = async (
    request: FastifyRequest<{ Querystring: ChannelPartnerQueryFilters }>,
    reply: FastifyReply
  ) => {
    const vendorId = this.getVendorId(request);
    const { partners, total, page, limit } = await this.service.findAll(
      vendorId,
      request.query
    );
    return reply.send(
      successResponse(
        partners,
        "Channel Partners retrieved successfully",
        getMeta(total, page, limit)
      )
    );
  };

  getOne = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) => {
    const vendorId = this.getVendorId(request);
    const result = await this.service.findById(vendorId, Number(request.params.id));
    return reply.send(
      successResponse(result, "Channel Partner details retrieved successfully")
    );
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: number };
      Body: UpdateChannelPartnerInput;
    }>,
    reply: FastifyReply
  ) => {
    const vendorId = this.getVendorId(request);
    const result = await this.service.update(
      vendorId,
      Number(request.params.id),
      request.body
    );
    return reply.send(
      successResponse(result, "Channel Partner updated successfully")
    );
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) => {
    const vendorId = this.getVendorId(request);
    await this.service.delete(vendorId, Number(request.params.id));
    return reply.send(
      successResponse(null, "Channel Partner deleted successfully")
    );
  };
}
