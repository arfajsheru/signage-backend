import { PrismaClient } from "@prisma/client";
import {
  CreateChannelPartnerInput,
  UpdateChannelPartnerInput,
  ChannelPartnerQueryFilters,
} from "./channelPartner.types.js";
import { NotFoundError } from "../../utils/errors.js";

export class ChannelPartnerService {
  constructor(private prisma: PrismaClient) {}

  async create(vendorId: number, data: CreateChannelPartnerInput) {
    return this.prisma.channelPartner.create({
      data: {
        ...data,
        vendor_id: vendorId,
      },
    });
  }

  async findAll(vendorId: number, filters: ChannelPartnerQueryFilters) {
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      vendor_id: vendorId,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { contact_person: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active;
    }

    const [total, partners] = await Promise.all([
      this.prisma.channelPartner.count({ where }),
      this.prisma.channelPartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
    ]);

    return { partners, total, page, limit };
  }

  async findById(vendorId: number, id: number) {
    const partner = await this.prisma.channelPartner.findFirst({
      where: { id, vendor_id: vendorId },
    });

    if (!partner) throw new NotFoundError("Channel Partner not found");
    return partner;
  }

  async update(vendorId: number, id: number, data: UpdateChannelPartnerInput) {
    await this.findById(vendorId, id);

    return this.prisma.channelPartner.update({
      where: { id },
      data,
    });
  }

  async delete(vendorId: number, id: number) {
    await this.findById(vendorId, id);

    return this.prisma.channelPartner.update({
      where: { id },
      data: { is_active: false },
    });
  }

  // Naya method pura data fetch karne ke liye based on vendorId
  async findAllForVendor(vendorId: number) {
    return this.prisma.channelPartner.findMany({
      where: { 
        vendor_id: vendorId,
        is_active: true 
      },
      orderBy: { name: "asc" },
    });
  }
}
