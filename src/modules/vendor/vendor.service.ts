import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../utils/errors.js';

export interface CreateVendorInput {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  opening_balance?: number;
}

export interface UpdateVendorInput {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst_number?: string;
  pan_number?: string;
  opening_balance?: number;
  is_active?: boolean;
}

export class VendorService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new Vendor (Company/Business)
   */
  async create(data: CreateVendorInput) {
    const trimmedName = data.name.trim();

    // Check for duplicate name
    const existing = await this.prisma.vendor.findFirst({
      where: { 
        name: { equals: trimmedName, mode: 'insensitive' },
        is_active: true
      }
    });

    if (existing) {
      throw new Error(`Business with name "${trimmedName}" already exists`);
    }

    return this.prisma.vendor.create({
      data: {
        ...data,
        name: trimmedName,
        contact_person: data.contact_person?.trim(),
        phone: data.phone?.trim(),
        email: data.email?.toLowerCase().trim(),
        opening_balance: data.opening_balance || 0
      }
    });
  }

  /**
   * Get all vendors (Businesses)
   */
  async findAll(filters: { search?: string; page?: string; limit?: string }) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = { is_active: true };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [total, vendors] = await Promise.all([
      this.prisma.vendor.count({ where }),
      this.prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' }
      })
    ]);

    return { vendors, total, page, limit };
  }

  /**
   * Get single vendor details
   */
  async findById(id: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!vendor) throw new NotFoundError('Business not found');
    return vendor;
  }

  /**
   * Update vendor details
   */
  async update(id: number, data: UpdateVendorInput) {
    await this.findById(id);

    return this.prisma.vendor.update({
      where: { id },
      data: {
        ...data,
        name: data.name ? data.name.trim() : undefined,
        email: data.email ? data.email.toLowerCase().trim() : undefined
      }
    });
  }

  /**
   * Soft delete vendor
   */
  async delete(id: number) {
    await this.findById(id);
    return this.prisma.vendor.update({
      where: { id },
      data: { is_active: false }
    });
  }
}
