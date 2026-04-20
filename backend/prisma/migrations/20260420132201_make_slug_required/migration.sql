/*
  Warnings:

  - Made the column `slug` on table `CategoryTranslation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CategoryTranslation" ALTER COLUMN "slug" SET NOT NULL;
