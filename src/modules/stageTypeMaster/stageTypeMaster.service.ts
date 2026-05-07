import { PrismaClient } from '@prisma/client';
import { CreateStageTypeInput, UpdateStageTypeInput, StageTypeQueryFilters } from './stageTypeMaster.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class StageTypeMasterService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateStageTypeInput) {
    const name = data.name.trim().toUpperCase();
    const stage_type = data.stage_type;

    // Check for existing
    const existing = await this.prisma.stageTypeMaster.findFirst({
      where: {
        OR: [{ name }, { stage_type }]
      }
    });

    if (existing) {
      if (existing.name === name) throw new ValidationError('Stage name already exists');
      if (existing.stage_type === stage_type) throw new ValidationError('Stage type number already exists');
    }

    return this.prisma.stageTypeMaster.create({
      data: {
        name,
        stage_type
      }
    });
  }

  async findAll(filters: StageTypeQueryFilters) {
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
      orderBy.stage_type = 'asc';
    }

    const [total, stageTypes] = await Promise.all([
      this.prisma.stageTypeMaster.count({ where }),
      this.prisma.stageTypeMaster.findMany({
        where,
        skip,
        take: limit,
        orderBy
      })
    ]);

    return { stageTypes, total, page, limit };
  }

  async findById(id: string) {
    const stageType = await this.prisma.stageTypeMaster.findUnique({
      where: { id }
    });
    if (!stageType) throw new NotFoundError('Stage type not found');
    return stageType;
  }

  async update(id: string, data: UpdateStageTypeInput) {
    await this.findById(id);

    const updateData: any = {};
    if (data.name) updateData.name = data.name.trim().toUpperCase();
    if (data.stage_type !== undefined) updateData.stage_type = data.stage_type;

    // Check for duplicates if updating
    if (updateData.name || updateData.stage_type !== undefined) {
      const existing = await this.prisma.stageTypeMaster.findFirst({
        where: {
          id: { not: id },
          OR: [
            updateData.name ? { name: updateData.name } : {},
            updateData.stage_type !== undefined ? { stage_type: updateData.stage_type } : {}
          ].filter(obj => Object.keys(obj).length > 0)
        }
      });

      if (existing) {
        if (updateData.name && existing.name === updateData.name) throw new ValidationError('Stage name already exists');
        if (updateData.stage_type !== undefined && existing.stage_type === updateData.stage_type) throw new ValidationError('Stage type number already exists');
      }
    }

    return this.prisma.stageTypeMaster.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    const stageType = await this.prisma.stageTypeMaster.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            workflows: true,
            project_stages: true
          }
        }
      }
    });

    if (!stageType) throw new NotFoundError('Stage type not found');

    if (stageType._count.workflows > 0 || stageType._count.project_stages > 0) {
      throw new ValidationError('Cannot delete stage type that is being used in workflows or projects');
    }

    return this.prisma.stageTypeMaster.delete({
      where: { id }
    });
  }

  async getDropdown() {
    return this.prisma.stageTypeMaster.findMany({
      select: {
        id: true,
        name: true,
        stage_type: true
      },
      orderBy: {
        stage_type: 'asc'
      }
    });
  }
}
