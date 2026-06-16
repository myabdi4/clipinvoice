"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Deliverable = {
  description: string;
  quantity: number;
};

type Deal = {
  id: string;
  brand_name: string;
  title: string;
  total_amount: number;
  status: string;
  deliverables: Deliverable[];
  created_at: string;
};

export default function DemoPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showLimit, setShowLimit] = useState(false);
  const [showDeal, setShowDeal] = useState<Deal | null>(null);
  const [brandName, setBrandName] = useState("");
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [deliverables, setDeliverables] = useState([
    { description: "", quantity: 1 },
  ]);
  const router = useRouter();

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
  };

  function handleNewDeal() {
    if (deals.length >= 5) {
      setShowLimit(true);
      return;
    }
    setShowForm(true);
  }

  function addDeliverable() {
    setDeliverables([...deliverables, { description: "", quantity: 1 }]);
  }

  function updateDeliverable(
    index: number,
    field: string,
    value: string | number,
  ) {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDeliverables(updated);
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  function handleCreate() {
    if (!brandName || !title || !totalAmount) return;

    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      brand_name: brandName,
      title,
      total_amount: parseFloat(totalAmount),
      status: "draft",
      deliverables: deliverables.filter((d) => d.description.trim() !== ""),
      created_at: new Date().toISOString(),
    };

    setDeals([newDeal, ...deals]);
    setShowForm(false);
    setBrandName("");
    setTitle("");
    setTotalAmount("");
    setDeliverables([{ description: "", quantity: 1 }]);
  }

  function updateStatus(deal: Deal, status: string) {
    setDeals(deals.map((d) => (d.id === deal.id ? { ...d, status } : d)));
    setShowDeal({ ...deal, status });
  }

  const nextStatus: Record<string, string> = {
    draft: "sent",
    sent: "viewed",
    viewed: "paid",
  };

  const nextStatusLabel: Record<string, string> = {
    draft: "Mark as Sent",
    sent: "Mark as Viewed",
    viewed: "Mark as Paid ✓",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-yellow-400 px-4 py-2 text-center text-sm font-medium text-yellow-900">
        🎬 You are in demo mode — {5 - deals.length} invoice
        {5 - deals.length !== 1 ? "s" : ""} remaining.{" "}
        <Link href="/signup" className="underline font-bold">
          Sign up free
        </Link>{" "}
        to unlock unlimited invoices.
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/login" className="text-xl font-bold text-blue-900">
          ClipInvoice
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            Sign up free
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Demo Dashboard</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Try ClipInvoice — no account needed
            </p>
          </div>
          <button
            onClick={handleNewDeal}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            <span className="hidden sm:inline">+ New Deal</span>
            <span className="sm:hidden text-lg">+</span>
          </button>
        </div>

        {/* Empty state */}
        {deals.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Create your first demo deal
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Try the full experience — no account needed. Up to 5 invoices
              free.
            </p>
            <button
              onClick={handleNewDeal}
              className="bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
            >
              + Create your first deal
            </button>
          </div>
        )}

        {/* Deals list */}
        {deals.length > 0 && !showForm && !showDeal && (
          <div className="space-y-3">
            {deals.map((deal) => (
              <button
                key={deal.id}
                onClick={() => setShowDeal(deal)}
                className="w-full text-left block bg-white rounded-xl border border-gray-200 px-6 py-4 hover:border-blue-900 transition"
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
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">New Deal</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Nike, Samsung"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. April Integration Campaign"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount ($) *
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Deliverables
              </label>
              <div className="space-y-3">
                {deliverables.map((d, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={d.description}
                      onChange={(e) =>
                        updateDeliverable(index, "description", e.target.value)
                      }
                      placeholder="e.g. 1x YouTube integration video"
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
                    />
                    <input
                      type="number"
                      value={d.quantity}
                      onChange={(e) =>
                        updateDeliverable(
                          index,
                          "quantity",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-16 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                      min={1}
                    />
                    {deliverables.length > 1 && (
                      <button
                        onClick={() => removeDeliverable(index)}
                        className="text-gray-400 hover:text-red-500 px-2 py-2.5 text-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addDeliverable}
                className="mt-3 text-sm text-blue-900 font-medium hover:underline"
              >
                + Add deliverable
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="w-full bg-blue-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-800 transition"
            >
              Create Deal →
            </button>
          </div>
        )}

        {/* Deal detail */}
        {showDeal && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowDeal(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${statusColors[showDeal.status]}`}
              >
                {showDeal.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {showDeal.brand_name}
              </h2>
              <p className="text-gray-500 mt-0.5">{showDeal.title}</p>
            </div>

            <div className="bg-gray-50 rounded-xl px-6 py-4">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(showDeal.total_amount)}
              </p>
            </div>

            {showDeal.deliverables.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Deliverables
                </p>
                <div className="space-y-2">
                  {showDeal.deliverables.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-700">
                        {d.description}
                      </span>
                      <span className="text-sm text-gray-400">
                        x{d.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showDeal.status !== "paid" && (
              <button
                onClick={() =>
                  updateStatus(showDeal, nextStatus[showDeal.status])
                }
                className="w-full bg-green-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-green-700 transition"
              >
                {nextStatusLabel[showDeal.status]}
              </button>
            )}

            {showDeal.status === "paid" && (
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold text-lg">
                  ✓ Deal completed
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-900 font-medium mb-2">
                Want to share this with your sponsor?
              </p>
              <p className="text-xs text-blue-700 mb-3">
                Sign up free to get a shareable link, view tracking, and payment
                reminders.
              </p>
              <Link
                href="/signup"
                className="bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
              >
                Sign up free →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Limit modal */}
      {showLimit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              You've used all 5 demo invoices!
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Sign up free to create unlimited invoices, get shareable links,
              and track payments.
            </p>
            <Link
              href="/signup"
              className="block w-full bg-blue-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-800 transition mb-3"
            >
              Create free account →
            </Link>
            <button
              onClick={() => setShowLimit(false)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Continue browsing demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
