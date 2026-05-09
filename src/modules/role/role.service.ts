import { PrismaClient } from '@prisma/client';
import { CreateRoleInput, UpdateRoleInput, RoleQueryFilters } from './role.types.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class RoleService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRoleInput) {
    const name = data.name.toUpperCase().trim();
    
    const existing = await this.prisma.role.findUnique({
      where: { name }
    });

    if (existing) throw new ValidationError('Role already exists');

    return this.prisma.role.create({
      data: { name }
    });
  }

  async findAll(filters: RoleQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.search) {
      where.name = { contains: filters.search.toUpperCase(), mode: 'insensitive' };
    }

    const [total, roles] = await Promise.all([
      this.prisma.role.count({ where }),
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      })
    ]);

    return { roles, total, page, limit };
  }

  async findById(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundError('Role not found');
    return role;
  }

  async update(id: number, data: UpdateRoleInput) {
    await this.findById(id);
    const name = data.name.toUpperCase().trim();

    return this.prisma.role.update({
      where: { id },
      data: { name }
    });
  }

  async delete(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } }
    });

    if (!role) throw new NotFoundError('Role not found');
    if (role._count.users > 0) {
      throw new ValidationError('Cannot delete role that is assigned to users');
    }

    return this.prisma.role.delete({ where: { id } });
  }
}
