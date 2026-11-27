-- CreateEnum
CREATE TYPE "PaintStatus" AS ENUM ('UNPAINTED', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "Miniature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "faction" TEXT,
    "status" "PaintStatus" NOT NULL DEFAULT 'UNPAINTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Miniature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Miniature_userId_createdAt_idx" ON "Miniature"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Miniature" ADD CONSTRAINT "Miniature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
