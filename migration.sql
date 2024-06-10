/*
  Warnings:

  - Added the required column `thumb_url` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "thumb_url" TEXT NOT NULL;
