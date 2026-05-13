/*
  Warnings:

  - You are about to alter the column `opening_balance` on the `ChannelPartner` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `credit_limit` on the `ChannelPartner` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total_amount` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `advance_paid` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `opening_balance` on the `Vendor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ChannelPartner" ALTER COLUMN "opening_balance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "credit_limit" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "total_amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "advance_paid" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vendor" ALTER COLUMN "opening_balance" SET DATA TYPE DOUBLE PRECISION;
