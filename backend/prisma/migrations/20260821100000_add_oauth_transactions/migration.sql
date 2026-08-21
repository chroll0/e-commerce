-- CreateTable
CREATE TABLE "OAuthTransaction" (
    "id" TEXT NOT NULL,
    "stateHash" TEXT NOT NULL,
    "provider" "AuthProviderType" NOT NULL,
    "locale" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthTransaction_stateHash_key" ON "OAuthTransaction"("stateHash");
CREATE INDEX "OAuthTransaction_expiresAt_idx" ON "OAuthTransaction"("expiresAt");
CREATE INDEX "OAuthTransaction_provider_consumedAt_idx" ON "OAuthTransaction"("provider", "consumedAt");