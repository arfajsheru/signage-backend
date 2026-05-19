/**
 * DXF Controller — handles HTTP requests for the DXF extraction module.
 */

import { FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { extractDxfData } from "./dxf.extractor.js";
import type { SaveDxfDataPayload } from "./dxf.types.js";

// In-memory session store (swap for Redis/DB in production)
// Key: sessionId → DxfExtractionResult
const sessionStore = new Map<string, any>();

// ─── Upload + Parse ───────────────────────────────────────────────────────────
export async function parseDxfFile(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const data = await request.file();
    if (!data) {
      return reply
        .status(400)
        .send({ success: false, message: "No file uploaded" });
    }

    const fileName = data.filename ?? "unknown.dxf";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext !== "dxf") {
      return reply
        .status(400)
        .send({ success: false, message: "Only .dxf files are supported" });
    }

    // Read buffer
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return reply
        .status(400)
        .send({ success: false, message: "Uploaded file is empty" });
    }

    const sessionId = uuidv4();
    const result = extractDxfData(buffer, fileName, sessionId);

    // Store session for later save
    sessionStore.set(sessionId, result);

    // Auto-expire after 30 min
    setTimeout(() => sessionStore.delete(sessionId), 30 * 60 * 1000);

    return reply.status(200).send({
      success: true,
      message: "DXF parsed successfully",
      data: result,
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: error.message ?? "DXF processing failed",
    });
  }
}

// ─── Save Reviewed Data ───────────────────────────────────────────────────────
export async function saveDxfData(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = request.body as SaveDxfDataPayload;

    if (!body.sessionId || !body.objects?.length) {
      return reply.status(400).send({
        success: false,
        message: "sessionId and objects are required",
      });
    }

    // TODO: Persist body to database via DxfService (Prisma model to be added)
    // For now, return the validated payload as confirmation
    sessionStore.delete(body.sessionId);

    return reply.status(200).send({
      success: true,
      message: "DXF data saved successfully",
      data: {
        sessionId: body.sessionId,
        savedObjects: body.objects.length,
        fileName: body.fileName,
        totalDesignWidth: body.totalDesignWidth,
        totalDesignHeight: body.totalDesignHeight,
        totalArea: body.totalArea,
        totalCuttingLength: body.totalCuttingLength,
        savedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    request.log.error(error);
    return reply.status(500).send({
      success: false,
      message: error.message ?? "Failed to save DXF data",
    });
  }
}

// ─── Get Session (optional — for reload) ────────────────────────────────────
export async function getDxfSession(
  request: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const { sessionId } = request.params;
  const session = sessionStore.get(sessionId);
  if (!session) {
    return reply.status(404).send({ success: false, message: "Session not found or expired" });
  }
  return reply.status(200).send({ success: true, data: session });
}
