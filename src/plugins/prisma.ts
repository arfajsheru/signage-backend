import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  
  const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn', 'query'],
  });

  try {
    await prisma.$connect();
    fastify.log.info('📦 Database connected successfully via PostgreSQL (Prisma 7 Adapter)');
    
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (server) => {
      await server.prisma.$disconnect();
      await pool.end();
    });
  } catch (error) { 
    fastify.log.error('❌ Database connection failed');
    fastify.log.error(error);
  }
});

export default prismaPlugin;
