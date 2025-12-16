"use client";

import { useState } from "react";
import { Button, Input } from "@/components";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<any>;
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            passwordToggle
            fullWidth
            required
          />

          <Button type="submit" variant="primary" fullWidth size="md">
            Login
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-accent">{message}</p>
        )}

        <p className="text-sm text-secondary mt-6 text-center">
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="text-highlight hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
