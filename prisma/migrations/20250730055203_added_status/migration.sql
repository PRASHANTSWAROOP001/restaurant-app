-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');

-- AlterTable
ALTER TABLE "StaffProfile" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
