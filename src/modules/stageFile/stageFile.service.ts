import { PrismaClient } from "@prisma/client";
import { StageFileQueryFilters, StageFileStats } from "./stageFile.types.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";
import { storage } from "../../utils/storage/index.js";

export class StageFileService {
  constructor(private prisma: PrismaClient) {}

  async upload(
    userId: string,
    projectStageId: string,
    documentTypeId: string,
    fileBuffer: Buffer,
    fileName: string,
  ) {
    // 1. Validate Stage exists
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: projectStageId },
    });
    if (!stage) throw new ValidationError("Invalid project stage");

    // 2. Validate Document Type exists
    const docType = await this.prisma.documentType.findUnique({
      where: { id: documentTypeId },
    });
    if (!docType) throw new ValidationError("Invalid document type");

    // 3. Upload to Storage
    const uploadResult = await storage.uploadFile(
      fileBuffer,
      "stage-files",
      `${projectStageId}_${Date.now()}`,
    );

    // 4. Save to Database
    return this.prisma.stageFile.create({
      data: {
        project_stage_id: projectStageId,
        document_type_id: documentTypeId,
        uploaded_by: userId,
        file_url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      include: {
        document_type: true,
        uploaded_user: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(filters: StageFileQueryFilters) {
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.project_stage_id)
      where.project_stage_id = filters.project_stage_id;
    if (filters.document_type_id)
      where.document_type_id = filters.document_type_id;
    if (filters.uploaded_by) where.uploaded_by = filters.uploaded_by;

    if (filters.search) {
      where.OR = [
        {
          document_type: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
        {
          uploaded_user: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    const [total, files] = await Promise.all([
      this.prisma.stageFile.count({ where }),
      this.prisma.stageFile.findMany({
        where,
        skip,
        take: limit,
        include: {
          project_stage: true,
          document_type: true,
          uploaded_user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    return { files, total, page, limit };
  }

  async findById(id: string) {
    const file = await this.prisma.stageFile.findUnique({
      where: { id },
      include: {
        project_stage: true,
        document_type: true,
        uploaded_user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!file) throw new NotFoundError("Stage file not found");
    return file;
  }

  async findByStageId(projectStageId: string) {
    return this.prisma.stageFile.findMany({
      where: { project_stage_id: projectStageId },
      include: {
        document_type: true,
        uploaded_user: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
    });
  }

  async update(id: string, documentTypeId: string) {
    const docType = await this.prisma.documentType.findUnique({
      where: { id: documentTypeId },
    });
    if (!docType) throw new ValidationError("Invalid document type");

    return this.prisma.stageFile.update({
      where: { id },
      data: { document_type_id: documentTypeId },
      include: { document_type: true },
    });
  }

  async delete(id: string) {
    const file = await this.findById(id);

    // 1. Delete from Storage if public_id exists
    if (file.public_id) {
      try {
        await storage.deleteFile(file.public_id);
      } catch (error) {
        console.error("Failed to delete file from storage:", error);
      }
    }

    // 2. Delete from Database
    return this.prisma.stageFile.delete({
      where: { id },
    });
  }

  async getStats(): Promise<StageFileStats> {
    const [total_uploads, by_doc_type, by_stage, by_user] = await Promise.all([
      this.prisma.stageFile.count(),
      this.prisma.documentType.findMany({
        select: {
          name: true,
          _count: { select: { files: true } },
        },
      }),
      this.prisma.projectStage.findMany({
        select: {
          stage: { select: { name: true } },
          _count: { select: { files: true } },
        },
      }),
      this.prisma.user.findMany({
        select: {
          name: true,
          _count: { select: { uploaded_files: true } },
        },
      }),
    ]);

    return {
      total_uploads,
      by_document_type: by_doc_type.map((d) => ({
        document_type: d.name,
        count: d._count.files,
      })),
      by_stage: by_stage.map((s) => ({
        stage_name: s.stage.name,
        count: s._count.files,
      })),
      by_user: by_user.map((u) => ({
        user_name: u.name,
        count: u._count.uploaded_files,
      })),
    };
  }
}
