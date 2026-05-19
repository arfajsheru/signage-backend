// ─── DXF Extraction Types ─────────────────────────────────────────────────────

export type DxfUnit = "mm" | "inch" | "feet" | "cm" | "unknown";

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ExtractedObject {
  id: number;
  object: string;         // Letter/shape name, e.g. "W", "circle_1"
  entityType: string;     // RAW DXF entity: TEXT, LWPOLYLINE, SPLINE, etc.
  layer: string;
  width: number;          // maxX - minX  (in mm after unit conversion)
  height: number;         // maxY - minY
  calculatedSize: number; // max(width, height)
  boundingBox: BoundingBox;
  quantity: number;       // default 1, user can edit
  isText: boolean;
  isGroup: boolean;
  svgPath?: string;       // SVG path string representing the clustered geometry
  // Cutting length for closed polylines
  cuttingLength?: number;
}

export interface DxfExtractionResult {
  sessionId: string;
  fileName: string;
  unit: DxfUnit;
  totalDesignWidth: number;
  totalDesignHeight: number;
  totalArea: number;
  totalCuttingLength: number;
  totalObjects: number;
  totalLetters: number;
  detectedLayers: string[];
  objects: ExtractedObject[];
  rawText: string[];         // All raw TEXT/MTEXT strings found
  warnings: string[];        // Edge-case warnings
  parsedAt: string;
}

// ─── Save/Update Payload (from Review Screen) ────────────────────────────────

export interface SaveDxfDataPayload {
  projectId?: number;             // optional: link to a project later
  sessionId: string;
  fileName: string;
  unit: DxfUnit;
  totalDesignWidth: number;
  totalDesignHeight: number;
  totalArea: number;
  totalCuttingLength: number;
  objects: SavedObject[];
}

export interface SavedObject {
  object: string;
  layer: string;
  width: number;
  height: number;
  calculatedSize: number;
  quantity: number;
  entityType: string;
}
