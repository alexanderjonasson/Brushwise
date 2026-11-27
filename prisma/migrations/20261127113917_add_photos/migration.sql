-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "miniatureId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_miniatureId_createdAt_idx" ON "Photo"("miniatureId", "createdAt");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_miniatureId_fkey" FOREIGN KEY ("miniatureId") REFERENCES "Miniature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
