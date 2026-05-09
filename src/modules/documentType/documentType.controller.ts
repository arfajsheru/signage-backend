import { FastifyReply, FastifyRequest } from 'fastify';
import { DocumentTypeService } from './documentType.service.js';
import { CreateDocumentTypeInput, UpdateDocumentTypeInput, DocumentTypeQueryFilters } from './documentType.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';

export class DocumentTypeController {
  constructor(private service: DocumentTypeService) {}

  create = async (request: FastifyRequest<{ Body: CreateDocumentTypeInput }>, reply: FastifyReply) => {
    const result = await this.service.create(request.body);
    return reply.status(201).send(successResponse(result, 'Document type created successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: DocumentTypeQueryFilters }>, reply: FastifyReply) => {
    const { documentTypes, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(documentTypes, 'Document types retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const result = await this.service.findById(Number(request.params.id));
    return reply.send(successResponse(result, 'Document type details retrieved successfully'));
  };

  update = async (request: FastifyRequest<{ Params: { id: number }; Body: UpdateDocumentTypeInput }>, reply: FastifyReply) => {
    const result = await this.service.update(Number(request.params.id), request.body);
    return reply.send(successResponse(result, 'Document type updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    await this.service.delete(Number(request.params.id));
    return reply.send(successResponse(null, 'Document type deleted successfully'));
  };

  getDropdown = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getDropdown();
    return reply.send(successResponse(result, 'Document type dropdown data retrieved successfully'));
  };
}
