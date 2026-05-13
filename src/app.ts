import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import prismaPlugin from "./plugins/prisma.js";
import multipart from "@fastify/multipart";
import appRoutes from "./routes/index.js";
import { errorResponse } from "./utils/response.js";
import { AppError } from "./utils/errors.js";

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  // 1. Swagger Configuration
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Signage CRM API",
        description: "Professional API documentation for Signage SaaS",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:5001" }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  // 2. Register Global Plugins
  await app.register(cors);
  await app.register(prismaPlugin);
  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // 3. Global Error Handler
  app.setErrorHandler((error: any, request, reply) => {
    app.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send(errorResponse(error.message));
    }

    const statusCode = error.statusCode || 500;
    const message = statusCode >= 500 ? "Internal Server Error" : error.message;

    reply.status(statusCode).send(
      errorResponse(
        message,
        process.env.NODE_ENV === "development" ? error.stack : undefined,
      ),
    );
  });

  // 4. Centralized Routes with api/v1 prefix
  // Isse ab saare routes /api/v1/... se start honge
  await app.register(appRoutes, { prefix: "/api/v1" });

  // Root Welcome Route (Always visible at http://localhost:5001/)
  app.get("/", async () => {
    return {
      success: true,
      message: "🚀 Signage Backend is LIVE bro!",
      api_base: "/api/v1",
      docs: "/docs",
      time: new Date().toLocaleTimeString(),
    };
  });

  return app;
};
