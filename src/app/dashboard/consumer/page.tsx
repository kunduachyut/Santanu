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
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  clicks?: number;
  DA?: number;
  PA?: number;
  Spam?: number;
  OrganicTraffic?: number;
  DR?: number;
  RD?: string;
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
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    refreshWebsites();
    refreshPurchases();
  }, []);
  
  // Reset selected items when tab changes
  useEffect(() => {
    setSelectedItems({});
    setSelectAll(false);
  }, [activeTab]);

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
        status: w.status,
        // Handle new fields
        views: w.views || 0,
        clicks: w.clicks || 0,
        DA: w.DA || 0,
        PA: w.PA || 0,
        Spam: w.Spam || 0,
        OrganicTraffic: w.OrganicTraffic || 0,
        DR: w.DR || 0,
        RD: w.RD || "",
        createdAt: w.createdAt || new Date().toISOString(),
        updatedAt: w.updatedAt || new Date().toISOString(),
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                All Websites
              </h1>
            </div>
            
            {/* Enhanced Cart Button */}
            <div className="flex items-center gap-3">
              <Link 
                href="/cart" 
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>View Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab("marketplace")}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "marketplace" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Marketplace</span>
                  {websites.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                      {websites.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "purchases" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>My Purchases</span>
                  {purchases.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
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
          <div>
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshWebsites}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-500">{websites.length} websites available</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
                    if (selectedCount === 0) {
                      alert("Please select at least one website");
                      return;
                    }
                    
                    // Add selected websites to cart
                    websites.forEach(w => {
                      const id = w._id || w.id || `${w.title}-${w.url}`;
                      if (selectedItems[id]) {
                        addToCart({
                          _id: id,
                          title: w.title,
                          priceCents: w.priceCents,
                          // Include new fields if needed
                          DA: w.DA,
                          DR: w.DR,
                          // Add other fields as needed
                        });
                      }
                    });
                    
                    // Reset selection
                    setSelectedItems({});
                    setSelectAll(false);
                    
                    alert(`${selectedCount} website(s) added to cart!`);
                  }}
                  disabled={Object.values(selectedItems).filter(Boolean).length === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center mr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add Selected to Cart
                </button>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            {loading.websites ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading marketplace...</p>
                </div>
              </div>
            ) : error.websites ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Marketplace</h3>
                  <p className="text-gray-600 mb-4">{error.websites}</p>
                  <button
                    onClick={refreshWebsites}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {websites.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Available</h3>
                    <p className="text-gray-600">Check back later for new digital assets</p>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-1">
                        <input 
                          type="checkbox" 
                          checked={selectAll}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectAll(isChecked);
                            const newSelectedItems: Record<string, boolean> = {};
                            websites.forEach(w => {
                              const id = w._id || w.id || `${w.title}-${w.url}`;
                              newSelectedItems[id] = isChecked;
                            });
                            setSelectedItems(newSelectedItems);
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-4">WEBSITE NAME</div>
                      <div className="col-span-2">PRICE</div>
                      <div className="col-span-2">STATUS</div>
                      <div className="col-span-2">ACTIONS</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {websites
                        .filter(w => {
                          if (!searchQuery) return true;
                          return w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 w.url.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        .map((w, idx) => {
                        const stableId = w._id || w.id || `${w.title}-${w.url}`;
                        const isPurchased = paidSiteIds.has(stableId);
                        
                        return (
                          <div key={stableId} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Checkbox */}
                            <div className="col-span-1">
                              <input 
                                type="checkbox" 
                                checked={selectedItems[stableId] || false}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [stableId]: isChecked
                                  }));
                                  // Update selectAll state based on all items being selected
                                  const allSelected = Object.keys(selectedItems).length === websites.length - 1 && isChecked;
                                  setSelectAll(allSelected);
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                              />
                            </div>
                            
                            {/* Website Title */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                  {w.title.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{w.title}</div>
                                  <div className="text-xs text-gray-500 truncate max-w-[150px]" title={w.url}>
                                    {w.url.length > 30 ? `${w.url.substring(0, 30)}...` : w.url}
                                  </div>
                                  {/* Display new metrics if available */}
                                  {(w.DA || w.DR) && (
                                    <div className="flex gap-2 mt-1">
                                      {w.DA && <span className="text-xs text-gray-400">DA: {w.DA}</span>}
                                      {w.DR && <span className="text-xs text-gray-400">DR: {w.DR}</span>}
                                      {w.OrganicTraffic && <span className="text-xs text-gray-400">OrganicTraffic: {w.OrganicTraffic}</span>}
                                      {w.Spam && <span className="text-xs text-gray-400">Spam: {w.Spam}</span>}
                                      {w.RD && <span className="text-xs text-gray-400">RD: {w.RD}</span>}
                                       </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="col-span-2">
                              <div className="text-sm font-medium text-gray-900">${(w.priceCents / 100).toFixed(2)}</div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2">
                              {isPurchased ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Purchased
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Available
                                </span>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2">
                              <div className="flex space-x-2">
                                <a
                                  href={w.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  title="Visit Website"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                                
                                <button
                                  onClick={() => addToCart({
                                    _id: stableId,
                                    title: w.title,
                                    priceCents: typeof w.priceCents === 'number' ? w.priceCents : Math.round((w.priceCents || 0) * 100),
                                    // Include new fields
                                    DA: w.DA,
                                    DR: w.DR,
                                  })}
                                  disabled={isPurchased}
                                  className={`p-1 ${isPurchased ? 'text-green-500 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                                  title={isPurchased ? 'Already Purchased' : 'Add to Cart'}
                                >
                                  {isPurchased ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            {/* More Options */}
                            <div className="col-span-1 text-right">
                              <button className="text-gray-400 hover:text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{websites.length}</span> of{" "}
                            <span className="font-medium">{websites.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                            <a
                              href="#"
                              aria-current="page"
                              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              1
                            </a>
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Purchases Section */}
        {activeTab === "purchases" && (
          <div>
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshPurchases}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-500">{purchases.length} assets purchased</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            {loading.purchases ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading purchases...</p>
                </div>
              </div>
            ) : error.purchases ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Purchases</h3>
                  <p className="text-gray-600 mb-4">{error.purchases}</p>
                  <button
                    onClick={refreshPurchases}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {purchases.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Purchased Yet</h3>
                    <p className="text-gray-600 mb-4">Browse the marketplace to find digital assets</p>
                    <button
                      onClick={() => setActiveTab("marketplace")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-4">ASSET</div>
                      <div className="col-span-3">URL</div>
                      <div className="col-span-2">STATUS</div>
                      <div className="col-span-2">AMOUNT</div>
                      <div className="col-span-1">ACTIONS</div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {purchases.map((p, idx) => {
                        const websiteId = getWebsiteId(p);
                        const websiteTitle = getWebsiteTitle(p);
                        const websiteUrl = getWebsiteUrl(p);
                        const isPaid = p.status === "paid" || p.status === "completed";
                        const amountCents = getAmountCents(p);
                        
                        return (
                          <div key={p._id ? `${p._id}-${idx}` : `purchase-${idx}`} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Asset Title */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                  {websiteTitle.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{websiteTitle}</div>
                                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{p._id}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* URL */}
                            <div className="col-span-3">
                              <a 
                                href={websiteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <span className="truncate max-w-[150px]">{websiteUrl}</span>
                                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2">
                              <span 
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isPaid ? "bg-green-100 text-green-800" :
                                  p.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-green-100 text-green-800"
                                }`}
                              >
                                {p.status.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Amount */}
                            <div className="col-span-2">
                              <div className="text-sm font-medium text-gray-900">${(amountCents / 100).toFixed(2)}</div>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-1 text-right">
                              <div className="relative inline-block text-left">
                                <button className="text-gray-400 hover:text-gray-500 p-1">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pagination */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{purchases.length}</span> of{" "}
                            <span className="font-medium">{purchases.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                            <a
                              href="#"
                              aria-current="page"
                              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              1
                            </a>
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ad Request Modal */}
                    <div className="px-6 py-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Ad Request Placement</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write your message here..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}