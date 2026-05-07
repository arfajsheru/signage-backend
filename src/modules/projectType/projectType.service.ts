import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class ProjectTypeService {
  constructor(private prisma: PrismaClient) {}

  async create(name: string) {
    const existing = await this.prisma.projectType.findUnique({
      where: { name: name.toUpperCase() }
    });

    if (existing) throw new ValidationError('Project type already exists');

    return this.prisma.projectType.create({
      data: { name: name.toUpperCase() }
    });
  }

  async findAll() {
    return this.prisma.projectType.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string) {
    const type = await this.prisma.projectType.findUnique({ where: { id } });
    if (!type) throw new NotFoundError('Project type not found');
    return type;
  }

  async update(id: string, name: string) {
    await this.findById(id);
    return this.prisma.projectType.update({
      where: { id },
      data: { name: name.toUpperCase() }
    });
  }

  async delete(id: string) {
    const type = await this.prisma.projectType.findUnique({
      where: { id },
      include: { _count: { select: { projects: true } } }
    });

    if (!type) throw new NotFoundError('Project type not found');
    if (type._count.projects > 0) {
      throw new ValidationError('Cannot delete project type that is being used by projects');
    }

    return this.prisma.projectType.delete({ where: { id } });
  }
}
