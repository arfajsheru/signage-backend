import { FastifyInstance } from "fastify";
import { parseDxfFile, saveDxfData, getDxfSession } from "./dxf.controller.js";

export default async function dxfRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/dxf/parse
   * Accepts multipart/form-data with field name "file"
   * Returns: DxfExtractionResult
   */
  fastify.post("/parse", parseDxfFile);

  /**
   * POST /api/v1/dxf/save
   * Body: SaveDxfDataPayload (JSON)
   * Returns: confirmation with saved count
   */
  fastify.post("/save", saveDxfData);

  /**
   * GET /api/v1/dxf/session/:sessionId
   * Returns cached extraction result for the given session
   */
  fastify.get("/session/:sessionId", getDxfSession);
}
