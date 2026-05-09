import { PrismaClient } from '@prisma/client';
import { CreateUserInput, UpdateUserInput, UserQueryFilters, LoginInput } from './user.types.js';
import { hashPassword, comparePassword, generateToken } from '../../utils/auth.js';
import { NotFoundError, ValidationError, UnauthorizedError } from '../../utils/errors.js';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new user (Register)
   */
  async create(data: CreateUserInput) {
    // Check if email or phone exists for this vendor
    const existing = await this.prisma.user.findFirst({
      where: { 
        vendor_id: data.vendor_id,
        OR: [
          { email: data.email.toLowerCase() },
          ...(data.phone ? [{ phone: data.phone }] : [])
        ]
      }
    });

    if (existing) {
      const conflict = existing.email === data.email.toLowerCase() ? 'email' : 'phone number';
      throw new ValidationError(`User with this ${conflict} already exists in this company`);
    }

    const hashedPassword = await hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role_id: true,
        vendor_id: true,
        is_active: true,
        created_at: true
      }
    });
  }

  /**
   * User Login
   */
  async login(data: LoginInput) {
    const { identifier, password } = data;
    const lowerIdentifier = identifier.toLowerCase();

    const user = await this.prisma.user.findFirst({
      where: { 
        is_active: true,
        OR: [
          { email: lowerIdentifier },
          { phone: identifier }
        ]
      },
      include: {
        role: true,
        vendor: true
      }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials or account inactive');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      vendor_id: user.vendor_id,
      role: user.role.name
    });

    return {
      user: {
        user_id: user.id,
        vendor_id: user.vendor_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.role.name,
        vendor_name: user.vendor.name
      },
      token
    };
  }

  /**
   * Get all users with filters
   */
  async findAll(filters: UserQueryFilters) {
    const page = parseInt(filters.page || '1', 10);
    const limit = parseInt(filters.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.vendor_id) where.vendor_id = filters.vendor_id;
    if (filters.role_id) where.role_id = filters.role_id;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true
        },
        orderBy: { created_at: 'desc' }
      })
    ]);

    return { users, total, page, limit };
  }

  /**
   * Get single user
   */
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true, vendor: true }
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  /**
   * Update user
   */
  async update(id: number, data: UpdateUserInput) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        is_active: true
      }
    });
  }
}
