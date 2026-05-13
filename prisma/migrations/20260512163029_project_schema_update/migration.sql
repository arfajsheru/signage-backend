-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "current_stage_id" INTEGER,
ADD COLUMN     "current_stage_status" "StageStatus",
ADD COLUMN     "last_stage_updated_at" TIMESTAMP(3),
ADD COLUMN     "progress_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Project_current_stage_id_idx" ON "Project"("current_stage_id");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_current_stage_id_fkey" FOREIGN KEY ("current_stage_id") REFERENCES "StageTypeMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
