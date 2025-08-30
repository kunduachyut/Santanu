// app/dashboard/consumer/page.tsx (modernized design)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

type Website = {
  _id?: string;
  id?: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  price?: number;
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
      const rawWebsites = Array.isArray(data) ? data : data.websites || [];
      const websitesData: Website[] = rawWebsites.map((w: any) => ({
        _id: w._id ?? w.id,
        id: w.id,
        title: w.title,
        url: w.url,
        description: w.description,
        priceCents: typeof w.priceCents === 'number' && !Number.isNaN(w.priceCents)
          ? w.priceCents
          : typeof w.price === 'number' && !Number.isNaN(w.price)
            ? Math.round(w.price * 100)
            : 0,
        price: w.price,
        ownerId: w.ownerId,
        status: w.status,
      }));
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

  const getWebsiteId = (purchase: any): string => {
    if (typeof purchase.websiteId === "string") {
      return purchase.websiteId;
    }
    if (purchase.websiteId?._id) {
      return purchase.websiteId._id;
    }
    return purchase.websiteId || "";
  };

  const getWebsiteTitle = (purchase: any): string => {
    if (purchase.websiteTitle) {
      return purchase.websiteTitle;
    }
    if (typeof purchase.websiteId === "object" && purchase.websiteId?.title) {
      return purchase.websiteId.title;
    }
    return "Unknown Website";
  };

  const getWebsiteUrl = (purchase: any): string => {
    if (purchase.websiteUrl) {
      return purchase.websiteUrl;
    }
    if (typeof purchase.websiteId === "object" && purchase.websiteId?.url) {
      return purchase.websiteId.url;
    }
    return "#";
  };

  const getAmountCents = (purchase: any): number => {
    if (typeof purchase.amountCents === "number" && !isNaN(purchase.amountCents)) {
      return purchase.amountCents;
    }
    if (typeof purchase.totalCents === "number" && !isNaN(purchase.totalCents)) {
      return purchase.totalCents;
    }
    if (typeof purchase.priceCents === "number" && !isNaN(purchase.priceCents)) {
      return purchase.priceCents;
    }
    return 0;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Consumer Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Discover premium websites and manage your digital investments with ease
              </p>
            </div>
            
            {/* Enhanced Cart Button */}
            <Link 
              href="/cart" 
              className="group relative inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span>View Cart</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`flex-1 lg:flex-none px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "marketplace"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Marketplace</span>
                  {websites.length > 0 && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                      {websites.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`flex-1 lg:flex-none px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === "purchases"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>My Purchases</span>
                  {purchases.length > 0 && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                      {purchases.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Marketplace Section */}
        {activeTab === "marketplace" && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Digital Marketplace
                  </h2>
                  <p className="text-gray-600">
                    Discover premium websites and digital assets
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="text-2xl font-bold text-gray-900">{websites.length}</p>
                  </div>
                  <button
                    onClick={refreshWebsites}
                    className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading.websites ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-lg font-medium">Loading marketplace...</p>
                </div>
              </div>
            ) : error.websites ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Marketplace</h3>
                  <p className="text-gray-600 mb-6">{error.websites}</p>
                  <button
                    onClick={refreshWebsites}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.length === 0 ? (
                  <div className="col-span-full bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Websites Available</h3>
                      <p className="text-gray-600">Check back later for new digital assets</p>
                    </div>
                  </div>
                ) : (
                  websites.map((w, idx) => {
                    const stableId = w._id || w.id || `${w.title}-${w.url}`;
                    const isPurchased = paidSiteIds.has(stableId);
                    
                    return (
                      <div
                        key={stableId}
                        className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                      >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 pr-4 group-hover:text-blue-600 transition-colors">
                            {w.title}
                          </h3>
                          <div className="text-right">
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              ${(w.priceCents / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                          {w.description}
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                          <a
                            href={w.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Website
                          </a>

                          <button
                            onClick={() => addToCart({
                              _id: stableId,
                              title: w.title,
                              priceCents: typeof w.priceCents === 'number' ? w.priceCents : Math.round((w.price || 0) * 100)
                            })}
                            disabled={isPurchased}
                            className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                              isPurchased
                                ? "bg-green-100 text-green-700 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                            }`}
                          >
                            {isPurchased ? (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Purchased
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Purchases Section */}
        {activeTab === "purchases" && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    My Digital Assets
                  </h2>
                  <p className="text-gray-600">
                    Manage your purchased websites and digital investments
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                  </div>
                  <button
                    onClick={refreshPurchases}
                    className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading.purchases ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-lg font-medium">Loading your assets...</p>
                </div>
              </div>
            ) : error.purchases ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assets</h3>
                  <p className="text-gray-600 mb-6">{error.purchases}</p>
                  <button
                    onClick={refreshPurchases}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {purchases.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assets Yet</h3>
                      <p className="text-gray-600 mb-6">Start building your digital portfolio from the marketplace</p>
                      <button
                        onClick={() => setActiveTab("marketplace")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                      >
                        Browse Marketplace
                      </button>
                    </div>
                  </div>
                ) : (
                  purchases.map((p, idx) => {
                    const websiteId = getWebsiteId(p);
                    const websiteTitle = getWebsiteTitle(p);
                    const websiteUrl = getWebsiteUrl(p);
                    const isPaid = p.status === "paid" || p.status === "completed";
                    const amountCents = getAmountCents(p);

                    return (
                      <div
                        key={p._id ? `${p._id}-${idx}` : `purchase-${idx}`}
                        className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          {/* Asset Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  {websiteTitle}
                                </h3>
                                <a
                                  href={websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                  {websiteUrl}
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                              
                              {/* Status Badge */}
                              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                isPaid
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {p.status.toUpperCase()}
                              </div>
                            </div>

                            {/* Asset Details */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Investment:</span>
                                <span className="text-lg font-bold text-gray-900">${(amountCents / 100).toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Asset ID:</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-xs">
                                  {typeof p._id === "string" ? p._id.slice(-8) : "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Ad Request Section */}
                          {isPaid && (
                            <div className="lg:w-96 space-y-4">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Request Ad Placement
                              </h4>
                              <div className="space-y-3">
                                <input
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Write your ad request message..."
                                  value={messages[p._id] || ""}
                                  onChange={(e) => updateMessage(p._id, e.target.value)}
                                />
                                <button
                                  onClick={() => requestAd(websiteId, p._id)}
                                  disabled={!messages[p._id]?.trim()}
                                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                  Send Request
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}