/**
 * DXF Geometry Extractor — Letter Grouping Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Key change from v1:
 *   One visible letter can contain MANY DXF entities (outer path, inner holes,
 *   serifs, overlapping curves). This extractor groups all spatially-related
 *   entities into ONE object (one row per visible letter/shape) using a
 *   Union-Find spatial clustering algorithm.
 *
 * Algorithm:
 *   1. Parse DXF → flatten INSERT blocks.
 *   2. Compute bounding box for every entity.
 *   3. Cluster entities whose bounding boxes overlap (+ 2mm padding).
 *      → All curves/paths of one letter end up in ONE cluster.
 *   4. Merge each cluster's bounding boxes → letter dimensions.
 *   5. Assign label: TEXT content > informative layer name > "Letter_N".
 *   6. Sort clusters left-to-right by X position (reading order).
 *   7. Return one ExtractedObject per cluster.
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DxfParser: new () => { parseSync: (source: string) => any } =
  require("dxf-parser");

import type {
  BoundingBox,
  DxfExtractionResult,
  DxfUnit,
  ExtractedObject,
} from "./dxf.types.js";

// ─── Unit conversion ─────────────────────────────────────────────────────────
const UNIT_SCALE: Record<number, number> = { 0:1, 1:25.4, 2:304.8, 4:1, 5:10, 6:1000 };
const UNIT_LABEL: Record<number, DxfUnit> = { 0:"mm", 1:"inch", 2:"feet", 4:"mm", 5:"cm", 6:"mm" };

function getUnitScale(dxf: any): { scale: number; unit: DxfUnit } {
  const code = dxf?.header?.["$INSUNITS"] ?? dxf?.header?.["$MEASUREMENT"] ?? 0;
  return { scale: UNIT_SCALE[code] ?? 1, unit: UNIT_LABEL[code] ?? "mm" };
}

// ─── BBox helpers ─────────────────────────────────────────────────────────────
function emptyBBox(): BoundingBox {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}
function expandBBox(bb: BoundingBox, x: number, y: number): void {
  if (x < bb.minX) bb.minX = x; if (x > bb.maxX) bb.maxX = x;
  if (y < bb.minY) bb.minY = y; if (y > bb.maxY) bb.maxY = y;
}
function bboxValid(bb: BoundingBox): boolean { return bb.minX !== Infinity; }

function mergeBBoxes(bboxes: BoundingBox[]): BoundingBox {
  const out = emptyBBox();
  for (const b of bboxes) {
    expandBBox(out, b.minX, b.minY);
    expandBBox(out, b.maxX, b.maxY);
  }
  return out;
}

/** Two bboxes "overlap" if they intersect after padding each by `pad` units. */
function bboxOverlap(a: BoundingBox, b: BoundingBox, pad: number): boolean {
  return (
    a.minX - pad <= b.maxX + pad &&
    a.maxX + pad >= b.minX - pad &&
    a.minY - pad <= b.maxY + pad &&
    a.maxY + pad >= b.minY - pad
  );
}

// ─── Union-Find ───────────────────────────────────────────────────────────────
class UnionFind {
  private parent: number[];
  private rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(x: number, y: number): void {
    const px = this.find(x); const py = this.find(y);
    if (px === py) return;
    if (this.rank[px] < this.rank[py]) { this.parent[px] = py; }
    else if (this.rank[px] > this.rank[py]) { this.parent[py] = px; }
    else { this.parent[py] = px; this.rank[px]++; }
  }
}

function entityToSvgPath(entity: any, globalBBox: BoundingBox, scale: number): string {
  const tx = (x: number) => ((x - globalBBox.minX) * scale).toFixed(2);
  const ty = (y: number) => ((globalBBox.maxY - y) * scale).toFixed(2);

  switch (entity.type) {
    case "LINE": {
      const v = entity.vertices ?? [];
      if (v.length >= 2) {
        return `M ${tx(v[0].x)} ${ty(v[0].y)} L ${tx(v[1].x)} ${ty(v[1].y)}`;
      }
      if (entity.start && entity.end) {
        return `M ${tx(entity.start.x)} ${ty(entity.start.y)} L ${tx(entity.end.x)} ${ty(entity.end.y)}`;
      }
      break;
    }
    case "LWPOLYLINE":
    case "POLYLINE": {
      const v = entity.vertices ?? [];
      if (v.length === 0) return "";
      let path = `M ${tx(v[0].x)} ${ty(v[0].y)}`;
      for (let i = 1; i < v.length; i++) {
        path += ` L ${tx(v[i].x)} ${ty(v[i].y)}`;
      }
      if (entity.shape || entity.closed) {
        path += " Z";
      }
      return path;
    }
    case "CIRCLE": {
      const r = (entity.radius ?? 0) * scale;
      const cx = parseFloat(tx(entity.center?.x ?? 0));
      const cy = parseFloat(ty(entity.center?.y ?? 0));
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
    }
    case "ARC": {
      const r = (entity.radius ?? 0) * scale;
      const cx = entity.center?.x ?? 0;
      const cy = entity.center?.y ?? 0;
      const startAngle = (entity.startAngle ?? 0) * Math.PI / 180;
      const endAngle = (entity.endAngle ?? 0) * Math.PI / 180;
      
      const x1 = cx + (entity.radius ?? 0) * Math.cos(startAngle);
      const y1 = cy + (entity.radius ?? 0) * Math.sin(startAngle);
      const x2 = cx + (entity.radius ?? 0) * Math.cos(endAngle);
      const y2 = cy + (entity.radius ?? 0) * Math.sin(endAngle);

      const sX = tx(x1);
      const sY = ty(y1);
      const eX = tx(x2);
      const eY = ty(y2);

      const largeArc = (entity.angleLength ?? 0) > Math.PI ? 1 : 0;
      return `M ${sX} ${sY} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${largeArc} 0 ${eX} ${eY}`;
    }
    case "ELLIPSE": {
      const rx = Math.sqrt(
        Math.pow(entity.majorAxisEndPoint?.x ?? 0, 2) +
        Math.pow(entity.majorAxisEndPoint?.y ?? 0, 2)
      ) * scale;
      const ry = rx * (entity.axisRatio ?? 1);
      const cx = parseFloat(tx(entity.center?.x ?? 0));
      const cy = parseFloat(ty(entity.center?.y ?? 0));
      return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
    }
    case "SPLINE": {
      const pts = entity.controlPoints ?? entity.fitPoints ?? [];
      if (pts.length === 0) return "";
      let path = `M ${tx(pts[0].x)} ${ty(pts[0].y)}`;
      for (let i = 1; i < pts.length; i++) {
        path += ` L ${tx(pts[i].x)} ${ty(pts[i].y)}`;
      }
      return path;
    }
    case "SOLID":
    case "3DFACE": {
      const c1 = entity.corner1;
      const c2 = entity.corner2;
      const c3 = entity.corner3;
      const c4 = entity.corner4;
      if (!c1 || !c2 || !c3) return "";
      let p = `M ${tx(c1.x)} ${ty(c1.y)} L ${tx(c2.x)} ${ty(c2.y)} L ${tx(c3.x)} ${ty(c3.y)}`;
      if (c4) p += ` L ${tx(c4.x)} ${ty(c4.y)}`;
      return p + " Z";
    }
    default:
      break;
  }
  return "";
}

// ─── Per-entity bounding box ──────────────────────────────────────────────────
function entityBBox(entity: any): BoundingBox {
  const bb = emptyBBox();
  const ex = (pt: any) => { if (pt) expandBBox(bb, pt.x ?? 0, pt.y ?? 0); };

  switch (entity.type) {
    case "LINE":
      for (const v of entity.vertices ?? []) expandBBox(bb, v.x ?? 0, v.y ?? 0);
      ex(entity.start); ex(entity.end);
      break;
    case "LWPOLYLINE":
    case "POLYLINE":
      for (const v of entity.vertices ?? []) expandBBox(bb, v.x ?? 0, v.y ?? 0);
      break;
    case "CIRCLE": {
      const r = entity.radius ?? 0;
      const cx = entity.center?.x ?? 0; const cy = entity.center?.y ?? 0;
      expandBBox(bb, cx - r, cy - r); expandBBox(bb, cx + r, cy + r);
      break;
    }
    case "ARC": {
      const r = entity.radius ?? 0;
      const cx = entity.center?.x ?? 0; const cy = entity.center?.y ?? 0;
      for (const deg of [entity.startAngle ?? 0, entity.endAngle ?? 0, 0, 90, 180, 270]) {
        const rad = (deg * Math.PI) / 180;
        expandBBox(bb, cx + r * Math.cos(rad), cy + r * Math.sin(rad));
      }
      break;
    }
    case "ELLIPSE": {
      const cx = entity.center?.x ?? 0; const cy = entity.center?.y ?? 0;
      const rx = Math.sqrt(
        Math.pow(entity.majorAxisEndPoint?.x ?? 0, 2) +
        Math.pow(entity.majorAxisEndPoint?.y ?? 0, 2)
      );
      const ry = rx * (entity.axisRatio ?? 1);
      expandBBox(bb, cx - rx, cy - ry); expandBBox(bb, cx + rx, cy + ry);
      break;
    }
    case "SPLINE":
      for (const pt of entity.controlPoints ?? []) expandBBox(bb, pt.x ?? 0, pt.y ?? 0);
      for (const pt of entity.fitPoints ?? []) expandBBox(bb, pt.x ?? 0, pt.y ?? 0);
      break;
    case "TEXT":
    case "MTEXT": {
      const x = entity.insertionPoint?.x ?? entity.position?.x ?? entity.startPoint?.x ?? 0;
      const y = entity.insertionPoint?.y ?? entity.position?.y ?? entity.startPoint?.y ?? 0;
      const h = entity.textHeight ?? entity.height ?? 10;
      const w = (entity.text?.length ?? 1) * h * 0.6;
      expandBBox(bb, x, y); expandBBox(bb, x + w, y + h);
      break;
    }
    case "POINT":
      ex(entity.position ?? { x: entity.x, y: entity.y });
      break;
    case "SOLID":
    case "3DFACE":
      for (const c of ["corner1","corner2","corner3","corner4"]) ex(entity[c]);
      break;
    case "HATCH":
      for (const loop of entity.boundaryPaths ?? []) {
        for (const seg of loop.edges ?? []) { ex(seg.startPoint); ex(seg.endPoint); }
        for (const v of loop.vertices ?? []) expandBBox(bb, v.x, v.y);
      }
      break;
    default: break;
  }
  return bb;
}

// ─── Label assignment for a cluster ─────────────────────────────────────────
function assignLabel(indices: number[], entities: any[]): string {
  // Priority 1: TEXT or MTEXT entity content
  for (const i of indices) {
    const e = entities[i];
    if ((e.type === "TEXT" || e.type === "MTEXT") && e.text?.trim()) {
      return e.text.trim().slice(0, 50);
    }
  }
  // Priority 2: Block name (CorelDRAW often exports each letter as a named block)
  for (const i of indices) {
    const e = entities[i];
    if (e._blockName && e._blockName.length <= 5 && !/^\*/.test(e._blockName)) {
      return e._blockName;
    }
  }
  // Priority 3: Informative layer name (single char, or short alpha name, not "0")
  const layers = indices.map((i) => (entities[i].layer ?? "DEFAULT").trim());
  const unique = [...new Set(layers)];
  if (unique.length === 1) {
    const l = unique[0];
    if (l && l !== "0" && l !== "DEFAULT" && l.length <= 10 && /^[A-Za-z]/.test(l)) {
      return l;
    }
  }
  return ""; // will be replaced with "Letter_N" after sort
}

// ─── Main Extractor ───────────────────────────────────────────────────────────
export function extractDxfData(
  buffer: Buffer,
  fileName: string,
  sessionId: string
): DxfExtractionResult {
  const parser = new DxfParser();
  let dxf: any;
  try {
    dxf = parser.parseSync(buffer.toString("utf-8"));
  } catch {
    try { dxf = parser.parseSync(buffer.toString("latin1")); }
    catch (e: any) { throw new Error(`DXF parse failed: ${e.message}`); }
  }

  const { scale, unit } = getUnitScale(dxf);
  const rawEntities: any[] = dxf?.entities ?? [];
  const blocks: Record<string, any[]> = {};
  for (const [name, def] of Object.entries(dxf?.blocks ?? {})) {
    blocks[name] = (def as any).entities ?? [];
  }

  // ── Step 1: Flatten INSERT blocks ────────────────────────────────────────
  const flatEntities: any[] = [];
  for (const entity of rawEntities) {
    if (entity.type === "INSERT") {
      const blockEntities = blocks[entity.name] ?? [];
      const sx = entity.xScale ?? 1; const sy = entity.yScale ?? 1;
      const ox = entity.position?.x ?? entity.x ?? 0;
      const oy = entity.position?.y ?? entity.y ?? 0;
      for (const be of blockEntities) {
        const clone = JSON.parse(JSON.stringify(be));
        const tp = (pt: any) => pt ? { x: (pt.x ?? 0) * sx + ox, y: (pt.y ?? 0) * sy + oy } : pt;
        if (clone.vertices) clone.vertices = clone.vertices.map(tp);
        if (clone.center) clone.center = tp(clone.center);
        if (clone.insertionPoint) clone.insertionPoint = tp(clone.insertionPoint);
        if (clone.position) clone.position = tp(clone.position);
        if (clone.startPoint) clone.startPoint = tp(clone.startPoint);
        if (clone.start) clone.start = tp(clone.start);
        if (clone.end) clone.end = tp(clone.end);
        clone.layer = clone.layer ?? entity.layer ?? "DEFAULT";
        clone._blockName = entity.name;
        flatEntities.push(clone);
      }
    } else {
      flatEntities.push(entity);
    }
  }

  // ── Step 2: Compute bounding box per entity; filter invalid ─────────────
  const MIN_SIZE_MM = 0.1; // ignore sub-0.1mm point-like entities
  const validEntities: any[] = [];
  const bboxes: BoundingBox[] = [];
  const layerSet = new Set<string>();
  const warnings: string[] = [];

  for (const entity of flatEntities) {
    const layer = entity.layer ?? "DEFAULT";
    layerSet.add(layer);
    const bb = entityBBox(entity);
    if (!bboxValid(bb)) continue;
    const w = Math.abs(bb.maxX - bb.minX) * scale;
    const h = Math.abs(bb.maxY - bb.minY) * scale;
    if (w < MIN_SIZE_MM && h < MIN_SIZE_MM) continue; // sub-millimetre — skip
    // Store bbox in raw DXF coordinates (not scaled) — scale later
    validEntities.push(entity);
    bboxes.push(bb);
  }

  if (validEntities.length === 0) {
    warnings.push("No valid geometry found in this DXF file.");
  }

  // ── Step 3: Spatial clustering via Union-Find ────────────────────────────
  // Padding is adaptive: 2% of median entity height, min 1mm, max 5mm
  const heights = bboxes.map((b) => Math.abs(b.maxY - b.minY) * scale).sort((a, b) => a - b);
  const medianHeight = heights[Math.floor(heights.length / 2)] ?? 10;
  const PAD_MM = Math.min(Math.max(medianHeight * 0.02, 1), 5);
  const PAD = PAD_MM / scale; // convert padding to raw DXF units

  const uf = new UnionFind(validEntities.length);
  for (let i = 0; i < validEntities.length; i++) {
    for (let j = i + 1; j < validEntities.length; j++) {
      if (bboxOverlap(bboxes[i], bboxes[j], PAD)) {
        uf.union(i, j);
      }
    }
    if (validEntities.length > 500 && i % 100 === 0) {
      warnings.push(`Large DXF (${validEntities.length} entities) — clustering may be slower.`);
    }
  }

  // ── Step 4: Group indices by root ────────────────────────────────────────
  const groups = new Map<number, number[]>();
  for (let i = 0; i < validEntities.length; i++) {
    const root = uf.find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(i);
  }

  // ── Step 5: Build one ExtractedObject per cluster ────────────────────────
  const rawText: string[] = [];
  const objects: ExtractedObject[] = [];
  let objId = 1;

  // Global design bbox
  const globalBBox = mergeBBoxes(bboxes);

  for (const [, indices] of groups) {
    // Merge bboxes
    const clusterBB = mergeBBoxes(indices.map((i) => bboxes[i]));
    const width = parseFloat((Math.abs(clusterBB.maxX - clusterBB.minX) * scale).toFixed(3));
    const height = parseFloat((Math.abs(clusterBB.maxY - clusterBB.minY) * scale).toFixed(3));

    if (width === 0 && height === 0) {
      warnings.push(`Cluster of ${indices.length} entity/ies has zero size — skipped.`);
      continue;
    }

    const calculatedSize = parseFloat(Math.max(width, height).toFixed(3));

    // Most common layer in cluster
    const layerCounts: Record<string, number> = {};
    for (const i of indices) {
      const l = validEntities[i].layer ?? "DEFAULT";
      layerCounts[l] = (layerCounts[l] ?? 0) + 1;
    }
    const dominantLayer = Object.entries(layerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "DEFAULT";

    // Label
    const rawLabel = assignLabel(indices, validEntities);
    if (rawLabel) rawText.push(rawLabel);

    const isText = indices.some((i) =>
      validEntities[i].type === "TEXT" || validEntities[i].type === "MTEXT"
    );

    const svgPaths = indices
      .map((i) => entityToSvgPath(validEntities[i], globalBBox, scale))
      .filter((p) => p !== "")
      .join(" ");

    objects.push({
      id: objId++,
      object: rawLabel,                  // empty → will be filled after sort
      entityType: `cluster(${indices.length})`,
      layer: dominantLayer,
      width,
      height,
      calculatedSize,
      boundingBox: {
        minX: parseFloat((clusterBB.minX * scale).toFixed(3)),
        minY: parseFloat((clusterBB.minY * scale).toFixed(3)),
        maxX: parseFloat((clusterBB.maxX * scale).toFixed(3)),
        maxY: parseFloat((clusterBB.maxY * scale).toFixed(3)),
      },
      quantity: 1,
      isText,
      isGroup: indices.length > 1,
      svgPath: svgPaths,
    });
  }

  // ── Step 6: Sort left-to-right (reading order) and fill fallback labels ──
  objects.sort((a, b) => a.boundingBox.minX - b.boundingBox.minX);

  let letterIdx = 1;
  for (const obj of objects) {
    if (!obj.object) {
      obj.object = `Letter_${letterIdx++}`;
    }
  }

  // ── Global stats ────────────────────────────────────────────────────────
  const totalDesignWidth = bboxValid(globalBBox)
    ? parseFloat((Math.abs(globalBBox.maxX - globalBBox.minX) * scale).toFixed(3))
    : 0;
  const totalDesignHeight = bboxValid(globalBBox)
    ? parseFloat((Math.abs(globalBBox.maxY - globalBBox.minY) * scale).toFixed(3))
    : 0;
  const totalArea = parseFloat(((totalDesignWidth * totalDesignHeight) / 1_000_000).toFixed(6));

  return {
    sessionId,
    fileName,
    unit,
    totalDesignWidth,
    totalDesignHeight,
    totalArea,
    totalCuttingLength: 0,
    totalObjects: objects.length,
    totalLetters: objects.length,
    detectedLayers: [...layerSet],
    objects,
    rawText,
    warnings,
    parsedAt: new Date().toISOString(),
  };
}
