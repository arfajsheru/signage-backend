import { PrismaClient, ProjectStatus } from '@prisma/client';
import { CreateProjectInput, UpdateProjectInput, ProjectQueryFilters } from './project.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  async create(vendorId: string, userId: string, data: CreateProjectInput) {
    // Validate project type
    const type = await this.prisma.projectType.findUnique({
      where: { id: data.project_type_id }
    });
    if (!type) throw new ValidationError('Invalid project type');

    return this.prisma.project.create({
      data: {
        ...data,
        vendor_id: vendorId,
        created_by: userId,
        status: ProjectStatus.CREATED,
        total_amount: data.total_amount || 0,
        advance_paid: data.advance_paid || 0,
        deadline: data.deadline ? new Date(data.deadline) : null
      },
      include: {
        project_type: true,
        created_by_user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  async findAll(vendorId: string, filters: ProjectQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = { vendor_id: vendorId };

    if (filters.status) where.status = filters.status;
    if (filters.project_type_id) where.project_type_id = filters.project_type_id;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [total, projects] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          project_type: true,
          _count: { select: { assignments: true } }
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    return { projects, total, page, limit };
  }

  async findById(vendorId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, vendor_id: vendorId },
      include: {
        project_type: true,
        created_by_user: { select: { name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        }
      }
    });

    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async update(vendorId: string, id: string, data: UpdateProjectInput) {
    await this.findById(vendorId, id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined
      }
    });
  }

  async updateStatus(vendorId: string, id: string, status: ProjectStatus) {
    await this.findById(vendorId, id);
    return this.prisma.project.update({
      where: { id },
      data: { status }
    });
  }

  async delete(vendorId: string, id: string) {
    await this.findById(vendorId, id);
    // Hard delete project and its assignments (cascaded by DB or manual?)
    // Prisma usually handles relations via onDelete: Cascade in schema.
    // Let's check schema for ProjectAssignment
    return this.prisma.project.delete({ where: { id } });
  }
}
