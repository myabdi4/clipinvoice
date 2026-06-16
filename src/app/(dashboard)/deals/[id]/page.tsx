"use client";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

  async function downloadPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const navy = rgb(0.118, 0.227, 0.541);
    const green = rgb(0.02, 0.588, 0.412);
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.95, 0.95, 0.95);
    const darkText = rgb(0.1, 0.1, 0.1);

    const { width, height } = page.getSize();
    const margin = 50;

    // Header background
    page.drawRectangle({
      x: 0,
      y: height - 90,
      width,
      height: 90,
      color: navy,
    });

    // ClipInvoice branding
    page.drawText("ClipInvoice", {
      x: margin,
      y: height - 45,
      size: 22,
      font: boldFont,
      color: rgb(1, 1, 1),
    });
    page.drawText("BRAND DEAL INVOICE", {
      x: margin,
      y: height - 65,
      size: 8,
      font: boldFont,
      color: rgb(0.7, 0.8, 1),
    });

    // Status badge top right - only show for paid or viewed
    if (deal!.status === "paid" || deal!.status === "viewed") {
      const statusColor = deal!.status === "paid" ? green : rgb(0.8, 0.6, 0);
      page.drawRectangle({
        x: width - margin - 70,
        y: height - 60,
        width: 70,
        height: 22,
        color: statusColor,
        borderRadius: 4,
      });
      page.drawText(deal!.status.toUpperCase(), {
        x: width - margin - 70 + 10,
        y: height - 52,
        size: 8,
        font: boldFont,
        color: rgb(1, 1, 1),
      });
    }

    // Brand name + title
    page.drawText(deal!.brand_name, {
      x: margin,
      y: height - 130,
      size: 24,
      font: boldFont,
      color: darkText,
    });
    page.drawText(deal!.title, {
      x: margin,
      y: height - 155,
      size: 12,
      font,
      color: gray,
    });

    // Meta info
    page.drawText(`Created: ${formatDate(deal!.created_at)}`, {
      x: margin,
      y: height - 178,
      size: 9,
      font,
      color: gray,
    });
    if (deal!.due_date) {
      const isOverdue =
        new Date(deal!.due_date) < new Date() && deal!.status !== "paid";
      page.drawText(
        `Due: ${formatDate(deal!.due_date)}${isOverdue ? " — OVERDUE" : ""}`,
        {
          x: margin,
          y: height - 192,
          size: 9,
          font: boldFont,
          color: isOverdue ? rgb(0.8, 0.1, 0.1) : gray,
        },
      );
    }

    // Divider
    page.drawLine({
      start: { x: margin, y: height - 210 },
      end: { x: width - margin, y: height - 210 },
      thickness: 0.5,
      color: lightGray,
    });

    // Total amount box
    page.drawRectangle({
      x: margin,
      y: height - 285,
      width: width - margin * 2,
      height: 60,
      color: lightGray,
      borderRadius: 6,
    });
    page.drawText("TOTAL AMOUNT", {
      x: margin + 15,
      y: height - 243,
      size: 8,
      font: boldFont,
      color: gray,
    });
    page.drawText(
      `$${deal!.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      {
        x: margin + 15,
        y: height - 268,
        size: 26,
        font: boldFont,
        color: navy,
      },
    );

    if (deliverables.length > 0) {
      page.drawText("DELIVERABLES", {
        x: margin,
        y: height - 315,
        size: 8,
        font: boldFont,
        color: gray,
      });

      page.drawRectangle({
        x: margin,
        y: height - 348,
        width: width - margin * 2,
        height: 22,
        color: navy,
        borderRadius: 4,
      });

      page.drawText("Description", {
        x: margin + 12,
        y: height - 340,
        size: 9,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      page.drawText("Qty", {
        x: width - margin - 40,
        y: height - 340,
        size: 9,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      let yPos = height - 368;
      deliverables.forEach((d, i) => {
        if (i % 2 === 0) {
          page.drawRectangle({
            x: margin,
            y: yPos - 6,
            width: width - margin * 2,
            height: 22,
            color: lightGray,
          });
        }
        page.drawText(d.description, {
          x: margin + 12,
          y: yPos,
          size: 10,
          font,
          color: darkText,
        });
        page.drawText(`${d.quantity}`, {
          x: width - margin - 30,
          y: yPos,
          size: 10,
          font,
          color: gray,
        });
        yPos -= 28;
      });

      page.drawLine({
        start: { x: margin, y: yPos - 5 },
        end: { x: width - margin, y: yPos - 5 },
        thickness: 0.5,
        color: lightGray,
      });
      page.drawText("Total", {
        x: margin + 12,
        y: yPos - 22,
        size: 10,
        font: boldFont,
        color: darkText,
      });
      page.drawText(
        `$${deal!.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        {
          x: width - margin - 80,
          y: yPos - 22,
          size: 10,
          font: boldFont,
          color: navy,
        },
      );
    }

    // Footer
    page.drawRectangle({ x: 0, y: 0, width, height: 45, color: lightGray });
    page.drawText("Generated by ClipInvoice · clipinvoice.vercel.app", {
      x: margin,
      y: 16,
      size: 8,
      font,
      color: gray,
    });
    page.drawText(
      `Invoice date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      {
        x: width - margin - 150,
        y: 16,
        size: 8,
        font,
        color: gray,
      },
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deal!.brand_name}-invoice.pdf`;
    a.click();
    URL.revokeObjectURL(url);
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

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
          >
            📄 Download PDF Invoice
          </button>

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
