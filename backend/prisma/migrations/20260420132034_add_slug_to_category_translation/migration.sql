/*
  Warnings:

  - A unique constraint covering the columns `[slug,locale]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CategoryTranslation" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_slug_locale_key" ON "CategoryTranslation"("slug", "locale");
