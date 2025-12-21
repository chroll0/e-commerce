import Link from "next/link";
import { Button } from "@/components";

export default function AccountEmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
        <h1 className="text-2xl font-bold text-primary text-center">Account</h1>

        <p className="mt-3 text-center text-secondary">You’re not logged in.</p>

        <div className="mt-6 flex gap-3">
          <Link className="w-full" href="/auth/login">
            <Button variant="primary" fullWidth>
              Sign In
            </Button>
          </Link>

          <Link className="w-full" href="/auth/register">
            <Button variant="secondary" fullWidth>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
