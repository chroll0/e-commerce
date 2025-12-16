"use client";

import { Button } from "@/components";
import { useRouter, useParams } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale === "ka" ? "ka" : "en";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-600">Page not found</p>

      <Button onClick={() => router.push(`/${locale}`)}>Go Home</Button>
    </div>
  );
}
