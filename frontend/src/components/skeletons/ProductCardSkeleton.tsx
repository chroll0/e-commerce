export default function ProductCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`bg-linear-to-r from-card via-card-soft to-card animate-pulse rounded ${className}`}
    />
  );
}
