import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ClipInvoice"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-blue-900">ClipInvoice</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-md mb-6">
          🎬 Built specifically for YouTube editors
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Brands judge you by
          <br />
          <span className="text-blue-900">how you invoice them.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          A Word doc says amateur. ClipInvoice gives you a clean, professional
          invoice page that makes sponsors trust you — and pay you faster.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-blue-900 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-800 transition"
          >
            Create My First Invoice Free
          </Link>
          <Link
            href="/demo"
            className="bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-100 transition"
          >
            🎬 See it in action
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          No credit card required · Free to start
        </p>
      </section>

      {/* Pain section */}
      <section className="bg-blue-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-4">
            The Problem
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            You edit video for a living.
            <br />
            Not spreadsheets.
          </h2>
          <p className="text-blue-200 mb-10">
            Yet every project ends the same way — cobbling together an invoice
            in Google Docs, chasing late payments, and wondering if your client
            even opened it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "😩", text: "Copy-pasting Word templates every time" },
              { icon: "⏳", text: "Chasing clients for payments manually" },
              { icon: "🤷", text: "No idea if they opened your invoice" },
              { icon: "📋", text: "Generic tools that don't speak editor" },
              { icon: "💸", text: "Scope creep with no paper trail" },
              { icon: "🔁", text: "Starting from scratch every project" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 rounded-xl p-4 text-left"
              >
                <p className="text-xl mb-2">{item.icon}</p>
                <p className="text-white text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-4">
            How it works
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Simple as it should be.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Create",
                desc: "Add brand name, deliverables and price in under 2 minutes",
              },
              {
                step: "2",
                title: "Send",
                desc: "Share a clean professional link directly with your sponsor",
              },
              {
                step: "3",
                title: "Track",
                desc: "Get notified the moment your sponsor opens your invoice",
              },
              {
                step: "4",
                title: "Get Paid",
                desc: "Mark it paid and keep a full history of all your deals",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-left"
              >
                <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-4">
            Features
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Invoice in 2 minutes",
                desc: "Pre-built line items like integrations, shorts, community posts. No typing the same things every time.",
              },
              {
                icon: "👁️",
                title: "Know when it's opened",
                desc: "Get notified the moment your sponsor views your invoice. No more awkward follow-up emails.",
              },
              {
                icon: "🔗",
                title: "Shareable link",
                desc: "Send a clean professional link instead of a PDF attachment. Works perfectly on any device.",
              },
              {
                icon: "🔔",
                title: "Payment reminders",
                desc: "Set due dates and let ClipInvoice follow up on late payments automatically.",
              },
              {
                icon: "📁",
                title: "Deal history",
                desc: "All your invoices in one place. Reuse past deals as templates for repeat clients.",
              },
              {
                icon: "📊",
                title: "CSV export",
                desc: "Export all your deals and earnings for tax time or reporting. No more digging through emails.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left hover:border-blue-900 transition"
              >
                <p className="text-2xl mb-3">{item.icon}</p>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-4">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Simple, honest pricing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Starter</h3>
              <p className="text-gray-500 text-sm mb-6">
                Perfect for getting started
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                $0
                <span className="text-base font-normal text-gray-500">
                  /month
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 3 invoices/month",
                  "Basic line items",
                  "Shareable link",
                  "ClipInvoice branding",
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center border border-blue-900 text-blue-900 rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-50 transition"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-blue-900 rounded-2xl p-8 text-left relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                Early access
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Pro</h3>
              <p className="text-blue-300 text-sm mb-6">For serious editors</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-white">$15</span>
                <span className="text-base font-normal text-blue-300">
                  /month
                </span>
              </div>
              <p className="text-blue-300 text-xs mb-6">
                Goes to $19 after launch
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited invoices",
                  "Custom branding",
                  "Auto payment reminders",
                  "View notifications",
                  "CSV export",
                  "Recurring templates",
                  "Priority support",
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-white text-blue-900 rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-50 transition"
              >
                Start free — upgrade anytime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-900 text-sm font-semibold uppercase tracking-wide mb-4 text-center">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Common questions.
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is it really free?",
                a: "Yes — up to 3 invoices a month, forever free. No credit card required to start.",
              },
              {
                q: "Do I need to be a big YouTuber to use this?",
                a: "Not at all. ClipInvoice is built for freelance video editors at any level — from your first brand deal to your hundredth.",
              },
              {
                q: "What happens when my sponsor clicks the link?",
                a: "They see a clean, professional deal page with your deliverables and price. You get notified the moment they open it.",
              },
              {
                q: "Does ClipInvoice process payments?",
                a: "Not yet — payments happen off-platform for now. ClipInvoice tracks the status so you always know where each deal stands.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, absolutely. No contracts, no commitments. Cancel Pro anytime and keep your free account.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-blue-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stop sending Word doc invoices.
        </h2>
        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
          Join editors who are already sending professional brand deal invoices
          in minutes.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-white text-blue-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-50 transition"
        >
          Create My First Invoice Free
        </Link>
        <p className="text-blue-300 text-xs mt-4">
          No credit card required · Free to start · Cancel anytime
        </p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">
          © 2026{" "}
          <span className="font-semibold text-blue-900">ClipInvoice</span> ·
          Built by Abdirahman ·{" "}
          <a href="mailto:myabdi4@gmail.com" className="hover:text-blue-900">
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
}
