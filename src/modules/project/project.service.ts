import { PrismaClient, ProjectStatus } from "@prisma/client";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryFilters,
  ProjectStats,
} from "./project.types.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  async create(vendorId: number, userId: number, data: CreateProjectInput) {
    // 1. Validate Business Type
    const businessType = await this.prisma.businessType.findUnique({
      where: { id: data.business_type_id },
    });
    if (!businessType) throw new ValidationError("Invalid business type");

    // 2. Validate Channel Partner (if provided)
    if (data.channel_partner_id) {
      const partner = await this.prisma.channelPartner.findFirst({
        where: { id: data.channel_partner_id, vendor_id: vendorId },
      });
      if (!partner)
        throw new ValidationError("Invalid channel partner for this vendor");
    }

    return this.prisma.project.create({
      data: {
        ...data,
        vendor_id: vendorId,
        created_by: userId,
        status: ProjectStatus.CREATED,
        total_amount: data.total_amount || 0,
        advance_paid: data.advance_paid || 0,
        deadline: data.deadline ? new Date(data.deadline) : null,
        is_active: true,
      },
      include: {
        business_type: true,
        channel_partner: true,
        created_by_user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findAll(vendorId: number, filters: ProjectQueryFilters) {
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      vendor_id: vendorId,
      is_active: true,
    };

    if (filters.status) where.status = filters.status;
    if (filters.business_type_id)
      where.business_type_id = filters.business_type_id;
    if (filters.channel_partner_id)
      where.channel_partner_id = filters.channel_partner_id;
    if (filters.created_by) where.created_by = filters.created_by;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        {
          business_type: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
        {
          channel_partner: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
      ];
    }

    const orderBy: any = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || "desc";
    } else {
      orderBy.created_at = "desc";
    }

    const [total, projects] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          business_type: true,
          channel_partner: true,
          created_by_user: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { assignments: true, stages: true },
          },
        },
        orderBy,
      }),
    ]);

    return { projects, total, page, limit };
  }

  async findById(vendorId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, vendor_id: vendorId, is_active: true },
      include: {
        business_type: true,
        channel_partner: true,
        created_by_user: {
          select: { id: true, name: true, email: true },
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        stages: {
          include: {
            stage: true,
          },
          orderBy: { created_at: "asc" },
        },
      },
    });

    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async getFullDetails(vendorId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, vendor_id: vendorId, is_active: true },
      include: {
        business_type: true,
        channel_partner: true,
        created_by_user: {
          select: { id: true, name: true, email: true },
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        stages: {
          include: {
            stage: true,
            created_user: { select: { id: true, name: true } },
            files: {
              include: {
                document_type: true,
                uploaded_user: { select: { id: true, name: true } },
              },
            },
            approvals: {
              include: {
                approved_user: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { created_at: "asc" },
        },
      },
    });

    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async update(vendorId: number, id: number, data: UpdateProjectInput) {
    const existing = await this.findById(vendorId, id);

    // Validate Business Type if changing
    if (data.business_type_id) {
      const businessType = await this.prisma.businessType.findUnique({
        where: { id: data.business_type_id },
      });
      if (!businessType) throw new ValidationError("Invalid business type");
    }

    // Validate Channel Partner if changing
    if (data.channel_partner_id) {
      const partner = await this.prisma.channelPartner.findFirst({
        where: { id: data.channel_partner_id, vendor_id: vendorId },
      });
      if (!partner)
        throw new ValidationError("Invalid channel partner for this vendor");
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
      include: {
        business_type: true,
        channel_partner: true,
      },
    });
  }

  async updateStatus(vendorId: number, id: number, status: ProjectStatus) {
    await this.findById(vendorId, id);
    return this.prisma.project.update({
      where: { id },
      data: { status },
    });
  }

  async softDelete(vendorId: number, id: number) {
    await this.findById(vendorId, id);
    return this.prisma.project.update({
      where: { id },
      data: { is_active: false },
    });
  }

  async search(vendorId: number, query: string) {
    return this.prisma.project.findMany({
      where: {
        vendor_id: vendorId,
        is_active: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { business_type: { name: { contains: query, mode: "insensitive" } } },
          {
            channel_partner: { name: { contains: query, mode: "insensitive" } },
          },
        ],
      },
      include: {
        business_type: true,
        channel_partner: true,
      },
      take: 20,
    });
  }

  async getStats(vendorId: number): Promise<ProjectStats> {
    const now = new Date();

    const [total, active, completed, delayed, signage, print] =
      await Promise.all([
        this.prisma.project.count({
          where: { vendor_id: vendorId, is_active: true },
        }),
        this.prisma.project.count({
          where: {
            vendor_id: vendorId,
            is_active: true,
            status: ProjectStatus.ACTIVE,
          },
        }),
        this.prisma.project.count({
          where: {
            vendor_id: vendorId,
            is_active: true,
            status: ProjectStatus.COMPLETED,
          },
        }),
        this.prisma.project.count({
          where: {
            vendor_id: vendorId,
            is_active: true,
            deadline: { lt: now },
            status: { not: ProjectStatus.COMPLETED },
          },
        }),
        this.prisma.project.count({
          where: {
            vendor_id: vendorId,
            is_active: true,
            business_type: { name: "SIGNAGE" },
          },
        }),
        this.prisma.project.count({
          where: {
            vendor_id: vendorId,
            is_active: true,
            business_type: { name: "PRINT" },
          },
        }),
      ]);

    return { total, active, completed, delayed, signage, print };
  }
}
