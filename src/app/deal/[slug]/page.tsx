"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Deal, DealDeliverable } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PublicDealPage() {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [deliverables, setDeliverables] = useState<DealDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function loadDeal() {
      const { data } = await supabase
        .from("deals")
        .select("*, deal_deliverables(*)")
        .eq("share_slug", params.slug)
        .single();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Track view
      if (data.status === "sent") {
        await supabase
          .from("deals")
          .update({ status: "viewed", viewed_at: new Date().toISOString() })
          .eq("id", data.id);
        await supabase
          .from("deal_events")
          .insert({ deal_id: data.id, event_type: "viewed" });
        data.status = "viewed";

        // Send view notification email
        const { data: dealOwner } = await supabase
          .from("users")
          .select("email")
          .eq("id", data.user_id)
          .single();

        if (dealOwner?.email) {
          fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: dealOwner.email,
              subject: `👀 ${data.brand_name} just viewed your invoice`,
              html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                  <h2 style="color: #1E3A8A;">Good news!</h2>
                  <p><strong>${data.brand_name}</strong> just opened your invoice for "${data.title}".</p>
                  <p style="color: #666;">Amount: $${data.total_amount.toLocaleString()}</p>
                  <a href="${window.location.origin}/deals/${data.id}" style="display: inline-block; background: #1E3A8A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Deal</a>
                </div>
              `,
            }),
          }).catch((err) => console.error("Failed to send notification:", err));
        }
      }

      setDeal(data);
      setDeliverables(data.deal_deliverables || []);
      setLoading(false);
    }
    loadDeal();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  if (notFound)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">Deal not found</p>
          <p className="text-gray-500 mt-2">
            This link may have expired or been removed.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">ClipInvoice</h1>
          <p className="text-gray-400 text-sm mt-1">Brand Deal Proposal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* Status */}
          {deal!.status === "paid" && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-center">
              <p className="text-green-700 font-semibold">
                ✓ This deal has been paid
              </p>
            </div>
          )}

          {/* Brand + title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {deal!.brand_name}
            </h2>
            <p className="text-gray-500 mt-0.5">{deal!.title}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(deal!.created_at)}
            </p>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 rounded-xl px-6 py-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-4xl font-bold text-gray-900">
              {formatCurrency(deal!.total_amount)}
            </p>
          </div>

          {/* Deliverables */}
          {deliverables.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Deliverables
              </p>
              <div className="space-y-2">
                {deliverables.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-sm text-gray-700">
                      {d.description}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      x{d.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs text-gray-400 text-center">
              Sent via ClipInvoice · Questions? Reply to the email you received
              this from.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          Powered by ClipInvoice
        </p>
      </div>
    </div>
  );
}
