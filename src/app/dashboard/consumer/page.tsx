// app/dashboard/consumer/page.tsx (updated with active tab option)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

type Website = {
  _id: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  ownerId: string;
  status?: string;
};

type Purchase = {
  _id: string;
  websiteId: Website | string;
  amountCents: number;
  status: string;
};

type TabType = "marketplace" | "purchases";

export default function ConsumerDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState({ websites: true, purchases: true });
  const [error, setError] = useState({ websites: "", purchases: "" });
  const [activeTab, setActiveTab] = useState<TabType>("marketplace");

  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    refreshWebsites();
    refreshPurchases();
  }, []);

  async function refreshWebsites() {
    setLoading((prev) => ({ ...prev, websites: true }));
    setError((prev) => ({ ...prev, websites: "" }));

    try {
      const res = await fetch("/api/websites");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const websitesData = Array.isArray(data) ? data : data.websites || [];
      const approvedWebsites = websitesData.filter(
        (w: Website) => w.status === undefined || w.status === "approved"
      );

      setWebsites(approvedWebsites);
    } catch (err) {
      console.error("Failed to fetch websites:", err);
      setError((prev) => ({
        ...prev,
        websites: err instanceof Error ? err.message : "Failed to load websites"
      }));
    } finally {
      setLoading((prev) => ({ ...prev, websites: false }));
    }
  }

  async function refreshPurchases() {
    setLoading((prev) => ({ ...prev, purchases: true }));
    setError((prev) => ({ ...prev, purchases: "" }));

    try {
      const res = await fetch("/api/purchases");
      if (!res.ok) {
        // If we get a 405 error, try a different endpoint or method
        if (res.status === 405) {
          console.warn("GET method not allowed for /api/purchases, trying alternative approach");

          // Try a different approach - maybe the purchases are stored elsewhere
          // For now, we'll set empty purchases and show a warning
          setPurchases([]);
          setError((prev) => ({
            ...prev,
            purchases: "Purchase data temporarily unavailable"
          }));
          return;
        }

        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const purchasesData = Array.isArray(data) ? data : data.purchases || [];
      setPurchases(purchasesData);
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
      setError((prev) => ({
        ...prev,
        purchases: err instanceof Error ? err.message : "Failed to load purchases"
      }));
    } finally {
      setLoading((prev) => ({ ...prev, purchases: false }));
    }
  }

  async function buy(websiteId: string) {
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      refreshPurchases();
    } catch (err) {
      console.error("Failed to purchase:", err);
      alert("Failed to complete purchase. Please try again.");
    }
  }

  async function requestAd(websiteId: string, purchaseId: string) {
    const message = messages[purchaseId] || "";

    if (!message.trim()) {
      alert("Write a short message for the publisher.");
      return;
    }

    try {
      const res = await fetch("/api/ad-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, message, purchaseId }),
      });

      if (res.ok) {
        alert("Ad request sent!");
        setMessages((prev) => ({ ...prev, [purchaseId]: "" }));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send ad request");
      }
    } catch (err) {
      console.error("Failed to send ad request:", err);
      alert("Failed to send ad request. Please try again.");
    }
  }

  const getWebsiteId = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === "string") {
      return purchase.websiteId;
    }
    return purchase.websiteId?._id || "";
  };

  const getWebsiteTitle = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === "string") {
      return "Unknown Website";
    }
    return purchase.websiteId?.title || "Unknown Website";
  };

  const getWebsiteUrl = (purchase: Purchase): string => {
    if (typeof purchase.websiteId === "string") {
      return "#";
    }
    return purchase.websiteId?.url || "#";
  };

  const updateMessage = (purchaseId: string, message: string) => {
    setMessages((prev) => ({ ...prev, [purchaseId]: message }));
  };

  const paidSiteIds = new Set(
    purchases
      .filter((p) => p.status === "paid" || p.status === "completed")
      .map((p) => getWebsiteId(p))
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header with Cart */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Consumer Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Browse websites and manage your purchases
          </p>
        </div>
        <Link href="/cart" className="relative p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View Cart
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "marketplace"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            Marketplace
            {websites.length > 0 && (
              <span className="ml-2 py-0.5 px-2.5 bg-gray-200 rounded-full text-xs font-medium">
                {websites.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "purchases"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            My Purchases
            {purchases.length > 0 && (
              <span className="ml-2 py-0.5 px-2.5 bg-gray-200 rounded-full text-xs font-medium">
                {purchases.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Marketplace Section */}
      {activeTab === "marketplace" && (
        <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Marketplace</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {websites.length} {websites.length === 1 ? 'website' : 'websites'} available
              </span>
              <button
                onClick={refreshWebsites}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {loading.websites ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
              <span className="text-gray-600">Loading websites...</span>
            </div>
          ) : error.websites ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium">{error.websites}</p>
              </div>
              <button
                onClick={refreshWebsites}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {websites.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">
                    No websites available
                  </p>
                  <p className="text-gray-400 text-sm">
                    Check back later for new website listings
                  </p>
                </div>
              ) : (
                websites.map((w, idx) => (
                  <div
                    key={w._id || idx}
                    className="border border-gray-200 rounded-xl p-5 space-y-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 pr-2">
                        {w.title}
                      </h3>
                      <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
                        ${(w.priceCents / 100).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                      {w.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
                      >
                        Visit Website
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>

                      <button
                        onClick={() => addToCart({
                          _id: w._id,
                          title: w.title,
                          priceCents: w.priceCents,
                          quantity: 1
                        })}
                        disabled={paidSiteIds.has(w._id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 ${paidSiteIds.has(w._id)
                            ? "bg-green-50 text-green-600 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md"
                          }`}
                      >
                        {paidSiteIds.has(w._id) ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Purchased
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {/* Purchases Section */}
      {activeTab === "purchases" && (
        <section className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">My Purchases</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'}
              </span>
              <button
                onClick={refreshPurchases}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {loading.purchases ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
              <span className="text-gray-600">Loading purchases...</span>
            </div>
          ) : error.purchases ? (
            <div className="text-center py-8">
              <div className="text-yellow-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-lg font-medium">{error.purchases}</p>
              </div>
              <button
                onClick={refreshPurchases}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg mb-4">No purchases yet.</p>
                  <p className="text-gray-400 text-sm">
                    Start by purchasing a website from the marketplace above.
                  </p>
                </div>
              ) : (
                purchases.map((p,idx) => {
                  const websiteId = getWebsiteId(p);
                  const websiteTitle = getWebsiteTitle(p);
                  const websiteUrl = getWebsiteUrl(p);
                  const isPaid = p.status === "paid" || p.status === "completed";

                  return (
                    <div
                      key={p._id ? `${p._id}-${idx}` : `purchase-${idx}`}
                      className="border border-gray-200 rounded-xl p-5 space-y-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {websiteTitle}
                          </h3>
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center group"
                          >
                            {websiteUrl}
                            <svg
                              className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${isPaid
                              ? "bg-green-100 text-green-800"
                              : p.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {p.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="flex flex-col xs:flex-row xs:items-center justify-between text-sm text-gray-600 gap-2">
                        <span>Amount: <span className="font-medium">${(p.amountCents / 100).toFixed(2)}</span></span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          ID: {typeof p._id === "string" ? p._id.slice(-8) : "N/A"}
                        </span>
                      </div>

                      {isPaid && (
                        <div className="pt-4 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Request Ad Placement
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Write your ad request message..."
                              value={messages[p._id] || ""}
                              onChange={(e) => updateMessage(p._id, e.target.value)}
                            />
                            <button
                              onClick={() => requestAd(websiteId, p._id)}
                              disabled={!messages[p._id]?.trim()}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap flex items-center justify-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send Request
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}