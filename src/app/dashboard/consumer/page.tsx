"use client";

import { useEffect, useState } from "react";

type Website = {
  _id: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  ownerId: string;
};

type Purchase = {
  _id: string;
  websiteId: Website;
  amountCents: number;
  status: string;
};

export default function ConsumerDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/websites").then(r => r.json()).then(setWebsites);
    fetch("/api/purchases").then(r => r.json()).then(setPurchases);
  }, []);

  async function buy(websiteId: string) {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
    });
    const data = await res.json();
    // Stripe flow -> redirect to checkout
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    // fallback (no Stripe): refresh
    fetch("/api/purchases").then(r => r.json()).then(setPurchases);
  }

  async function requestAd(websiteId: string) {
    if (!message.trim()) return alert("Write a short message for the publisher.");
    const res = await fetch("/api/ad-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId, message }),
    });
    if (res.ok) {
      alert("Ad request sent!");
      setMessage("");
    } else {
      const err = await res.json();
      alert(err.error || "Failed");
    }
  }

  const paidSiteIds = new Set(purchases.filter(p => p.status === "paid").map(p => String(p.websiteId?._id || p.websiteId)));

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map(w => (
            <div key={w._id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <h3 className="font-bold">{w.title}</h3>
                <span>${(w.priceCents/100).toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600">{w.description}</p>
              <a className="text-blue-600 text-sm underline" href={w.url} target="_blank">Visit</a>
              <div className="flex gap-3">
                <button
                  onClick={() => buy(w._id)}
                  className="px-3 py-2 rounded bg-black text-white text-sm"
                >
                  {paidSiteIds.has(w._id) ? "Purchased" : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Purchases</h2>
        <ul className="space-y-3">
          {purchases.map(p => (
            <li key={p._id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{p.websiteId?.title}</div>
                  <div className="text-sm text-gray-600">{p.websiteId?.url}</div>
                </div>
                <div className="text-sm">{p.status.toUpperCase()}</div>
              </div>
              <div className="mt-3 flex gap-3">
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  placeholder="Request ad message to publisher…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={() => requestAd(String(p.websiteId?._id))}
                  className="px-3 py-2 rounded bg-indigo-600 text-white text-sm"
                >
                  Send Request
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
