"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Deal } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserEmail(user.email || "");
      setUserId(user.id);

      const { data } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      setDeals(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleFeedback() {
    if (!feedback.trim()) return;
    setFeedbackLoading(true);

    await supabase.from("feedback").insert({
      user_id: userId,
      message: feedback.trim(),
    });

    setFeedbackSent(true);
    setFeedbackLoading(false);
    setFeedback("");
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSent(false);
    }, 2000);
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-900">
          ClipInvoice
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFeedback(true)}
            className="text-sm text-gray-500 hover:text-blue-900 font-medium transition"
          >
            💬 Feedback
          </button>
          <span className="text-sm text-gray-500">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md">
            {feedbackSent ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🙏</div>
                <p className="font-semibold text-gray-800">
                  Thanks for your feedback!
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  It really helps us improve.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Share your feedback
                  </h3>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  What&apos;s working? What&apos;s missing? We read everything.
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Type your feedback here..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-900 resize-none"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeedback}
                    disabled={feedbackLoading || !feedback.trim()}
                    className="flex-1 bg-blue-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                  >
                    {feedbackLoading ? "Sending..." : "Send Feedback"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Deals</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Track and manage your brand deals
            </p>
          </div>
          <Link
            href="/deals/new"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            + New Deal
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No deals yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Create your first brand deal and share it with a sponsor
            </p>
            <Link
              href="/deals/new"
              className="bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
            >
              + Create your first deal
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="block bg-white rounded-xl border border-gray-200 px-6 py-4 hover:border-blue-900 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {deal.brand_name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{deal.title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(deal.total_amount)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[deal.status]}`}
                    >
                      {deal.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(deal.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
