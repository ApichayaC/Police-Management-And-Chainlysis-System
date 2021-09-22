-- AlterTable
ALTER TABLE "DataSnapshot" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "loadedPages" INTEGER NOT NULL DEFAULT 0;
