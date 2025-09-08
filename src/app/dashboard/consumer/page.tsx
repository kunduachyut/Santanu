"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

// Sidebar component
function Sidebar({ activeTab, setActiveTab, stats }: {
  activeTab: string;
  setActiveTab: (tab: "marketplace" | "purchases" | "adRequests" | "contentRequests" | "analytics") => void;
  stats: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { itemCount } = useCart();

  return (
    <aside className={`${sidebarOpen ? 'w-56 lg:w-64' : 'w-14 lg:w-16'} flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen shadow-lg sticky top-0 h-screen overflow-y-auto`} style={{backgroundColor: 'var(--base-primary)', borderRight: '1px solid var(--base-tertiary)'}}>
      <div className="flex items-center justify-between p-3 sm:p-4 h-14 sm:h-16 lg:h-[6.25rem] flex-shrink-0" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
        <div className={`${sidebarOpen ? 'block' : 'hidden'} text-xl lg:text-2xl font-bold`} style={{color: 'var(--secondary-primary)'}}>
          Advertiser
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg transition-colors"
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--base-tertiary)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 space-y-1 lg:space-y-2" style={{borderTop: '1px solid var(--base-tertiary)'}}>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "marketplace"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "marketplace" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "marketplace" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "marketplace") {
                e.target.style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "marketplace") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">storefront</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Marketplace</span>
            {sidebarOpen && stats.total > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor: 'var(--accent-primary)', color: 'white'}}>
                {stats.total}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("purchases")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "purchases"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "purchases" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "purchases" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "purchases") {
                e.target.style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "purchases") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">shopping_bag</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>My Purchases</span>
            {sidebarOpen && stats.purchases > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" style={{backgroundColor: 'var(--success)', color: 'white'}}>
                {stats.purchases}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("adRequests")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "adRequests"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "adRequests" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "adRequests" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "adRequests") {
                e.target.style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "adRequests") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">campaign</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Ad Requests</span>
          </button>
          
          <button
            onClick={() => setActiveTab("contentRequests")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "contentRequests"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "contentRequests" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "contentRequests" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "contentRequests") {
                e.target.style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "contentRequests") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">edit_note</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Content Requests</span>
          </button>
          
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "analytics"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "analytics" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "analytics" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "analytics") {
                e.target.style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "analytics") {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">analytics</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Analytics</span>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="pt-4 mt-4" style={{borderTop: '1px solid var(--base-tertiary)'}}>
          <Link
            href="/cart"
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base text-white`}
            style={{backgroundColor: 'var(--accent-primary)'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-primary)'}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">shopping_cart</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>View Cart</span>
            {itemCount > 0 && (
              <span className="ml-auto px-2 py-1 rounded-full text-xs font-bold" style={{backgroundColor: 'var(--error)', color: 'white'}}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <div className="p-3 lg:p-4" style={{borderTop: '1px solid var(--base-tertiary)'}}>
        <div className="flex items-center">
          <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base" style={{backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)'}}>
            A
          </div>
          <div className={`${sidebarOpen ? 'block' : 'hidden'} ml-2 lg:ml-3`}>
            <p className="text-xs lg:text-sm font-semibold" style={{color: 'var(--secondary-primary)'}}>Advertiser</p>
            <a className="text-xs lg:text-sm transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--secondary-lighter)'} href="#">View profile</a>
          </div>
        </div>
      </div>
    </aside>
  );
}

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
  createdAt?: string;
  updatedAt?: string;
};

type TabType = "marketplace" | "purchases" | "adRequests" | "contentRequests" | "analytics";

export default function ConsumerDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [adRequests, setAdRequests] = useState<any[]>([]);
  const [contentRequests, setContentRequests] = useState<any[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState({ 
    websites: true, 
    purchases: true, 
    adRequests: true, 
    contentRequests: true 
  });
  const [error, setError] = useState({ 
    websites: "", 
    purchases: "", 
    adRequests: "", 
    contentRequests: "" 
  });
  const [activeTab, setActiveTab] = useState<TabType>("marketplace");
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    purchases: 0,
    adRequests: 0,
    contentRequests: 0
  });

  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    refreshWebsites();
    refreshPurchases();
    fetchAdRequests();
    fetchContentRequests();
  }, []);
  
  // Reset selected items when tab changes
  useEffect(() => {
    setSelectedItems({});
    setSelectAll(false);
  }, [activeTab]);

  // Calculate stats whenever data changes
  useEffect(() => {
    setStats({
      total: websites.length,
      purchases: purchases.length,
      adRequests: adRequests.length,
      contentRequests: contentRequests.length
    });
  }, [websites, purchases, adRequests, contentRequests]);

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

  async function fetchAdRequests() {
    setLoading((prev) => ({ ...prev, adRequests: true }));
    setError((prev) => ({ ...prev, adRequests: "" }));

    try {
      const res = await fetch("/api/ad-requests");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAdRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch ad requests:", err);
      setError((prev) => ({
        ...prev,
        adRequests: err instanceof Error ? err.message : "Failed to load ad requests"
      }));
    } finally {
      setLoading((prev) => ({ ...prev, adRequests: false }));
    }
  }

  async function fetchContentRequests() {
    setLoading((prev) => ({ ...prev, contentRequests: true }));
    setError((prev) => ({ ...prev, contentRequests: "" }));

    try {
      const res = await fetch("/api/content-requests");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setContentRequests(data.items || []);
    } catch (err) {
      console.error("Failed to fetch content requests:", err);
      setError((prev) => ({
        ...prev,
        contentRequests: err instanceof Error ? err.message : "Failed to load content requests"
      }));
    } finally {
      setLoading((prev) => ({ ...prev, contentRequests: false }));
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
    <div className="flex min-h-screen w-screen overflow-x-hidden" style={{backgroundColor: 'var(--base-primary)'}}>
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto overflow-x-hidden min-w-0 max-w-none w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold" style={{color: 'var(--secondary-primary)'}}>
              {activeTab === "marketplace" && "Marketplace"}
              {activeTab === "purchases" && "My Purchases"}
              {activeTab === "adRequests" && "Ad Requests"}
              {activeTab === "contentRequests" && "Content Requests"}
              {activeTab === "analytics" && "Analytics Dashboard"}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg" style={{color: 'var(--secondary-lighter)'}}>
              {activeTab === "marketplace" && "Browse and purchase digital assets"}
              {activeTab === "purchases" && "Manage your purchased websites"}
              {activeTab === "adRequests" && "Track and manage ad placements"}
              {activeTab === "contentRequests" && "Request content for your websites"}
              {activeTab === "analytics" && "Monitor your advertising performance"}
            </p>
          </div>
          <button 
            onClick={activeTab === "marketplace" ? refreshWebsites : activeTab === "purchases" ? refreshPurchases : activeTab === "adRequests" ? fetchAdRequests : fetchContentRequests}
            className="flex items-center px-3 sm:px-4 lg:px-5 py-2.5 rounded-lg shadow-sm transition duration-200 text-sm sm:text-base whitespace-nowrap"
            style={{
              backgroundColor: 'var(--base-primary)',
              color: 'var(--secondary-primary)',
              border: '1px solid var(--base-tertiary)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--base-secondary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--base-primary)'}
          >
            <span className="material-symbols-outlined mr-2 text-lg sm:text-xl">refresh</span> 
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
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
                    <div className="grid grid-cols-22 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-1 flex justify-center">
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
                      <div className="col-span-4 flex items-center">WEBSITE NAME</div>
                      <div className="col-span-2 flex justify-center">PRICE</div>
                      <div className="col-span-1 flex justify-center">DA</div>
                      <div className="col-span-1 flex justify-center">DR</div>
                      <div className="col-span-2 flex justify-center">ORGANIC TRAFFIC</div>
                      <div className="col-span-1 flex justify-center">SPAM</div>
                      <div className="col-span-2 flex justify-center">RD LINK</div>
                      <div className="col-span-2 flex justify-center">STATUS</div>
                      <div className="col-span-2 flex justify-center">ACTIONS</div>
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
                          <div key={stableId} className="grid grid-cols-22 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Checkbox */}
                            <div className="col-span-1 flex justify-center">
                              <input 
                                type="checkbox" 
                                checked={selectedItems[stableId] || false}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setSelectedItems(prev => ({
                                    ...prev,
                                    [stableId]: isChecked
                                  }));
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
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">${(w.priceCents / 100).toFixed(2)}</div>
                            </div>
                            
                            {/* DA */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{w.DA || 0}</div>
                            </div>
                            
                            {/* DR */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{w.DR || 0}</div>
                            </div>
                            
                            {/* Organic Traffic */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{w.OrganicTraffic || 0}</div>
                            </div>
                            
                            {/* Spam */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{w.Spam || 0}</div>
                            </div>
                            
                            {/* RD */}
                            <div className="col-span-2 flex justify-center">
                              {w.RD ? (
                                <a 
                                  href={w.RD} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Open RD Link"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-sm font-medium text-gray-400">0</span>
                              )}
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
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
                            <div className="col-span-2 flex justify-center">
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
                            <div className="col-span-1 flex justify-end">
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
                <span className="text-sm font-medium text-gray-500">{purchases.length} purchases found</span>
              </div>
            </div>

            {/* Content */}
            {loading.purchases ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
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
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchases Yet</h3>
                    <p className="text-gray-600 mb-4">Browse the marketplace to purchase digital assets</p>
                    <button
                      onClick={() => setActiveTab("marketplace")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-16 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5 flex items-center">WEBSITE NAME</div>
                      <div className="col-span-3 flex justify-center">PURCHASE DATE</div>
                      <div className="col-span-2 flex justify-center">AMOUNT</div>
                      <div className="col-span-2 flex justify-center">STATUS</div>
                      <div className="col-span-3 flex justify-center">ACTIONS</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {purchases.map((purchase, index) => {
                        const websiteTitle = getWebsiteTitle(purchase);
                        const websiteUrl = getWebsiteUrl(purchase);
                        const amountCents = getAmountCents(purchase);
                        const websiteId = getWebsiteId(purchase);
                        
                        return (
                          <div key={purchase._id || index} className="grid grid-cols-16 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Website Info */}
                            <div className="col-span-5">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                  {websiteTitle.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{websiteTitle}</div>
                                  <div className="text-xs text-gray-500 truncate max-w-[200px]" title={websiteUrl}>
                                    {websiteUrl.length > 40 ? `${websiteUrl.substring(0, 40)}...` : websiteUrl}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Purchase Date */}
                            <div className="col-span-3 flex justify-center">
                              <div className="text-sm text-gray-900">
                                {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                            
                            {/* Amount */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">${(amountCents / 100).toFixed(2)}</div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                purchase.status === 'paid' || purchase.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : purchase.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {purchase.status || 'Unknown'}
                              </span>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-3 flex justify-center">
                              <div className="flex space-x-2">
                                <a
                                  href={websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  title="Visit Website"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                                
                                {/* Ad Request Button */}
                                {(purchase.status === 'paid' || purchase.status === 'completed') && (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      placeholder="Message for publisher"
                                      value={messages[purchase._id] || ""}
                                      onChange={(e) => updateMessage(purchase._id, e.target.value)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
                                    />
                                    <button
                                      onClick={() => requestAd(websiteId, purchase._id)}
                                      className="text-green-600 hover:text-green-800 p-1"
                                      title="Request Ad Placement"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* More Options */}
                            <div className="col-span-1 flex justify-end">
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analytics Section */}
        {activeTab === "analytics" && (
          <div>
            {/* Analytics Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Performance Overview</span>
              </div>
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Purchases</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.purchases}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Ad Requests</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.adRequests}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">+5% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Content Requests</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.contentRequests}</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">+8% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Available Assets</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">+3% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">New Purchase</p>
                          <p className="text-sm text-gray-500">TechBlog.com purchased</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">2 hours ago</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Ad Request Sent</p>
                          <p className="text-sm text-gray-500">Campaign created for MarketingHub</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">5 hours ago</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Content Request</p>
                          <p className="text-sm text-gray-500">Article requested for SalesWebsite</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Websites */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Top Performing Websites</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {websites.slice(0, 3).map((website, index) => (
                    <div key={website._id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            #{index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{website.title}</p>
                            <p className="text-sm text-gray-500">DA: {website.DA || 0} | DR: {website.DR || 0}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">${(website.priceCents / 100).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{website.OrganicTraffic || 0} traffic</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ad Requests Section */}
        {activeTab === "adRequests" && (
          <div>
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAdRequests}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-500">{adRequests.length} ad requests found</span>
              </div>
            </div>

            {/* Content */}
            {loading.adRequests ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading ad requests...</p>
                </div>
              </div>
            ) : error.adRequests ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Ad Requests</h3>
                  <p className="text-gray-600 mb-4">{error.adRequests}</p>
                  <button
                    onClick={fetchAdRequests}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {adRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1h-1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Ad Requests Yet</h3>
                    <p className="text-gray-600 mb-4">Start creating advertising campaigns to see your ad requests here</p>
                    <button
                      onClick={() => setActiveTab("purchases")}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium text-sm"
                    >
                      View My Purchases
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-16 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-4 flex items-center">WEBSITE</div>
                      <div className="col-span-6 flex items-center">MESSAGE</div>
                      <div className="col-span-2 flex justify-center">REQUEST DATE</div>
                      <div className="col-span-2 flex justify-center">STATUS</div>
                      <div className="col-span-2 flex justify-center">ACTIONS</div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {adRequests.map((request, index) => {
                        return (
                          <div key={request._id || index} className="grid grid-cols-16 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Website Info */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                  {(request.websiteTitle || request.websiteId || 'W').charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.websiteTitle || request.websiteId || 'Unknown Website'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Ad Campaign
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Message */}
                            <div className="col-span-6">
                              <div className="text-sm text-gray-900 truncate max-w-[300px]" title={request.message}>
                                {request.message || 'No message provided'}
                              </div>
                            </div>
                            
                            {/* Request Date */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm text-gray-900">
                                {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status || 'pending'}
                              </span>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2 flex justify-center">
                              <div className="flex space-x-2">
                                <button
                                  className="text-purple-600 hover:text-purple-800 p-1"
                                  title="View Details"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  title="Edit Request"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Requests Section */}
        {activeTab === "contentRequests" && (
          <div>
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchContentRequests}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-500">{contentRequests.length} content requests found</span>
              </div>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Content Request
              </button>
            </div>

            {/* Content */}
            {loading.contentRequests ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading content requests...</p>
                </div>
              </div>
            ) : error.contentRequests ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Content Requests</h3>
                  <p className="text-gray-600 mb-4">{error.contentRequests}</p>
                  <button
                    onClick={fetchContentRequests}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {contentRequests.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Requests Yet</h3>
                    <p className="text-gray-600 mb-4">Request custom content for your websites to boost engagement</p>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm">
                      Create Content Request
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-18 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-4 flex items-center">TOPIC</div>
                      <div className="col-span-4 flex items-center">WEBSITE</div>
                      <div className="col-span-3 flex justify-center">CONTENT TYPE</div>
                      <div className="col-span-2 flex justify-center">REQUEST DATE</div>
                      <div className="col-span-2 flex justify-center">STATUS</div>
                      <div className="col-span-2 flex justify-center">ACTIONS</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {contentRequests.map((request, index) => {
                        return (
                          <div key={request._id || index} className="grid grid-cols-18 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Topic */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                  {(request.topic || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.topic || 'Content Request'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {request.description ? `${request.description.substring(0, 30)}...` : 'No description'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Website */}
                            <div className="col-span-4">
                              <div className="text-sm text-gray-900">
                                {request.websiteTitle || request.websiteId || 'Unknown Website'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.websiteUrl || 'No URL provided'}
                              </div>
                            </div>
                            
                            {/* Content Type */}
                            <div className="col-span-3 flex justify-center">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                {request.contentType || 'Article'}
                              </span>
                            </div>
                            
                            {/* Request Date */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm text-gray-900">
                                {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : request.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : request.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status || 'pending'}
                              </span>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2 flex justify-center">
                              <div className="flex space-x-2">
                                <button
                                  className="text-orange-600 hover:text-orange-800 p-1"
                                  title="View Details"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  title="Edit Request"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                {request.status === 'completed' && (
                                  <button
                                    className="text-green-600 hover:text-green-800 p-1"
                                    title="Download Content"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* More Options */}
                            <div className="col-span-1 flex justify-end">
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
      </main>
    </div>
  );
}