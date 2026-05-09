import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export class ProjectAssignmentService {
  constructor(private prisma: PrismaClient) {}

  async assignUser(vendorId: number, projectId: number, userId: number) {
    // 1. Verify project belongs to same vendor
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, vendor_id: vendorId }
    });
    if (!project) throw new NotFoundError('Project not found');

    // 2. Verify user belongs to same vendor
    const user = await this.prisma.user.findFirst({
      where: { id: userId, vendor_id: vendorId }
    });
    if (!user) throw new ValidationError('User does not belong to your company');

    // 3. Check if already assigned
    const existing = await this.prisma.projectAssignment.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId
        }
      }
    });
    if (existing) throw new ValidationError('User is already assigned to this project');

    return this.prisma.projectAssignment.create({
      data: { project_id: projectId, user_id: userId },
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });
  }

  async removeUser(vendorId: number, projectId: number, userId: number) {
    // Verify project belongs to vendor
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, vendor_id: vendorId }
    });
    if (!project) throw new NotFoundError('Project not found');

    return this.prisma.projectAssignment.delete({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId
        }
      }
    });
  }

  async getProjectUsers(vendorId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, vendor_id: vendorId }
    });
    if (!project) throw new NotFoundError('Project not found');

    return this.prisma.projectAssignment.findMany({
      where: { project_id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: { select: { name: true } } }
        }
      },
      orderBy: { assigned_at: 'desc' }
    });
  }
}
