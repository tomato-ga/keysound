-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "partId" TEXT;

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "case" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "plate" TEXT NOT NULL,
    "switches" TEXT NOT NULL,
    "keyCaps" TEXT NOT NULL,
    "mount" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_postId_key" ON "Part"("postId");

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
