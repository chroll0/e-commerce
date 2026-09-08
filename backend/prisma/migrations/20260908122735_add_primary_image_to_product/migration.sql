-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "primaryImage" TEXT;

-- Backfill: default primaryImage to the first existing gallery image
UPDATE "Product" SET "primaryImage" = "images"[1] WHERE cardinality("images") > 0;
