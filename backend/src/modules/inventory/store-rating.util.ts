export function calculateStoreRating(
  productsCount: number,
  salesCount: number,
): number {
  if (productsCount <= 0 && salesCount <= 0) {
    return 0;
  }

  const productScore = Math.min(1, productsCount / 50);
  const salesScore = Math.min(1, Math.log10(salesCount + 1) / Math.log10(501));

  const combined = productScore * 0.35 + salesScore * 0.65;
  const rating = combined * 5;

  return Math.max(0.5, Math.round(rating * 2) / 2);
}
