import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class BusinessTypeService {
  constructor(private prisma: PrismaClient) {}

  async create(name: string) {
    const existing = await this.prisma.businessType.findUnique({
      where: { name: name.toUpperCase() }
    });

    if (existing) throw new ValidationError('Business type already exists');

    return this.prisma.businessType.create({
      data: { name: name.toUpperCase() }
    });
  }

  async findAll() {
    return this.prisma.businessType.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: number) {
    const type = await this.prisma.businessType.findUnique({ where: { id } });
    if (!type) throw new NotFoundError('Business type not found');
    return type;
  }

  async update(id: number, name: string) {
    await this.findById(id);
    return this.prisma.businessType.update({
      where: { id },
      data: { name: name.toUpperCase() }
    });
  }

  async delete(id: number) {
    const type = await this.prisma.businessType.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } }
    });

    if (!type) throw new NotFoundError('Business type not found');
    if (type._count.projects > 0) {
      throw new ValidationError('Cannot delete business type that is being used by projects');
    }

    return this.prisma.businessType.delete({ where: { id } });
  }
}
