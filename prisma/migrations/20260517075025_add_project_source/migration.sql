-- CreateEnum
CREATE TYPE "ProjectSource" AS ENUM ('DIRECT', 'CHANNEL_PARTNER');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "project_source" "ProjectSource" NOT NULL DEFAULT 'DIRECT',
ALTER COLUMN "client_name" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Project_project_source_idx" ON "Project"("project_source");
