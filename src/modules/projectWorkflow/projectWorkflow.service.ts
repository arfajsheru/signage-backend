import { PrismaClient } from '@prisma/client';
import { 
  CreateProjectWorkflowInput, 
  UpdateProjectWorkflowInput, 
  ProjectWorkflowQueryFilters,
  ReorderWorkflowItem
} from './projectWorkflow.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class ProjectWorkflowService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProjectWorkflowInput) {
    // 1. Validate Business Type exists
    const businessType = await this.prisma.businessType.findUnique({
      where: { id: data.business_type_id }
    });
    if (!businessType) throw new ValidationError('Invalid business type');

    // 2. Validate Stage exists
    const stage = await this.prisma.stageTypeMaster.findUnique({
      where: { id: data.stage_id }
    });
    if (!stage) throw new ValidationError('Invalid stage type');

    // 3. Check for duplicates (sequence or stage) in same business type
    const existing = await this.prisma.projectWorkflow.findFirst({
      where: {
        business_type_id: data.business_type_id,
        OR: [
          { sequence: data.sequence },
          { stage_id: data.stage_id }
        ]
      }
    });

    if (existing) {
      if (existing.sequence === data.sequence) throw new ValidationError('Sequence already exists for this business type');
      if (existing.stage_id === data.stage_id) throw new ValidationError('Stage already added to this business type workflow');
    }

    return this.prisma.projectWorkflow.create({
      data,
      include: {
        business_type: true,
        stage: true
      }
    });
  }

  async findAll(filters: ProjectWorkflowQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.business_type_id) where.business_type_id = filters.business_type_id;

    const [total, workflows] = await Promise.all([
      this.prisma.projectWorkflow.count({ where }),
      this.prisma.projectWorkflow.findMany({
        where,
        skip,
        take: limit,
        include: {
          business_type: true,
          stage: true
        },
        orderBy: { sequence: 'asc' }
      })
    ]);

    return { workflows, total, page, limit };
  }

  async findById(id: string) {
    const workflow = await this.prisma.projectWorkflow.findUnique({
      where: { id },
      include: {
        business_type: true,
        stage: true
      }
    });
    if (!workflow) throw new NotFoundError('Workflow stage not found');
    return workflow;
  }

  async getByBusinessType(businessTypeId: string) {
    return this.prisma.projectWorkflow.findMany({
      where: { business_type_id: businessTypeId },
      include: {
        stage: true
      },
      orderBy: { sequence: 'asc' }
    });
  }

  async update(id: string, data: UpdateProjectWorkflowInput) {
    const current = await this.findById(id);

    const updateData: any = {};
    if (data.stage_id) {
      const stage = await this.prisma.stageTypeMaster.findUnique({ where: { id: data.stage_id } });
      if (!stage) throw new ValidationError('Invalid stage type');
      updateData.stage_id = data.stage_id;
    }
    if (data.sequence !== undefined) updateData.sequence = data.sequence;

    // Check for duplicates
    if (updateData.stage_id || updateData.sequence !== undefined) {
      const existing = await this.prisma.projectWorkflow.findFirst({
        where: {
          id: { not: id },
          business_type_id: current.business_type_id,
          OR: [
            updateData.sequence !== undefined ? { sequence: updateData.sequence } : {},
            updateData.stage_id ? { stage_id: updateData.stage_id } : {}
          ].filter(obj => Object.keys(obj).length > 0)
        }
      });

      if (existing) {
        if (updateData.sequence !== undefined && existing.sequence === updateData.sequence) 
          throw new ValidationError('Sequence already exists for this business type');
        if (updateData.stage_id && existing.stage_id === updateData.stage_id) 
          throw new ValidationError('Stage already added to this business type workflow');
      }
    }

    return this.prisma.projectWorkflow.update({
      where: { id },
      data: updateData,
      include: { stage: true }
    });
  }

  async reorder(items: ReorderWorkflowItem[]) {
    // 1. Validate all IDs and ensure same business type
    const workflows = await this.prisma.projectWorkflow.findMany({
      where: { id: { in: items.map(i => i.id) } }
    });

    if (workflows.length !== items.length) throw new ValidationError('Some workflow IDs are invalid');

    const businessTypeIds = new Set(workflows.map(w => w.business_type_id));
    if (businessTypeIds.size > 1) throw new ValidationError('All reorder items must belong to the same business type');

    const sequences = items.map(i => i.sequence);
    if (new Set(sequences).size !== sequences.length) throw new ValidationError('Duplicate sequences provided');

    // 2. Perform bulk update in transaction
    return this.prisma.$transaction(
      items.map(item => 
        this.prisma.projectWorkflow.update({
          where: { id: item.id },
          data: { sequence: item.sequence }
        })
      )
    );
  }

  async delete(id: string) {
    const workflow = await this.prisma.projectWorkflow.findUnique({
      where: { id }
    });

    if (!workflow) throw new NotFoundError('Workflow stage not found');

    // Check if being used in active project stages
    const projectsUsingThisStage = await this.prisma.project.count({
      where: {
        business_type_id: workflow.business_type_id,
        stages: {
          some: {
            stage_id: workflow.stage_id
          }
        }
      }
    });

    if (projectsUsingThisStage > 0) {
      throw new ValidationError('Cannot delete workflow stage that is already being used in active projects');
    }

    return this.prisma.projectWorkflow.delete({
      where: { id }
    });
  }

  async getDropdown(businessTypeId: string) {
    const workflows = await this.prisma.projectWorkflow.findMany({
      where: { business_type_id: businessTypeId },
      include: {
        stage: {
          select: { name: true }
        }
      },
      orderBy: { sequence: 'asc' }
    });

    return workflows.map(w => ({
      id: w.id,
      sequence: w.sequence,
      stage_id: w.stage_id,
      stage_name: w.stage.name
    }));
  }
}
