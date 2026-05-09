import { PrismaClient, ApprovalStatus } from '@prisma/client';
import { CreateStageApprovalInput, UpdateStageApprovalInput, StageApprovalQueryFilters, StageApprovalStats } from './stageApproval.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class StageApprovalService {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, data: CreateStageApprovalInput) {
    const stage = await this.prisma.projectStage.findUnique({
      where: { id: data.project_stage_id }
    });
    if (!stage) throw new ValidationError('Invalid project stage');

    return this.prisma.stageApproval.create({
      data: {
        ...data,
        approved_by: userId,
        approved_at: new Date()
      },
      include: {
        approved_user: { select: { id: true, name: true } }
      }
    });
  }

  async findAll(filters: StageApprovalQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.project_stage_id) where.project_stage_id = filters.project_stage_id;
    if (filters.approval_status) where.approval_status = filters.approval_status;
    if (filters.approved_by) where.approved_by = filters.approved_by;

    const [total, approvals] = await Promise.all([
      this.prisma.stageApproval.count({ where }),
      this.prisma.stageApproval.findMany({
        where,
        skip,
        take: limit,
        include: {
          project_stage: { include: { stage: true } },
          approved_user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    return { approvals, total, page, limit };
  }

  async findById(id: number) {
    const approval = await this.prisma.stageApproval.findUnique({
      where: { id },
      include: {
        project_stage: { include: { stage: true } },
        approved_user: { select: { id: true, name: true, email: true } }
      }
    });
    if (!approval) throw new NotFoundError('Stage approval record not found');
    return approval;
  }

  async findByStageId(projectStageId: number) {
    return this.prisma.stageApproval.findMany({
      where: { project_stage_id: projectStageId },
      include: {
        approved_user: { select: { id: true, name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async approve(id: number, userId: number) {
    await this.findById(id);
    return this.prisma.stageApproval.update({
      where: { id },
      data: {
        approval_status: ApprovalStatus.APPROVED,
        approved_by: userId,
        approved_at: new Date()
      }
    });
  }

  async reject(id: number, userId: number, remarks: string) {
    await this.findById(id);
    return this.prisma.stageApproval.update({
      where: { id },
      data: {
        approval_status: ApprovalStatus.REJECTED,
        remarks,
        approved_by: userId,
        approved_at: new Date()
      }
    });
  }

  async update(id: number, userId: number, data: UpdateStageApprovalInput) {
    await this.findById(id);
    return this.prisma.stageApproval.update({
      where: { id },
      data: {
        ...data,
        approved_by: userId,
        approved_at: new Date()
      }
    });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.stageApproval.delete({
      where: { id }
    });
  }

  async getTimeline(projectStageId: number) {
    return this.prisma.stageApproval.findMany({
      where: { project_stage_id: projectStageId },
      select: {
        id: true,
        approval_status: true,
        remarks: true,
        approved_at: true,
        created_at: true,
        approved_user: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getStats(): Promise<StageApprovalStats> {
    const [total, approved, rejected, pending] = await Promise.all([
      this.prisma.stageApproval.count(),
      this.prisma.stageApproval.count({ where: { approval_status: ApprovalStatus.APPROVED } }),
      this.prisma.stageApproval.count({ where: { approval_status: ApprovalStatus.REJECTED } }),
      this.prisma.stageApproval.count({ where: { approval_status: ApprovalStatus.PENDING } })
    ]);

    return { total, approved, rejected, pending };
  }
}
