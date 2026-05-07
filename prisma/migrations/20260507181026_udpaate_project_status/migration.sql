-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CREATED', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'CREATED';
