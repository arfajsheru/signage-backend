import { FastifySchema } from "fastify";

export const createChannelPartnerSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string" },
      contact_person: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      address: { type: "string" },
      gst_number: { type: "string" },
      opening_balance: { type: "number" },
      credit_limit: { type: "number" },
      payment_due_days: { type: "number" },
      notes: { type: "string" },
    },
  },
};

export const updateChannelPartnerSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      contact_person: { type: "string" },
      phone: { type: "string" },
      email: { type: "string", format: "email" },
      address: { type: "string" },
      gst_number: { type: "string" },
      opening_balance: { type: "number" },
      credit_limit: { type: "number" },
      payment_due_days: { type: "number" },
      notes: { type: "string" },
      is_active: { type: "boolean" },
    },
  },
};

export const channelPartnerQuerySchema: FastifySchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "string" },
      limit: { type: "string" },
      search: { type: "string" },
      is_active: { type: "boolean" },
    },
  },
};
