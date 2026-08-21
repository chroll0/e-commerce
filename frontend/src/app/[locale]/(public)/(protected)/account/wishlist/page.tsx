import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Heart className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          Wishlist is coming soon
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We're working on this feature and it will be available soon. Thank you
          for your patience!
        </p>

        <span className="mt-5 rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
