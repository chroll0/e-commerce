-- CreateTable
CREATE TABLE "ProductLabel" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKa" TEXT NOT NULL,

    CONSTRAINT "ProductLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOnLabel" (
    "productId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "ProductOnLabel_pkey" PRIMARY KEY ("productId","labelId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductLabel_slug_key" ON "ProductLabel"("slug");

-- CreateIndex
CREATE INDEX "ProductOnLabel_labelId_idx" ON "ProductOnLabel"("labelId");

-- AddForeignKey
ALTER TABLE "ProductOnLabel" ADD CONSTRAINT "ProductOnLabel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnLabel" ADD CONSTRAINT "ProductOnLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "ProductLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
