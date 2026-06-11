"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function SignupPage() {
  const [signedUp, setSignedUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSignup() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://clipinvoice.vercel.app/dashboard",
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If user already exists, Supabase returns a user with no session
    // and identities array is empty
    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      setError(
        "An account with this email already exists. Try signing in instead.",
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        name,
      });
    }

    setLoading(false);
    setSignedUp(true);
  }

  if (signedUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account and start using ClipInvoice.
          </p>
          <Link
            href="/login"
            className="text-blue-900 text-sm font-medium hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-900">ClipInvoice</h1>
          <p className="text-gray-800 font-medium mt-1">
            Stop sending Word doc invoices.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            ClipInvoice makes brand deals professional in 2 minutes.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error.includes("already registered") ||
              error.includes("already exists")
                ? "An account with this email already exists. Try signing in instead."
                : error}
            </p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Try it instantly — free"}
          </button>

          <p className="text-center text-xs text-gray-400">
            No credit card required
          </p>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-900 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
