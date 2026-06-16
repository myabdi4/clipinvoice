"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Deal, DealDeliverable } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DealDetailPage() {
  const [editing, setEditing] = useState(false);
  const [editBrandName, setEditBrandName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [deliverables, setDeliverables] = useState<DealDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function loadDeal() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("deals")
        .select("*, deal_deliverables(*)")
        .eq("id", params.id)
        .single();

      if (!data) {
        router.push("/dashboard");
        return;
      }

      setDeal(data);
      setDeliverables(data.deal_deliverables || []);
      setEditBrandName(data.brand_name);
      setEditTitle(data.title);
      setEditAmount(data.total_amount.toString());
      setEditDueDate(data.due_date ? data.due_date.split("T")[0] : "");
      setLoading(false);
    }
    loadDeal();
  }, []);

  async function updateStatus(status: string) {
    const updates: Record<string, string> = { status };
    if (status === "sent") updates.sent_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();

    await supabase.from("deals").update(updates).eq("id", deal!.id);
    await supabase
      .from("deal_events")
      .insert({ deal_id: deal!.id, event_type: status });
    setDeal({ ...deal!, ...updates } as Deal);
  }

  async function handleSave() {
    setSaving(true);
    await supabase
      .from("deals")
      .update({
        brand_name: editBrandName,
        title: editTitle,
        total_amount: parseFloat(editAmount),
        due_date: editDueDate || null,
      })
      .eq("id", deal!.id);

    setDeal({
      ...deal!,
      brand_name: editBrandName,
      title: editTitle,
      total_amount: parseFloat(editAmount),
      due_date: editDueDate || null,
    });
    setSaving(false);
    setEditing(false);
  }

  async function copyLink() {
    const link = `${window.location.origin}/deal/${deal!.share_slug}`;
    await navigator.clipboard.writeText(link);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
  };

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

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ClipInvoice"
            className="w-16 h-16 object-contain"
          />
          <span className="text-xl font-bold text-blue-900">ClipInvoice</span>
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to dashboard
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Deal header */}
        {/* Deal header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editBrandName}
                  onChange={(e) => setEditBrandName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-lg font-bold outline-none focus:border-blue-900"
                />
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-900"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-900"
                  placeholder="Amount"
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {deal!.brand_name}
                </h2>
                <p className="text-gray-500 mt-0.5">{deal!.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created {formatDate(deal!.created_at)}
                </p>
                {deal!.due_date && deal!.status !== "paid" && (
                  <p
                    className={`text-xs mt-1 font-medium ${new Date(deal!.due_date) < new Date() ? "text-red-500" : "text-gray-400"}`}
                  >
                    Due: {formatDate(deal!.due_date)}{" "}
                    {new Date(deal!.due_date) < new Date() ? "⚠️ Overdue" : ""}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-600 hover:text-blue-900 border border-gray-300 px-3 py-1.5 rounded-lg transition font-medium"
              >
                ✏️ Edit
              </button>
            )}
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${statusColors[deal!.status]}`}
            >
              {deal!.status}
            </span>
          </div>
        </div>

        {/* Deal card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Amount */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(deal!.total_amount)}
            </p>
          </div>

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Deliverables
              </p>
              <div className="space-y-2">
                {deliverables.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-700">
                      {d.description}
                    </span>
                    <span className="text-sm text-gray-400">x{d.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share link */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Share with brand
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/deal/${deal!.share_slug}`}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500"
              />
              <button
                onClick={copyLink}
                className="bg-blue-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
              >
                {copying ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Actions */}
          {deal!.status !== "paid" && (
            <button
              onClick={() => updateStatus(nextStatus[deal!.status])}
              className="w-full bg-green-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-green-700 transition"
            >
              {nextStatusLabel[deal!.status]}
            </button>
          )}

          {deal!.status === "paid" && (
            <div className="text-center py-4">
              <p className="text-green-600 font-semibold text-lg">
                ✓ Deal completed
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Paid on {deal!.paid_at ? formatDate(deal!.paid_at) : "—"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
