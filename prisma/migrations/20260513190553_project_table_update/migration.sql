/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendor_id,project_code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[business_type_id,stage_id]` on the table `ProjectWorkflow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `StageTypeMaster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_code` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
ADD COLUMN     "client_email" TEXT,
ADD COLUMN     "client_name" TEXT NOT NULL,
ADD COLUMN     "client_phone" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" "ProjectPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "project_category_id" INTEGER,
ADD COLUMN     "project_code" TEXT NOT NULL,
ADD COLUMN     "site_address" TEXT,
ADD COLUMN     "site_map_link" TEXT;

-- AlterTable
ALTER TABLE "StageTypeMaster" ADD COLUMN     "code" TEXT;

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" SERIAL NOT NULL,
    "business_type_id" INTEGER NOT NULL,
    "category_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectCategory_business_type_id_idx" ON "ProjectCategory"("business_type_id");

-- CreateIndex
CREATE INDEX "ProjectCategory_category_name_idx" ON "ProjectCategory"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_business_type_id_category_name_key" ON "ProjectCategory"("business_type_id", "category_name");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "Project_project_code_idx" ON "Project"("project_code");

-- CreateIndex
CREATE INDEX "Project_client_name_idx" ON "Project"("client_name");

-- CreateIndex
CREATE INDEX "Project_project_category_id_idx" ON "Project"("project_category_id");

-- CreateIndex
CREATE INDEX "Project_deadline_idx" ON "Project"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "Project_vendor_id_project_code_key" ON "Project"("vendor_id", "project_code");

-- CreateIndex
CREATE INDEX "ProjectStage_stage_id_idx" ON "ProjectStage"("stage_id");

-- CreateIndex
CREATE INDEX "ProjectStage_status_idx" ON "ProjectStage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectWorkflow_business_type_id_stage_id_key" ON "ProjectWorkflow"("business_type_id", "stage_id");

-- CreateIndex
CREATE INDEX "StageApproval_project_stage_id_idx" ON "StageApproval"("project_stage_id");

-- CreateIndex
CREATE INDEX "StageApproval_approval_status_idx" ON "StageApproval"("approval_status");

-- CreateIndex
CREATE UNIQUE INDEX "StageTypeMaster_code_key" ON "StageTypeMaster"("code");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_project_category_id_fkey" FOREIGN KEY ("project_category_id") REFERENCES "ProjectCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCategory" ADD CONSTRAINT "ProjectCategory_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "BusinessType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
