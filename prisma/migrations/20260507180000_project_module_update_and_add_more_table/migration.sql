/*
  Warnings:

  - You are about to drop the column `project_type_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `business_type_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_project_type_id_fkey";

-- DropIndex
DROP INDEX "Project_project_type_id_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "project_type_id",
DROP COLUMN "status",
ADD COLUMN     "business_type_id" TEXT NOT NULL,
ADD COLUMN     "channel_partner_id" TEXT;

-- DropTable
DROP TABLE "ProjectType";

-- DropEnum
DROP TYPE "ProjectStatus";

-- CreateTable
CREATE TABLE "ChannelPartner" (
    "id" TEXT NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "gst_number" TEXT,
    "opening_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "credit_limit" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payment_due_days" INTEGER,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageTypeMaster" (
    "id" TEXT NOT NULL,
    "stage_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageTypeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectWorkflow" (
    "id" TEXT NOT NULL,
    "business_type_id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "status" "StageStatus" NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "remarks" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" TEXT NOT NULL,
    "document_type" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageFile" (
    "id" TEXT NOT NULL,
    "project_stage_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "document_type_id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageApproval" (
    "id" TEXT NOT NULL,
    "project_stage_id" TEXT NOT NULL,
    "approval_status" "ApprovalStatus" NOT NULL,
    "remarks" TEXT,
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChannelPartner_vendor_id_idx" ON "ChannelPartner"("vendor_id");

-- CreateIndex
CREATE INDEX "ChannelPartner_name_idx" ON "ChannelPartner"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessType_name_key" ON "BusinessType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StageTypeMaster_stage_type_key" ON "StageTypeMaster"("stage_type");

-- CreateIndex
CREATE UNIQUE INDEX "StageTypeMaster_name_key" ON "StageTypeMaster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectWorkflow_business_type_id_sequence_key" ON "ProjectWorkflow"("business_type_id", "sequence");

-- CreateIndex
CREATE INDEX "ProjectStage_project_id_idx" ON "ProjectStage"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_document_type_key" ON "DocumentType"("document_type");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_name_key" ON "DocumentType"("name");

-- CreateIndex
CREATE INDEX "StageFile_project_stage_id_idx" ON "StageFile"("project_stage_id");

-- CreateIndex
CREATE INDEX "StageFile_document_type_id_idx" ON "StageFile"("document_type_id");

-- CreateIndex
CREATE INDEX "Project_business_type_id_idx" ON "Project"("business_type_id");

-- CreateIndex
CREATE INDEX "Project_channel_partner_id_idx" ON "Project"("channel_partner_id");

-- AddForeignKey
ALTER TABLE "ChannelPartner" ADD CONSTRAINT "ChannelPartner_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "BusinessType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_channel_partner_id_fkey" FOREIGN KEY ("channel_partner_id") REFERENCES "ChannelPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWorkflow" ADD CONSTRAINT "ProjectWorkflow_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "BusinessType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWorkflow" ADD CONSTRAINT "ProjectWorkflow_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "StageTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "StageTypeMaster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageFile" ADD CONSTRAINT "StageFile_project_stage_id_fkey" FOREIGN KEY ("project_stage_id") REFERENCES "ProjectStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageFile" ADD CONSTRAINT "StageFile_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageFile" ADD CONSTRAINT "StageFile_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageApproval" ADD CONSTRAINT "StageApproval_project_stage_id_fkey" FOREIGN KEY ("project_stage_id") REFERENCES "ProjectStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageApproval" ADD CONSTRAINT "StageApproval_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
