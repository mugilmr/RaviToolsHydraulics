"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not sign in.");
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-sm p-6 sm:p-8">
      <h1 className="mb-1 text-xl text-charcoal-800">Owner sign in</h1>
      <p className="mb-6 text-sm text-charcoal-500">Manage the catalog, orders and enquiries.</p>

      {error && (
        <div className="mb-4 rounded-md bg-safety-50 p-3 text-sm text-safety-700">{error}</div>
      )}

      <label className="label" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        required
        className="input mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />

      <label className="label" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        required
        className="input mb-6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
