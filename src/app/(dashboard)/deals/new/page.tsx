"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";

type Deliverable = {
  description: string;
  quantity: number;
  price: number | null;
};

export default function NewDealPage() {
  const [brandName, setBrandName] = useState("");
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { description: "", quantity: 1, price: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function addDeliverable() {
    setDeliverables([
      ...deliverables,
      { description: "", quantity: 1, price: null },
    ]);
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  function updateDeliverable(
    index: number,
    field: keyof Deliverable,
    value: string | number,
  ) {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDeliverables(updated);
  }

  async function handleCreate() {
    if (!brandName || !title || !totalAmount) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const slug = generateSlug();

    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .insert({
        user_id: user.id,
        brand_name: brandName,
        title,
        total_amount: parseFloat(totalAmount),
        status: "draft",
        share_slug: slug,
        due_date: dueDate || null,
      })
      .select()
      .single();

    if (dealError) {
      setError(dealError.message);
      setLoading(false);
      return;
    }

    // Insert deliverables
    const validDeliverables = deliverables.filter(
      (d) => d.description.trim() !== "",
    );
    if (validDeliverables.length > 0) {
      await supabase.from("deal_deliverables").insert(
        validDeliverables.map((d) => ({
          deal_id: deal.id,
          description: d.description,
          quantity: d.quantity,
          price: d.price,
        })),
      );
    }

    // Insert created event
    await supabase.from("deal_events").insert({
      deal_id: deal.id,
      event_type: "created",
    });

    router.push(`/deals/${deal.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New Deal</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Fill in the details and share with your sponsor
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Brand name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Nike, Samsung, Squarespace"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          {/* Deal title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. April Integration Campaign"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          {/* Total amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-900"
            />
          </div>

          {/* Deliverables */}
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-blue-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Creating deal..." : "Create Deal →"}
          </button>
        </div>
      </main>
    </div>
  );
}
