"use client";

import { useState } from "react";
import { Button, Input } from "@/components";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      router.push("/auth/login");
      setMessage("Registered successfully!");
    } catch (err) {
      const error = err as AxiosError<any>;

      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

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

          <Button type="submit" variant="primary" fullWidth>
            Register
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-accent">{message}</p>
        )}

        <p className="text-sm text-secondary mt-6 text-center">
          Already have an account?
          <a href="/auth/login" className="text-highlight hover:underline ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
