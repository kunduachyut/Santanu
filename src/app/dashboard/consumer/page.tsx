"use client";

import { useEffect, useState } from "react";

type Website = {
  _id: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  ownerId: string;
  status?: string; // Added status field for filtering
};

type Purchase = {
  _id: string;
  websiteId: Website | string;
  amountCents: number;
  status: string;
};

export default function ConsumerDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState({ websites: true, purchases: true });
  const [error, setError] = useState({ websites: "", purchases: "" });

  useEffect(() => {
    refreshWebsites();
    refreshPurchases();
  }, []);

  async function refreshWebsites() {
    setLoading(prev => ({ ...prev, websites: true }));
    setError(prev => ({ ...prev, websites: "" }));
    
    try {
      const res = await fetch("/api/websites");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      
      // Handle both response formats
      const websitesData = Array.isArray(data) ? data : data.websites || [];
      
      // Filter to only show approved websites for consumers
      const approvedWebsites = websitesData.filter((w: Website) => 
        w.status === undefined || w.status === "approved"
      );
      
      setWebsites(approvedWebsites);
    } catch (err) {
      console.error("Failed to fetch websites:", err);
      setError(prev => ({ ...prev, websites: "Failed to load websites" }));
    } finally {
      setLoading(prev => ({ ...prev, websites: false }));
    }
  }

  async function refreshPurchases() {
    setLoading(prev => ({ ...prev, purchases: true }));
    setError(prev => ({ ...prev, purchases: "" }));
    
    try {
      const res = await fetch("/api/purchases");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      
      // Handle both response formats
      const purchasesData = Array.isArray(data) ? data : data.purchases || [];
      setPurchases(purchasesData);
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
      setError(prev => ({ ...prev, purchases: "Failed to load purchases" }));
    } finally {
      setLoading(prev => ({ ...prev, purchases: false }));
    }
  }

  async function buy(websiteId: string) {
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId }),
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      
      // Stripe flow -> redirect to checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      
      // fallback (no Stripe): refresh purchases
      refreshPurchases();
    } catch (err) {
      console.error("Failed to purchase:", err);
      alert("Failed to complete purchase. Please try again.");
    }
  }

  async function requestAd(websiteId: string) {
    if (!message.trim()) {
      alert("Write a short message for the publisher.");
      return;
    }
    
    try {
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
        alert(err.error || "Failed to send ad request");
      }
    } catch (err) {
      console.error("Failed to send ad request:", err);
      alert("Failed to send ad request. Please try again.");
    }
  }

  // Helper function to get website ID from purchase object
  const getWebsiteId = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === 'string') {
      return purchase.websiteId;
    }
    return purchase.websiteId?._id || '';
  };

  // Helper function to get website title from purchase object
  const getWebsiteTitle = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === 'string') {
      return "Unknown Website";
    }
    return purchase.websiteId?.title || "Unknown Website";
  };

  // Helper function to get website URL from purchase object
  const getWebsiteUrl = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === 'string') {
      return "#";
    }
    return purchase.websiteId?.url || "#";
  };

  const paidSiteIds = new Set(
    purchases
      .filter(p => p.status === "paid" || p.status === "completed")
      .map(p => getWebsiteId(p))
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Marketplace</h2>
        
        {loading.websites ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading websites...</span>
          </div>
        ) : error.websites ? (
          <div className="text-center text-red-500 py-8">
            <p>{error.websites}</p>
            <button
              onClick={refreshWebsites}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {websites.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No websites available at the moment.
              </div>
            ) : (
              websites.map(w => (
                <div key={w._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{w.title}</h3>
                    <span>${(w.priceCents/100).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{w.description}</p>
                  <a className="text-blue-600 text-sm underline" href={w.url} target="_blank" rel="noopener noreferrer">
                    Visit
                  </a>
                  <div className="flex gap-3">
                    <button
                      onClick={() => buy(w._id)}
                      disabled={paidSiteIds.has(w._id)}
                      className={`px-3 py-2 rounded text-sm ${
                        paidSiteIds.has(w._id)
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {paidSiteIds.has(w._id) ? "Purchased" : "Buy"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Purchases</h2>
        
        {loading.purchases ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3">Loading purchases...</span>
          </div>
        ) : error.purchases ? (
          <div className="text-center text-red-500 py-8">
            <p>{error.purchases}</p>
            <button
              onClick={refreshPurchases}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {purchases.length === 0 ? (
              <li className="text-center py-8 text-gray-500">
                No purchases yet.
              </li>
            ) : (
              purchases.map(p => (
                <li key={p._id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{getWebsiteTitle(p)}</div>
                      <div className="text-sm text-gray-600">{getWebsiteUrl(p)}</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      p.status === "paid" || p.status === "completed" 
                        ? "text-green-600" 
                        : "text-yellow-600"
                    }`}>
                      {p.status.toUpperCase()}
                    </div>
                  </div>
                  
                  {(p.status === "paid" || p.status === "completed") && (
                    <div className="mt-3 flex gap-3">
                      <input
                        className="border rounded px-2 py-1 text-sm w-full"
                        placeholder="Request ad message to publisher…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button
                        onClick={() => requestAd(getWebsiteId(p))}
                        className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 whitespace-nowrap"
                      >
                        Send Request
                      </button>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </section>
    </div>
  );
}