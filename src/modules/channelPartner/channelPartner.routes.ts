import { FastifyInstance } from "fastify";
import { ChannelPartnerController } from "./channelPartner.controller.js";
import { ChannelPartnerService } from "./channelPartner.service.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  createChannelPartnerSchema,
  updateChannelPartnerSchema,
  channelPartnerQuerySchema,
} from "./channelPartner.schema.js";

export default async function channelPartnerRoutes(fastify: FastifyInstance) {
  const service = new ChannelPartnerService(fastify.prisma);
  const controller = new ChannelPartnerController(service);

  fastify.post("/", { schema: createChannelPartnerSchema }, controller.create);
  fastify.get("/", { schema: channelPartnerQuerySchema }, controller.getAll);
  fastify.get("/:id", controller.getOne);
  fastify.put("/:id", { schema: updateChannelPartnerSchema }, controller.update);
  fastify.delete("/:id", controller.delete);
}
