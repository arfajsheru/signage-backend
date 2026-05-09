/*
  Warnings:

  - The primary key for the `BusinessType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BusinessType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ChannelPartner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ChannelPartner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `DocumentType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DocumentType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `channel_partner_id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProjectAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProjectAssignment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProjectStage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProjectStage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProjectWorkflow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProjectWorkflow` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StageApproval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StageApproval` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approved_by` column on the `StageApproval` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StageFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StageFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StageTypeMaster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StageTypeMaster` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Vendor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Vendor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `vendor_id` on the `ChannelPartner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendor_id` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `business_type_id` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_id` on the `ProjectAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `ProjectAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_id` on the `ProjectStage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stage_id` on the `ProjectStage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `ProjectStage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `business_type_id` on the `ProjectWorkflow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stage_id` on the `ProjectWorkflow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_stage_id` on the `StageApproval` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `project_stage_id` on the `StageFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `document_type_id` on the `StageFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uploaded_by` on the `StageFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendor_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ChannelPartner" DROP CONSTRAINT "ChannelPartner_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_business_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_channel_partner_id_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_created_by_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectWorkflow" DROP CONSTRAINT "ProjectWorkflow_business_type_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectWorkflow" DROP CONSTRAINT "ProjectWorkflow_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "StageApproval" DROP CONSTRAINT "StageApproval_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "StageApproval" DROP CONSTRAINT "StageApproval_project_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "StageFile" DROP CONSTRAINT "StageFile_document_type_id_fkey";

-- DropForeignKey
ALTER TABLE "StageFile" DROP CONSTRAINT "StageFile_project_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "StageFile" DROP CONSTRAINT "StageFile_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vendor_id_fkey";

-- AlterTable
ALTER TABLE "BusinessType" DROP CONSTRAINT "BusinessType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "BusinessType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChannelPartner" DROP CONSTRAINT "ChannelPartner_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendor_id",
ADD COLUMN     "vendor_id" INTEGER NOT NULL,
ADD CONSTRAINT "ChannelPartner_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DocumentType" DROP CONSTRAINT "DocumentType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendor_id",
ADD COLUMN     "vendor_id" INTEGER NOT NULL,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL,
DROP COLUMN "business_type_id",
ADD COLUMN     "business_type_id" INTEGER NOT NULL,
DROP COLUMN "channel_partner_id",
ADD COLUMN     "channel_partner_id" INTEGER,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "ProjectAssignment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER NOT NULL,
DROP COLUMN "stage_id",
ADD COLUMN     "stage_id" INTEGER NOT NULL,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectWorkflow" DROP CONSTRAINT "ProjectWorkflow_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "business_type_id",
ADD COLUMN     "business_type_id" INTEGER NOT NULL,
DROP COLUMN "stage_id",
ADD COLUMN     "stage_id" INTEGER NOT NULL,
ADD CONSTRAINT "ProjectWorkflow_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StageApproval" DROP CONSTRAINT "StageApproval_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "project_stage_id",
ADD COLUMN     "project_stage_id" INTEGER NOT NULL,
DROP COLUMN "approved_by",
ADD COLUMN     "approved_by" INTEGER,
ADD CONSTRAINT "StageApproval_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StageFile" DROP CONSTRAINT "StageFile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "project_stage_id",
ADD COLUMN     "project_stage_id" INTEGER NOT NULL,
DROP COLUMN "document_type_id",
ADD COLUMN     "document_type_id" INTEGER NOT NULL,
DROP COLUMN "uploaded_by",
ADD COLUMN     "uploaded_by" INTEGER NOT NULL,
ADD CONSTRAINT "StageFile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StageTypeMaster" DROP CONSTRAINT "StageTypeMaster_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StageTypeMaster_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendor_id",
ADD COLUMN     "vendor_id" INTEGER NOT NULL,
DROP COLUMN "role_id",
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "ChannelPartner_vendor_id_idx" ON "ChannelPartner"("vendor_id");

-- CreateIndex
CREATE INDEX "Project_vendor_id_idx" ON "Project"("vendor_id");

-- CreateIndex
CREATE INDEX "Project_business_type_id_idx" ON "Project"("business_type_id");

-- CreateIndex
CREATE INDEX "Project_channel_partner_id_idx" ON "Project"("channel_partner_id");

-- CreateIndex
CREATE INDEX "Project_created_by_idx" ON "Project"("created_by");

-- CreateIndex
CREATE INDEX "ProjectAssignment_user_id_idx" ON "ProjectAssignment"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAssignment_project_id_user_id_key" ON "ProjectAssignment"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "ProjectStage_project_id_idx" ON "ProjectStage"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectWorkflow_business_type_id_sequence_key" ON "ProjectWorkflow"("business_type_id", "sequence");

-- CreateIndex
CREATE INDEX "StageFile_project_stage_id_idx" ON "StageFile"("project_stage_id");

-- CreateIndex
CREATE INDEX "StageFile_document_type_id_idx" ON "StageFile"("document_type_id");

-- CreateIndex
CREATE INDEX "User_vendor_id_idx" ON "User"("vendor_id");

-- CreateIndex
CREATE INDEX "User_role_id_idx" ON "User"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_vendor_id_email_key" ON "User"("vendor_id", "email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelPartner" ADD CONSTRAINT "ChannelPartner_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_business_type_id_fkey" FOREIGN KEY ("business_type_id") REFERENCES "BusinessType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_channel_partner_id_fkey" FOREIGN KEY ("channel_partner_id") REFERENCES "ChannelPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
