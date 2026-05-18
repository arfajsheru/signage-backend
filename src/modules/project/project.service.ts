import { PrismaClient, ProjectStatus, ProjectSource } from "@prisma/client";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectQueryFilters,
  ProjectStats,
  CreateProjectCategoryInput,
  ProjectCategoryQueryFilters,
} from "./project.types.js";
import { NotFoundError, ValidationError } from "../../utils/errors.js";

export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  async create(vendorId: number, userId: number, data: CreateProjectInput) {
    // Validate project source and required fields based on it
    const projectSource = data.project_source || "DIRECT";
    if (projectSource === "DIRECT") {
      if (!data.client_name || !data.client_name.trim()) {
        throw new ValidationError("Client name is required for direct projects");
      }
    } else if (projectSource === "CHANNEL_PARTNER") {
      if (!data.channel_partner_id) {
        throw new ValidationError("Channel partner is required for channel partner projects");
      }
    }

    // 1. Validate Business Type
    const businessType = await this.prisma.businessType.findUnique({
      where: { id: data.business_type_id },
    });
    if (!businessType) throw new ValidationError("Invalid business type");

    // Get Vendor for project code generation
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new ValidationError("Vendor not found");

    // Auto-generate project code if not provided
    let projectCode = data.project_code;
    if (!projectCode) {
      const vendorPrefix = vendor.name.substring(0, 3).toUpperCase();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      projectCode = `${vendorPrefix}-${randomNumber}`;
      
      // Ensure uniqueness
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 5) {
        const existing = await this.prisma.project.findUnique({
          where: { vendor_id_project_code: { vendor_id: vendorId, project_code: projectCode } },
        });
        if (!existing) {
          isUnique = true;
        } else {
          projectCode = `${vendorPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
          attempts++;
        }
      }
    }

    // 2. Validate Channel Partner (if provided)
    const channelPartnerId = data.channel_partner_id && data.channel_partner_id > 0 ? data.channel_partner_id : null;
    if (channelPartnerId) {
      const partner = await this.prisma.channelPartner.findFirst({
        where: { id: channelPartnerId, vendor_id: vendorId },
      });
      if (!partner)
        throw new ValidationError("Invalid channel partner for this vendor");
    }

    // 3. Validate Project Category (if provided)
    const projectCategoryId = data.project_category_id && data.project_category_id > 0 ? data.project_category_id : null;
    if (projectCategoryId) {
      const category = await this.prisma.projectCategory.findFirst({
        where: { id: projectCategoryId, business_type_id: data.business_type_id },
      });
      if (!category) throw new ValidationError("Invalid project category for this business type");
    }

    // 4. Validate Project Code uniqueness
    const existingProject = await this.prisma.project.findUnique({
      where: { vendor_id_project_code: { vendor_id: vendorId, project_code: projectCode } },
    });
    if (existingProject) throw new ValidationError("Project code already exists");

    return this.prisma.project.create({
      data: {
        ...data,
        channel_partner_id: channelPartnerId,
        project_category_id: projectCategoryId,
        project_code: projectCode,
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
        project_category: true,
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
    if (filters.project_category_id)
      where.project_category_id = filters.project_category_id;
    if (filters.priority) where.priority = filters.priority;
    if (filters.project_source) where.project_source = filters.project_source;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { project_code: { contains: filters.search, mode: "insensitive" } },
        { client_name: { contains: filters.search, mode: "insensitive" } },
        { client_phone: { contains: filters.search, mode: "insensitive" } },
        { site_address: { contains: filters.search, mode: "insensitive" } },
        { notes: { contains: filters.search, mode: "insensitive" } },
        {
          business_type: {
            name: { contains: filters.search, mode: "insensitive" },
          },
        },
        {
          project_category: {
            category_name: { contains: filters.search, mode: "insensitive" },
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
          project_category: true,
          current_stage: true,
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
        project_category: true,
        current_stage: true,
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
        project_category: true,
        current_stage: true,
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

    // Validate project source rules if changing source, client_name, or channel_partner_id
    const projectSource = data.project_source || existing.project_source;
    if (projectSource === "DIRECT") {
      const clientName = data.client_name !== undefined ? data.client_name : existing.client_name;
      if (!clientName || !clientName.trim()) {
        throw new ValidationError("Client name is required for direct projects");
      }
    } else if (projectSource === "CHANNEL_PARTNER") {
      const channelPartnerId = data.channel_partner_id !== undefined ? data.channel_partner_id : existing.channel_partner_id;
      if (!channelPartnerId) {
        throw new ValidationError("Channel partner is required for channel partner projects");
      }
    }

    // Validate Business Type if changing
    if (data.business_type_id) {
      const businessType = await this.prisma.businessType.findUnique({
        where: { id: data.business_type_id },
      });
      if (!businessType) throw new ValidationError("Invalid business type");
    }

    // Validate Channel Partner if changing
    const channelPartnerId = data.channel_partner_id !== undefined ? (data.channel_partner_id && data.channel_partner_id > 0 ? data.channel_partner_id : null) : undefined;
    if (channelPartnerId) {
      const partner = await this.prisma.channelPartner.findFirst({
        where: { id: channelPartnerId, vendor_id: vendorId },
      });
      if (!partner)
        throw new ValidationError("Invalid channel partner for this vendor");
    }

    // Validate Project Category if changing
    const projectCategoryId = data.project_category_id !== undefined ? (data.project_category_id && data.project_category_id > 0 ? data.project_category_id : null) : undefined;
    if (projectCategoryId) {
      const category = await this.prisma.projectCategory.findFirst({
        where: {
          id: projectCategoryId,
          business_type_id: data.business_type_id || existing.business_type_id,
        },
      });
      if (!category)
        throw new ValidationError("Invalid project category for this business type");
    }

    // Validate Project Code uniqueness if changing
    if (data.project_code && data.project_code !== existing.project_code) {
      const existingProject = await this.prisma.project.findUnique({
        where: { vendor_id_project_code: { vendor_id: vendorId, project_code: data.project_code } },
      });
      if (existingProject) throw new ValidationError("Project code already exists");
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        channel_partner_id: channelPartnerId,
        project_category_id: projectCategoryId,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
      include: {
        business_type: true,
        channel_partner: true,
        project_category: true,
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
          { project_code: { contains: query, mode: "insensitive" } },
          { client_name: { contains: query, mode: "insensitive" } },
          { business_type: { name: { contains: query, mode: "insensitive" } } },
          {
            channel_partner: { name: { contains: query, mode: "insensitive" } },
          },
        ],
      },
      include: {
        business_type: true,
        channel_partner: true,
        project_category: true,
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

  // --- Project Category APIs ---

  async getProjectCategories(filters: ProjectCategoryQueryFilters) {
    const where: any = {
      is_active: true,
    };

    if (filters.business_type_id) {
      where.business_type_id = filters.business_type_id;
    }

    if (filters.search) {
      where.category_name = { contains: filters.search, mode: "insensitive" };
    }

    return this.prisma.projectCategory.findMany({
      where,
      include: {
        business_type: true,
      },
      orderBy: { category_name: "asc" },
    });
  }

  async createProjectCategory(data: CreateProjectCategoryInput | CreateProjectCategoryInput[]) {
    if (Array.isArray(data)) {
      // Validate all business types first
      const businessTypeIds = [...new Set(data.map(d => d.business_type_id))];
      const businessTypes = await this.prisma.businessType.findMany({
        where: { id: { in: businessTypeIds } }
      });
      if (businessTypes.length !== businessTypeIds.length) {
        throw new ValidationError("One or more invalid business types provided");
      }

      // Check for existing categories to prevent unique constraint errors
      const existingCategories = await this.prisma.projectCategory.findMany({
        where: {
          OR: data.map(d => ({
            business_type_id: d.business_type_id,
            category_name: d.category_name
          }))
        }
      });

      if (existingCategories.length > 0) {
        const duplicates = existingCategories.map(c => `${c.category_name} (BT: ${c.business_type_id})`).join(', ');
        throw new ValidationError(`The following categories already exist: ${duplicates}`);
      }

      return this.prisma.$transaction(
        data.map((item) =>
          this.prisma.projectCategory.create({
            data: {
              business_type_id: item.business_type_id,
              category_name: item.category_name,
              is_active: true,
            },
          })
        )
      );
    } else {
      // Validate business type
      const businessType = await this.prisma.businessType.findUnique({
        where: { id: data.business_type_id },
      });
      if (!businessType) throw new ValidationError("Invalid business type");

      // Check if already exists
      const existing = await this.prisma.projectCategory.findUnique({
        where: {
          business_type_id_category_name: {
            business_type_id: data.business_type_id,
            category_name: data.category_name,
          }
        }
      });
      if (existing) throw new ValidationError("Category name already exists for this business type");

      return this.prisma.projectCategory.create({
        data: {
          business_type_id: data.business_type_id,
          category_name: data.category_name,
          is_active: true,
        },
      });
    }
  }
}
