import { FastifyReply, FastifyRequest } from 'fastify';
import { StageFileService } from './stageFile.service.js';
import { StageFileQueryFilters } from './stageFile.types.js';
import { successResponse } from '../../utils/response.js';
import { getMeta } from '../../utils/pagination.js';
import { ValidationError } from '../../utils/errors.js';

export class StageFileController {
  constructor(private service: StageFileService) {}

  upload = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();
    if (!data) throw new ValidationError('File is required');

    // Extract non-file fields from multipart
    const project_stage_id = (data.fields.project_stage_id as any)?.value;
    const document_type_id = (data.fields.document_type_id as any)?.value;

    if (!project_stage_id || !document_type_id) {
      throw new ValidationError('project_stage_id and document_type_id are required');
    }

    const fileBuffer = await data.toBuffer();
    const userId = request.user!.id;

    const result = await this.service.upload(
      userId,
      project_stage_id,
      document_type_id,
      fileBuffer,
      data.filename
    );

    return reply.status(201).send(successResponse(result, 'File uploaded successfully'));
  };

  getAll = async (request: FastifyRequest<{ Querystring: StageFileQueryFilters }>, reply: FastifyReply) => {
    const { files, total, page, limit } = await this.service.findAll(request.query);
    return reply.send(
      successResponse(files, 'Stage files retrieved successfully', getMeta(total, page, limit))
    );
  };

  getOne = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const result = await this.service.findById(Number(request.params.id));
    return reply.send(successResponse(result, 'Stage file details retrieved successfully'));
  };

  getByStage = async (request: FastifyRequest, reply: FastifyReply) => {
    const { projectStageId } = request.params as { projectStageId: number };
    const result = await this.service.findByStageId(projectStageId);
    return reply.send(successResponse(result, 'Project stage files retrieved successfully'));
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const { document_type_id } = request.body as { document_type_id: number };
    const result = await this.service.update(id, document_type_id);
    return reply.send(successResponse(result, 'Stage file updated successfully'));
  };

  delete = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    await this.service.delete(Number(request.params.id));
    return reply.send(successResponse(null, 'Stage file deleted successfully'));
  };

  preview = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const file = await this.service.findById(Number(request.params.id));
    return reply.send(successResponse({
      file_url: file.file_url,
      document_type: file.document_type,
      uploaded_by: file.uploaded_user,
      created_at: file.created_at
    }, 'File preview details retrieved'));
  };

  download = async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
    const file = await this.service.findById(Number(request.params.id));
    return reply.redirect(file.file_url);
  };

  getStats = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getStats();
    return reply.send(successResponse(result, 'File statistics retrieved successfully'));
  };
}
