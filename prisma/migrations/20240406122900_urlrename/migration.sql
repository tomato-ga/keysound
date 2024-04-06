/*
  Warnings:

  - You are about to drop the column `dataUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "dataUrl",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;
