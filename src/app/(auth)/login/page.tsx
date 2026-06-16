"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  async function handleResetPassword() {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setResetSent(true);
    setLoading(false);
  }

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-900">ClipInvoice</h1>
            <p className="text-gray-500 mt-1">Reset your password</p>
          </div>
          {resetSent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <p className="font-semibold text-gray-800">Check your email</p>
              <p className="text-gray-500 text-sm mt-2">
                We sent a reset link to <strong>{email}</strong>
              </p>
              <button
                onClick={() => {
                  setForgotPassword(false);
                  setResetSent(false);
                }}
                className="mt-6 text-sm text-blue-900 font-medium hover:underline"
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-blue-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={() => {
                  setForgotPassword(false);
                  setError("");
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-2xl font-bold">ClipInvoice</h1>
        </div>

        <div>
          <p className="text-white text-4xl font-bold leading-tight mb-4">
            Stop sending
            <br />
            Word doc invoices.
          </p>
          <p className="text-blue-200 text-lg mb-12">
            Built for YouTube editors. Not accountants.
          </p>

          {/* Two mock cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 - Paid */}
            <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-64">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">Nike</p>
                  <p className="text-gray-500 text-xs mt-0.5">April Campaign</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Paid
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                <p className="text-xl font-bold text-gray-900">$1,500.00</p>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                  <span>YouTube Integration</span>
                  <span className="text-gray-400">x1</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700 py-1">
                  <span>Instagram Stories</span>
                  <span className="text-gray-400">x2</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-2.5 py-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <p className="text-xs text-green-700 font-medium">
                  Marked as paid
                </p>
              </div>
            </div>

            {/* Card 2 - Viewed */}
            <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-64">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">Samsung</p>
                  <p className="text-gray-500 text-xs mt-0.5">Q2 Sponsorship</p>
                </div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Viewed
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs text-gray-500 mb-0.5">Total</p>
                <p className="text-xl font-bold text-gray-900">$800.00</p>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                  <span>Dedicated Video</span>
                  <span className="text-gray-400">x1</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700 py-1">
                  <span>Community Post</span>
                  <span className="text-gray-400">x1</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-50 rounded-lg px-2.5 py-1.5">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <p className="text-xs text-yellow-700 font-medium">
                  Brand just viewed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white text-sm font-medium mb-3">
              Why editors use ClipInvoice:
            </p>
            <div className="space-y-2">
              <p className="text-blue-200 text-sm">
                ✓ Create a professional invoice in under 2 minutes
              </p>
              <p className="text-blue-200 text-sm">
                ✓ Know the moment your sponsor opens it
              </p>
              <p className="text-blue-200 text-sm">
                ✓ No accounting clutter or spreadsheets
              </p>
              <p className="text-blue-200 text-sm">
                ✓ Free to start — no credit card needed
              </p>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <div>
              <p className="text-white font-bold text-xl">2 min</p>
              <p className="text-blue-300 text-xs">To send a deal</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">100%</p>
              <p className="text-blue-300 text-xs">Built for editors</p>
            </div>
            <div>
              <p className="text-white font-bold text-xl">$0</p>
              <p className="text-blue-300 text-xs">To get started</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-blue-900">ClipInvoice</h1>
            <p className="text-gray-500 text-sm mt-1">
              Stop sending Word doc invoices.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900 bg-white"
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
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900 bg-white"
              />
              <button
                onClick={() => {
                  setForgotPassword(true);
                  setError("");
                }}
                className="text-xs text-blue-900 hover:underline mt-1"
              >
                Forgot password?
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Google login */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                />
                <path
                  fill="#34A853"
                  d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"
                />
                <path
                  fill="#EA4335"
                  d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray.400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Link
              href="/demo"
              className="w-full flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg py-3 text-sm hover:bg-gray-100 transition"
            >
              <span className="font-medium text-gray-700">
                🎬 See it in action
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                No account required
              </span>
            </Link>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-900 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
