/*
  Warnings:

  - You are about to drop the column `mount` on the `Part` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Part` table. All the data in the column will be lost.
  - You are about to drop the column `partId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Part" DROP COLUMN "mount",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "partId";
