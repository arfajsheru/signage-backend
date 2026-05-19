-- CreateTable
CREATE TABLE "DxfExtraction" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "session_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'mm',
    "total_design_width" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_design_height" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_area" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_cutting_length" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_objects" INTEGER NOT NULL DEFAULT 0,
    "total_letters" INTEGER NOT NULL DEFAULT 0,
    "detected_layers" TEXT[],
    "raw_text" TEXT[],
    "warnings" TEXT[],
    "parsed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DxfExtraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DxfObject" (
    "id" SERIAL NOT NULL,
    "extraction_id" INTEGER NOT NULL,
    "object" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "layer" TEXT NOT NULL DEFAULT 'DEFAULT',
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "calculated_size" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "bbox_min_x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bbox_min_y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bbox_max_x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bbox_max_y" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cutting_length" DOUBLE PRECISION,
    "is_text" BOOLEAN NOT NULL DEFAULT false,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DxfObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DxfExtraction_session_id_key" ON "DxfExtraction"("session_id");

-- CreateIndex
CREATE INDEX "DxfExtraction_vendor_id_idx" ON "DxfExtraction"("vendor_id");

-- CreateIndex
CREATE INDEX "DxfExtraction_project_id_idx" ON "DxfExtraction"("project_id");

-- CreateIndex
CREATE INDEX "DxfExtraction_session_id_idx" ON "DxfExtraction"("session_id");

-- CreateIndex
CREATE INDEX "DxfObject_extraction_id_idx" ON "DxfObject"("extraction_id");

-- CreateIndex
CREATE INDEX "DxfObject_layer_idx" ON "DxfObject"("layer");

-- AddForeignKey
ALTER TABLE "DxfExtraction" ADD CONSTRAINT "DxfExtraction_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DxfExtraction" ADD CONSTRAINT "DxfExtraction_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DxfObject" ADD CONSTRAINT "DxfObject_extraction_id_fkey" FOREIGN KEY ("extraction_id") REFERENCES "DxfExtraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
