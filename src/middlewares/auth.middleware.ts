import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/auth.js';
import { UnauthorizedError } from '../utils/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      company_id: string;
      [key: string]: any;
    };
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.company_id) {
    throw new UnauthorizedError('Invalid token or missing company context');
  }

  request.user = decoded;
};
