"use client";

import { Button } from "@/components";
import { useRouter } from "next/navigation";
export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600 text-lg">Page Not Found</p>
      <Button variant="primary" size="md" onClick={() => router.push("/")}>
        Go to Home
      </Button>
    </div>
  );
}
