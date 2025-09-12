"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import MarketplaceSection from "@/components/MarketplaceSection";
import PurchasesSection from "@/components/PurchasesSection";
import AdRequestsSection from "@/components/AdRequestsSection";
import ContentRequestsSection from "@/components/ContentRequestsSection";
import AnalyticsSection from "@/components/AnalyticsSection";

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
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
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
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "marketplace") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
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
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "purchases") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
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
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "adRequests") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
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
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "contentRequests") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
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
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "analytics") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
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
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)'}
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
            <a className="text-xs lg:text-sm transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'} href="#">View profile</a>
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
        (w: Website) => w.status === "approved"
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

  const paidSiteIds = new Set(
    purchases
      .filter((p) => p.status === "paid" || p.status === "completed")
      .map((p) => {
        if (typeof p.websiteId === "string") {
          return p.websiteId;
        }
        if (p.websiteId?._id) {
          return p.websiteId._id;
        }
        return p.websiteId || "";
      })
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
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-secondary)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--base-primary)'}
          >
            <span className="material-symbols-outlined mr-2 text-lg sm:text-xl">refresh</span> 
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>

        {/* Marketplace Section */}
        {activeTab === "marketplace" && (
          <MarketplaceSection 
            websites={websites}
            loading={loading.websites}
            error={error.websites}
            refreshWebsites={refreshWebsites}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            paidSiteIds={paidSiteIds as Set<string>}
          />
        )}

        {/* Purchases Section */}
        {activeTab === "purchases" && (
          <PurchasesSection
            purchases={purchases}
            loading={loading.purchases}
            error={error.purchases}
            refreshPurchases={refreshPurchases}
            messages={messages}
            setMessages={setMessages}
          />
        )}

        {/* Analytics Section */}
        {activeTab === "analytics" && (
          <AnalyticsSection
            stats={stats}
            websites={websites}
          />
        )}

        {/* Ad Requests Section */}
        {activeTab === "adRequests" && (
          <AdRequestsSection
            adRequests={adRequests}
            loading={loading.adRequests}
            error={error.adRequests}
            fetchAdRequests={fetchAdRequests}
          />
        )}

        {/* Content Requests Section */}
        {activeTab === "contentRequests" && (
          <ContentRequestsSection
            contentRequests={contentRequests}
            loading={loading.contentRequests}
            error={error.contentRequests}
            fetchContentRequests={fetchContentRequests}
          />
        )}
      </main>
    </div>
  );
}