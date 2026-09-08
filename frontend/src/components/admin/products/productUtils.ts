export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function cleanImageUrls(images: string[]) {
  return images.map((x) => x.trim()).filter(Boolean);
}

export function resolvePrimaryImage(
  images: string[],
  primaryImage: string,
): string | null {
  if (primaryImage && images.includes(primaryImage)) return primaryImage;
  return images[0] ?? null;
}
