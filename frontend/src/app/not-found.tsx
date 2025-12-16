"use client";

import { Button } from "@/components";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center bg-foreground">
      <h1 className="text-7xl font-extrabold text-muted">404</h1>
      <p className="max-w-md text-md text-secondary">
        Sorry, we can&apos;t find the page you&apos;re looking for.
      </p>
      <Button
        variant="text"
        onClick={() => router.push("/")}
        className="text-muted"
      >
        Back to shop
      </Button>
    </div>
  );
}
