import { PrismaClient } from '@prisma/client';
import { CreateDocumentTypeInput, UpdateDocumentTypeInput, DocumentTypeQueryFilters } from './documentType.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class DocumentTypeService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateDocumentTypeInput) {
    const name = data.name.trim().toUpperCase();
    const document_type = data.document_type;

    // Check for duplicates
    const existing = await this.prisma.documentType.findFirst({
      where: {
        OR: [{ name }, { document_type }]
      }
    });

    if (existing) {
      if (existing.name === name) throw new ValidationError('Document type name already exists');
      if (existing.document_type === document_type) throw new ValidationError('Document type number already exists');
    }

    return this.prisma.documentType.create({
      data: {
        name,
        document_type
      }
    });
  }

  async findAll(filters: DocumentTypeQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.search) {
      where.name = { contains: filters.search.toUpperCase(), mode: 'insensitive' };
    }

    const orderBy: any = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.document_type = 'asc';
    }

    const [total, documentTypes] = await Promise.all([
      this.prisma.documentType.count({ where }),
      this.prisma.documentType.findMany({
        where,
        skip,
        take: limit,
        orderBy
      })
    ]);

    return { documentTypes, total, page, limit };
  }

  async findById(id: string) {
    const docType = await this.prisma.documentType.findUnique({
      where: { id }
    });
    if (!docType) throw new NotFoundError('Document type not found');
    return docType;
  }

  async update(id: string, data: UpdateDocumentTypeInput) {
    await this.findById(id);

    const updateData: any = {};
    if (data.name) updateData.name = data.name.trim().toUpperCase();
    if (data.document_type !== undefined) updateData.document_type = data.document_type;

    // Check for duplicates if updating
    if (updateData.name || updateData.document_type !== undefined) {
      const existing = await this.prisma.documentType.findFirst({
        where: {
          id: { not: id },
          OR: [
            updateData.name ? { name: updateData.name } : {},
            updateData.document_type !== undefined ? { document_type: updateData.document_type } : {}
          ].filter(obj => Object.keys(obj).length > 0)
        }
      });

      if (existing) {
        if (updateData.name && existing.name === updateData.name) throw new ValidationError('Document type name already exists');
        if (updateData.document_type !== undefined && existing.document_type === updateData.document_type) throw new ValidationError('Document type number already exists');
      }
    }

    return this.prisma.documentType.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    const docType = await this.prisma.documentType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { files: true }
        }
      }
    });

    if (!docType) throw new NotFoundError('Document type not found');

    if (docType._count.files > 0) {
      throw new ValidationError('Cannot delete document type that is already being used in project files');
    }

    return this.prisma.documentType.delete({
      where: { id }
    });
  }

  async getDropdown() {
    return this.prisma.documentType.findMany({
      select: {
        id: true,
        name: true,
        document_type: true
      },
      orderBy: {
        document_type: 'asc'
      }
    });
  }
}
