"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Sidebar component
function Sidebar({ activeTab, setActiveTab }: {
  activeTab: string;
  setActiveTab: (tab: "websites" | "purchases" | "contentRequests" | "userContent" | "priceConflicts") => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <aside className={`${sidebarOpen ? 'w-56 lg:w-64' : 'w-14 lg:w-16'} flex-shrink-0 flex flex-col transition-all duration-300 min-h-screen shadow-lg`} style={{backgroundColor: 'var(--base-primary)', borderRight: '1px solid var(--base-tertiary)'}}>
      <div className="flex items-center justify-between p-3 sm:p-4 h-14 sm:h-16 lg:h-[6.25rem] flex-shrink-0" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
        <div className={`${sidebarOpen ? 'block' : 'hidden'} text-xl lg:text-2xl font-bold`} style={{color: 'var(--secondary-primary)'}}>
          Name
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg transition-colors"
          style={{}} /* Removed invalid CSS */
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
            onClick={() => setActiveTab("websites")}
            className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${
              activeTab === "websites"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "websites" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "websites" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "websites") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "websites") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">web</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Website Moderation</span>
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
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">shopping_cart</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Purchase Requests</span>
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
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">description</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Content Requests</span>
          </button>
          
          <button
            onClick={() => setActiveTab("priceConflicts")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "priceConflicts"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "priceConflicts" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "priceConflicts" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "priceConflicts") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "priceConflicts") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">compare</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Price Conflicts</span>
          </button>
          
          <button
            onClick={() => setActiveTab("userContent")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "userContent"
                ? '' 
                : ''
            }`}
            style={{
              backgroundColor: activeTab === "userContent" ? 'var(--accent-light)' : 'transparent',
              color: activeTab === "userContent" ? 'var(--accent-primary)' : 'var(--secondary-lighter)'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "userContent") {
                (e.target as HTMLElement).style.backgroundColor = 'var(--base-tertiary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "userContent") {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">upload_file</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>User Uploads</span>
          </button>
        </div>
      </nav>

      <div className="p-3 lg:p-4" style={{borderTop: '1px solid var(--base-tertiary)'}}>
        <div className="flex items-center">
          <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base font-bold" style={{backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)'}}>
            B
          </div>
          <div className={`${sidebarOpen ? 'block' : 'hidden'} ml-2 lg:ml-3`}>
            <p className="text-xs lg:text-sm font-semibold" style={{color: 'var(--secondary-primary)'}}>
              Benjamin
            </p>
            <a className="text-xs lg:text-sm transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'} href="#">
              View profile
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

type Website = {
  id: string;
  ownerId: string;
  userId?: string; // Add userId field
  title: string;
  url: string;
  description: string;
  priceCents?: number;
  price?: number;
  status: "pending" | "approved" | "rejected" | "priceConflict"; // Add priceConflict status
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  image?: string;
  views?: number;
  clicks?: number;
  DA?: number;              
  PA?: number;               
  Spam?: number;             
  OrganicTraffic?: number;   
  DR?: number;               
  RD?: string;
  // Price conflict fields
  conflictsWith?: string;
  conflictGroup?: string;
  isOriginal?: boolean;
};

type PurchaseRequest = {
  id: string;
  websiteId: string;
  websiteTitle: string;
  priceCents: number;
  totalCents: number;
  customerId: string;
  customerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
};

type ContentRequest = {
  _id: string;
  websiteId: string;
  websiteTitle?: string;
  topic: string;
  wordCount?: number;
  customerId: string;
  customerEmail?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  contentRequest?: any;
};

type UserContent = {
  _id: string;
  userId: string;
  userEmail?: string;
  websiteId?: string;
  websiteTitle?: string;
  requirements: string;
  pdf?: {
    filename: string;
    size: number;
  };
  createdAt: string;
};

type PriceConflict = {
  groupId: string;
  websites: Website[];
  url: string;
  originalPrice?: number;
  newPrice?: number;
};

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function SuperAdminDashboard() {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [selectedPurchases, setSelectedPurchases] = useState<string[]>([]);
  const [isAllWebsitesSelected, setIsAllWebsitesSelected] = useState(false);
  const [isAllPurchasesSelected, setIsAllPurchasesSelected] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [requests, setRequests] = useState<ContentRequest[]>([]);
  const [userContent, setUserContent] = useState<UserContent[]>([]);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [purchaseFilter, setPurchaseFilter] = useState<FilterType>("pending");
  const [loading, setLoading] = useState({ 
    websites: true, 
    purchases: true 
  });
  const [contentLoading, setContentLoading] = useState(true);
  const [userContentLoading, setUserContentLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [purchaseStats, setPurchaseStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [activeTab, setActiveTab] = useState<"websites" | "purchases" | "contentRequests" | "userContent" | "priceConflicts">("websites");
  const [priceConflicts, setPriceConflicts] = useState<PriceConflict[]>([]);
  const [priceConflictsLoading, setPriceConflictsLoading] = useState(true);

  useEffect(() => {
    refresh();
    refreshPurchaseRequests();
    fetchContentRequests();
    fetchUserContent();
    fetchPriceConflicts();
  }, [filter, purchaseFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelectAllWebsites = () => {
    if (isAllWebsitesSelected) {
      setSelectedWebsites([]);
    } else {
      setSelectedWebsites((websites || []).filter(w => w.status === "pending").map(website => website.id));
    }
    setIsAllWebsitesSelected(!isAllWebsitesSelected);
  };

  const toggleSelectAllPurchases = () => {
    if (isAllPurchasesSelected) {
      setSelectedPurchases([]);
    } else {
      setSelectedPurchases(
        (purchaseRequests || [])
          .filter(p => p.status === "pending")
          .map(purchase => purchase.id)
      );
    }
    setIsAllPurchasesSelected(!isAllPurchasesSelected);
  };

  const toggleWebsiteSelection = (id: string) => {
    const currentSelected = selectedWebsites || [];
    if (currentSelected.includes(id)) {
      setSelectedWebsites(currentSelected.filter(websiteId => websiteId !== id));
    } else {
      setSelectedWebsites([...currentSelected, id]);
    }
  };

  const togglePurchaseSelection = (id: string) => {
    const currentSelected = selectedPurchases || [];
    if (currentSelected.includes(id)) {
      setSelectedPurchases(currentSelected.filter(purchaseId => purchaseId !== id));
    } else {
      setSelectedPurchases([...currentSelected, id]);
    }
  };

  const approveSelectedWebsites = async () => {
    const currentSelected = selectedWebsites || [];
    if (currentSelected.length === 0) return;
    
    try {
      if (!confirm(`Are you sure you want to approve ${currentSelected.length} website(s)?`)) {
        return;
      }
      
      for (const websiteId of currentSelected) {
        await updateWebsiteStatus(websiteId, "approved");
      }
      
      setSelectedWebsites([]);
      setIsAllWebsitesSelected(false);
      
    } catch (error) {
      console.error("Failed to approve websites in bulk:", error);
      alert("Failed to approve some websites. Please try again.");
    }
  };

  const approveSelectedPurchases = async () => {
    const currentSelected = selectedPurchases || [];
    if (currentSelected.length === 0) return;
    
    try {
      if (!confirm(`Are you sure you want to approve ${currentSelected.length} purchase request(s)?`)) {
        return;
      }
      
      for (const purchaseId of currentSelected) {
        await updatePurchaseStatus(purchaseId, "approved");
      }
      
      setSelectedPurchases([]);
      setIsAllPurchasesSelected(false);
      
    } catch (error) {
      console.error("Failed to approve purchase requests in bulk:", error);
      alert("Failed to approve some purchase requests. Please try again.");
    }
  };

  function refresh() {
    setLoading(prev => ({ ...prev, websites: true }));
    fetch(`/api/websites?status=${filter}&role=superadmin`)
      .then(r => r.json())
      .then(data => {
        const websitesData = data.websites || data || [];
        setWebsites(Array.isArray(websitesData) ? websitesData : []);
        calculateStats(Array.isArray(websitesData) ? websitesData : []);
        
        // Reset selection when filter changes
        if (filter !== "pending") {
          setSelectedWebsites([]);
          setIsAllWebsitesSelected(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch websites:", err);
        setWebsites([]);
        calculateStats([]);
        alert("Failed to load websites");
      })
      .finally(() => setLoading(prev => ({ ...prev, websites: false })));
  }

  function refreshPurchaseRequests() {
    setLoading(prev => ({ ...prev, purchases: true }));
    fetch("/api/purchases?role=superadmin")
      .then(r => r.json())
      .then(data => {
        const purchaseData = Array.isArray(data) ? data : [];
        setPurchaseRequests(purchaseData);
        calculatePurchaseStats(purchaseData);
        
        // Reset selection when filter changes
        if (purchaseFilter !== "pending") {
          setSelectedPurchases([]);
          setIsAllPurchasesSelected(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch purchase requests:", err);
        setPurchaseRequests([]);
        calculatePurchaseStats([]);
        alert("Failed to load purchase requests");
      })
      .finally(() => setLoading(prev => ({ ...prev, purchases: false })));
  }

  async function fetchContentRequests() {
    setContentLoading(true);
    try {
      const res = await fetch("/api/content-requests");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setRequests(data.items);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching content requests:", err);
      setRequests([]);
    } finally {
      setContentLoading(false);
    }
  }

  async function fetchUserContent() {
    setUserContentLoading(true);
    try {
      const res = await fetch("/api/admin/user-content");
      const data = await res.json();
      if (data.items && Array.isArray(data.items)) {
        setUserContent(data.items);
      } else {
        setUserContent([]);
      }
    } catch (err) {
      console.error("Error fetching user content:", err);
      setUserContent([]);
    } finally {
      setUserContentLoading(false);
    }
  }

  // Function to fetch price conflicts
  async function fetchPriceConflicts() {
    setPriceConflictsLoading(true);
    try {
      const response = await fetch('/api/price-conflicts');
      if (response.ok) {
        const data = await response.json();
        setPriceConflicts(data.conflicts || []);
      } else {
        console.error('Failed to fetch price conflicts');
        setPriceConflicts([]);
      }
    } catch (error) {
      console.error('Error fetching price conflicts:', error);
      setPriceConflicts([]);
    } finally {
      setPriceConflictsLoading(false);
    }
  }

  // Function to resolve a price conflict
  async function resolvePriceConflict(conflictGroup: string, selectedWebsiteId: string, reason?: string) {
    try {
      const response = await fetch('/api/price-conflicts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conflictGroup,
          selectedWebsiteId,
          reason: reason || 'Price conflict resolved by admin'
        })
      });

      if (response.ok) {
        alert('Price conflict resolved successfully!');
        fetchPriceConflicts(); // Refresh the list
        refresh(); // Also refresh the main website list
      } else {
        const error = await response.json();
        alert('Failed to resolve conflict: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error resolving price conflict:', error);
      alert('Network error. Please try again.');
    }
  }

  function calculateStats(websites: Website[]) {
    const validWebsites = websites || [];
    const stats = {
      pending: validWebsites.filter(w => w.status === "pending").length,
      approved: validWebsites.filter(w => w.status === "approved").length,
      rejected: validWebsites.filter(w => w.status === "rejected").length,
      total: validWebsites.length
    };
    setStats(stats);
  }

  function calculatePurchaseStats(requests: PurchaseRequest[]) {
    const validRequests = requests || [];
    const stats = {
      pending: validRequests.filter(r => r.status === "pending").length,
      approved: validRequests.filter(r => r.status === "approved").length,
      rejected: validRequests.filter(r => r.status === "rejected").length,
      total: validRequests.length
    };
    setPurchaseStats(stats);
  }

  async function updateWebsiteStatus(id: string, status: "approved" | "rejected", reason?: string) {
    const res = await fetch(`/api/websites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: status === "approved" ? "approve" : "reject",
        ...(reason && { reason }) 
      }),
    });

    if (res.ok) {
      refresh();
      setShowRejectModal(false);
      setRejectionReason("");
    } else {
      const err = await res.json();
      console.error("Failed to update status:", err);
      alert("Failed to update status: " + JSON.stringify(err));
    }
  }

  async function updatePurchaseStatus(purchaseId: string, status: "approved" | "rejected") {
    const res = await fetch("/api/purchases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        purchaseId,
        status
      }),
    });

    if (res.ok) {
      refreshPurchaseRequests();
      alert("Purchase status updated successfully");
    } else {
      const err = await res.json();
      console.error("Failed to update purchase status:", err);
      alert("Failed to update purchase status: " + JSON.stringify(err));
    }
  }

  function openRejectModal(website: Website) {
    setSelectedWebsite(website);
    setRejectionReason(website.rejectionReason || "");
    setShowRejectModal(true);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB"); 
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredPurchaseRequests = (purchaseRequests || []).filter(request => {
    if (purchaseFilter === "all") return true;
    return request.status === purchaseFilter;
  });

  if (loading.websites && loading.purchases && contentLoading) {
    return (
      <div className="flex h-screen" style={{backgroundColor: 'var(--base-primary)'}}>
        <div className="w-64" style={{backgroundColor: 'var(--base-primary)'}}></div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 mx-auto" style={{borderColor: 'var(--base-tertiary)', borderTopColor: 'var(--accent-primary)'}}></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 animate-spin mx-auto" style={{borderColor: 'var(--base-tertiary)', borderTopColor: 'var(--accent-hover)', animationDelay: '0.1s', animationDuration: '1.2s'}}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{color: 'var(--secondary-primary)'}}>Loading Dashboard</h3>
              <p className="text-sm" style={{color: 'var(--secondary-lighter)'}}>Fetching admin data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen overflow-x-hidden" style={{backgroundColor: 'var(--base-primary)'}}>
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto overflow-x-hidden min-w-0 max-w-none w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold" style={{color: 'var(--secondary-primary)'}}>
              {activeTab === "websites" && "Website Moderation"}
              {activeTab === "purchases" && "Purchase Requests"}
              {activeTab === "contentRequests" && "Content Requests"}
              {activeTab === "userContent" && "User Uploads"}
              {activeTab === "priceConflicts" && "Price Conflicts"}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg" style={{color: 'var(--secondary-lighter)'}}>
              {activeTab === "priceConflicts" 
                ? "Resolve conflicts when multiple users submit the same URL with different prices" 
                : "Manage websites, purchases, and content requests"}
            </p>
          </div>
          <button 
            onClick={activeTab === "websites" ? refresh : activeTab === "purchases" ? refreshPurchaseRequests : activeTab === "priceConflicts" ? fetchPriceConflicts : fetchContentRequests}
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

        {/* Content based on active tab */}
        {activeTab === "priceConflicts" ? (
          /* Price Conflicts Section */
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/5 to-teal-600/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-gray-800 via-cyan-800 to-teal-800 bg-clip-text text-transparent">
                  Price Conflicts
                </span>
              </h2>

              {priceConflictsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-cyan-200 border-t-cyan-500 mx-auto"></div>
                    <p className="text-cyan-600 font-medium">Loading price conflicts...</p>
                  </div>
                </div>
              ) : priceConflicts.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Price Conflicts</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Great! There are currently no URL conflicts to resolve. When users submit duplicate URLs with different prices, they will appear here for your decision.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {priceConflicts.map((conflict, index) => (
                    <div key={conflict.groupId} className="bg-white/70 rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-6 py-4 border-b border-gray-200/50">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          URL Conflict #{index + 1}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 font-mono bg-gray-100 px-3 py-1 rounded">
                          {conflict.url}
                        </p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {conflict.websites.map((website, idx) => (
                            <div 
                              key={website.id}
                              className={`relative rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                                website.isOriginal 
                                  ? 'border-blue-200 bg-blue-50/50' 
                                  : 'border-orange-200 bg-orange-50/50'
                              }`}
                            >
                              <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  website.isOriginal 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {website.isOriginal ? 'Original' : 'New Submission'}
                                </span>
                              </div>
                              
                              <div className="space-y-3 mt-6">
                                <h4 className="font-semibold text-gray-900 text-lg">{website.title}</h4>
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Price:</span> 
                                    <span className="text-lg font-bold ml-2">
                                      ${(website.price || 0).toFixed(2)}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Submitted:</span> 
                                    <span className="ml-2">{formatDate(website.createdAt)}</span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Owner:</span> 
                                    <span className="ml-2">{website.ownerId || website.userId || 'N/A'}</span>
                                  </p>
                                </div>
                                
                                {/* SEO Metrics */}
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500">DA</div>
                                    <div className="font-semibold">{website.DA || 0}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500">DR</div>
                                    <div className="font-semibold">{website.DR || 0}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500">Spam</div>
                                    <div className="font-semibold">{website.Spam || 0}</div>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-700 bg-white/70 p-3 rounded border">
                                  <span className="font-medium">Description:</span><br/>
                                  {website.description || 'No description provided'}
                                </p>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to approve "${website.title}" and reject the other submission?`)) {
                                      resolvePriceConflict(conflict.groupId, website.id);
                                    }
                                  }}
                                  className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                                    website.isOriginal
                                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  Select This Submission
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                          <p className="text-sm text-gray-600">
                            <strong>Price Difference:</strong> 
                            ${Math.abs((conflict.originalPrice || 0) - (conflict.newPrice || 0)).toFixed(2)}
                            {(conflict.newPrice || 0) < (conflict.originalPrice || 0) 
                              ? ' (New submission is cheaper)' 
                              : ' (Original is cheaper)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : activeTab === "userContent" ? (
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-amber-600/5 to-yellow-600/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-gray-800 via-orange-800 to-amber-800 bg-clip-text text-transparent">
                  User Uploaded Content
                </span>
              </h2>
              {userContentLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-orange-200 border-t-orange-500 mx-auto"></div>
                    <p className="text-orange-600 font-medium">Loading user content...</p>
                  </div>
                </div>
              ) : (userContent || []).length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Content Uploads Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">There are currently no user content uploads to display. Check back later or refresh the page.</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200/50 rounded-2xl shadow-lg bg-white/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">User Email</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Website</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">PDF Filename</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">File Size</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Requirements</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Uploaded At</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Content Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(userContent || []).map((content, index) => (
                          <tr key={content._id} className={`hover:bg-orange-50/50 transition-colors border-b border-gray-100/50 ${
                            index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                          }`}>
                            <td className="px-6 py-4 text-gray-700 font-medium">
                              {content.userEmail || content.userId || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {content.websiteTitle || content.websiteId || 
                                <span className="text-gray-400 italic">No website</span>
                              }
                            </td>
                            <td className="px-6 py-4">
                              <a 
                                href={`/api/admin/pdf/${content._id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 hover:underline font-medium transition-colors group"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                {content.pdf?.filename || "PDF Document"}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {content.pdf?.size ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {(content.pdf.size / 1024).toFixed(1)} KB
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <p className="text-gray-700 truncate" title={content.requirements || ''}>
                                  {content.requirements || 'No requirements'}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(content.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200">
                                My Content
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === "contentRequests" ? (
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-violet-600/5 to-indigo-600/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-gray-800 via-purple-800 to-violet-800 bg-clip-text text-transparent">
                  Content Requests
                </span>
              </h2>
              {contentLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-200 border-t-purple-500 mx-auto"></div>
                    <p className="text-purple-600 font-medium">Loading content requests...</p>
                  </div>
                </div>
              ) : (requests || []).length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Content Requests Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">There are currently no content requests to display. Users will see their requests appear here once submitted.</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200/50 rounded-2xl shadow-lg bg-white/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Website</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Topic</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Word Count</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Customer</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Created At</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Content Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(requests || []).map((req, index) => (
                          <tr key={req._id} className={`hover:bg-purple-50/50 transition-colors border-b border-gray-100/50 ${
                            index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                          }`}>
                            <td className="px-6 py-4 text-gray-700 font-medium">
                              {req.websiteTitle || req.websiteId || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              <div className="max-w-xs">
                                <p className="font-medium truncate" title={req.topic || ''}>{req.topic || 'No topic'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {req.wordCount ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {req.wordCount} words
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">
                              {req.customerId || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {req.customerEmail || <span className="text-gray-400 italic">No email</span>}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                (req.status || 'pending') === "pending" ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200" :
                                (req.status || 'pending') === "approved" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200" :
                                "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
                              }`}>
                                {(req.status || 'pending').charAt(0).toUpperCase() + (req.status || 'pending').slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(req.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                                Request Content
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === "purchases" ? (
          /* Purchase Requests Section */
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-gray-800 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Purchase Requests
                </span>
              </h2>
            
              {/* Bulk Actions Toolbar - Only show for pending purchases */}
              {purchaseFilter === "pending" && filteredPurchaseRequests.length > 0 && (
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isAllPurchasesSelected}
                      onChange={toggleSelectAllPurchases}
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {(selectedPurchases || []).length > 0 
                        ? `${(selectedPurchases || []).length} purchase(s) selected` 
                        : "Select all"}
                    </span>
                  </div>
                  
                  {(selectedPurchases || []).length > 0 && (
                    <button
                      onClick={approveSelectedPurchases}
                      disabled={(selectedPurchases || []).length === 0}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Selected ({(selectedPurchases || []).length})
                    </button>
                  )}
                </div>
              )}
            
              {/* Purchase Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
                <div className="bg-white/60 backdrop-blur-sm p-4 lg:p-5 rounded-xl border border-gray-200/50 shadow-sm">
                  <h3 className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total Requests</h3>
                  <p className="text-xl lg:text-2xl font-bold text-gray-800">{purchaseStats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 lg:p-5 rounded-xl border border-yellow-200/50 shadow-sm">
                  <h3 className="text-xs lg:text-sm font-medium text-yellow-700 mb-1">Pending</h3>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-800">{purchaseStats.pending}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 lg:p-5 rounded-xl border border-green-200/50 shadow-sm">
                  <h3 className="text-xs lg:text-sm font-medium text-green-700 mb-1">Approved</h3>
                  <p className="text-xl lg:text-2xl font-bold text-green-800">{purchaseStats.approved}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 lg:p-5 rounded-xl border border-red-200/50 shadow-sm">
                  <h3 className="text-xs lg:text-sm font-medium text-red-700 mb-1">Rejected</h3>
                  <p className="text-xl lg:text-2xl font-bold text-red-800">{purchaseStats.rejected}</p>
                </div>
              </div>

            {/* Purchase Filter Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
              {(["all", "pending", "approved", "rejected"] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPurchaseFilter(tab)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                    purchaseFilter === tab
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "pending" && purchaseStats.pending > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      purchaseFilter === tab 
                        ? "bg-white text-green-500" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {purchaseStats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Purchase Requests List */}
            {filteredPurchaseRequests.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Purchase Requests Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">No purchase requests found with status: <span className="font-medium">{purchaseFilter}</span>. Requests will appear here as users make purchases.</p>
              </div>
            ) : (
              <div className="overflow-hidden border border-gray-200/50 rounded-2xl shadow-lg bg-white/50">
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-20 gap-4 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 flex justify-center">
                      {purchaseFilter === "pending" && (
                        <input 
                          type="checkbox" 
                          checked={isAllPurchasesSelected}
                          onChange={toggleSelectAllPurchases}
                          className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                      )}
                    </div>
                    <div className="col-span-4 flex items-center">WEBSITE NAME</div>
                    <div className="col-span-2 flex justify-center">PRICE</div>
                    <div className="col-span-2 flex justify-center">TOTAL</div>
                    <div className="col-span-3 flex justify-center">CUSTOMER EMAIL</div>
                    <div className="col-span-2 flex justify-center">REQUEST ID</div>
                    <div className="col-span-2 flex justify-center">STATUS</div>
                    <div className="col-span-2 flex justify-center">REQUESTED</div>
                    <div className="col-span-2 flex justify-center">ACTIONS</div>
                  </div>
                  
                  {/* Table Body */}
                  <div className="divide-y divide-gray-100/50">
                    {filteredPurchaseRequests.map((request, index) => (
                      <div key={request.id} className={`grid grid-cols-20 gap-4 px-6 py-4 hover:bg-green-50/50 items-center transition-colors ${
                        index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'
                      }`}>
                        {/* Checkbox */}
                        <div className="col-span-1 flex justify-center">
                          {(request.status || 'pending') === 'pending' && (
                            <input 
                              type="checkbox" 
                              checked={(selectedPurchases || []).includes(request.id)}
                              onChange={() => togglePurchaseSelection(request.id)}
                              className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" 
                            />
                          )}
                        </div>
                        
                        {/* Website Name */}
                        <div className="col-span-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                              {(request.websiteTitle || 'W').charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{request.websiteTitle || 'Untitled'}</div>
                              <div className="text-xs text-gray-500">ID: {request.websiteId || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(request.priceCents)}
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm font-bold text-green-600">
                            {formatCurrency(request.totalCents)}
                          </div>
                        </div>
                        
                        {/* Customer Email */}
                        <div className="col-span-3 flex justify-center">
                          <div className="text-sm text-gray-700 truncate max-w-[150px]" title={request.customerEmail || ''}>
                            {request.customerEmail || 'N/A'}
                          </div>
                        </div>
                        
                        {/* Request ID */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm text-gray-500 font-mono truncate max-w-[80px]" title={request.id || ''}>
                            {(request.id || '').substring(0, 8)}...
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (request.status || 'pending') === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : (request.status || 'pending') === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(request.status || 'pending').toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Requested Date */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm text-gray-600">
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-2 flex justify-center">
                          {(request.status || 'pending') === 'pending' ? (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => updatePurchaseStatus(request.id, "approved")}
                                className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                title="Approve Purchase"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => updatePurchaseStatus(request.id, "rejected")}
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                title="Reject Purchase"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              {(request.status || 'pending') === 'approved' ? '✓ Approved' : '✗ Rejected'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>
          </section>
        ) : (
          <div>
            {/* Website Moderation Section */}
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-500">{(websites || []).length} websites found</span>
              </div>
              <div className="flex items-center gap-4">
                {filter === "pending" && (websites || []).length > 0 && (selectedWebsites || []).length > 0 && (
                  <button
                    onClick={approveSelectedWebsites}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Selected ({(selectedWebsites || []).length})
                  </button>
                )}
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Total Websites</p>
                    <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--accent-light)'}}>
                    <svg className="w-6 h-6" style={{color: 'var(--accent-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Pending</p>
                    <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--warning)'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Approved</p>
                    <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.approved}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--success)'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Rejected</p>
                    <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.rejected}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--error)'}}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading.websites ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading websites...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {(websites || []).length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Found</h3>
                    <p className="text-gray-600">No websites found with status: {filter}</p>
                  </div>
                ) : (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-20 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="col-span-1 flex justify-center">
                        {filter === "pending" && (
                          <input 
                            type="checkbox" 
                            checked={isAllWebsitesSelected}
                            onChange={toggleSelectAllWebsites}
                            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                      <div className="col-span-4 flex items-center">WEBSITE NAME</div>
                      <div className="col-span-2 flex justify-center">PRICE</div>
                      <div className="col-span-1 flex justify-center">DA</div>
                      <div className="col-span-1 flex justify-center">DR</div>
                      <div className="col-span-2 flex justify-center">ORGANIC TRAFFIC</div>
                      <div className="col-span-1 flex justify-center">SPAM</div>
                      <div className="col-span-2 flex justify-center">OWNER</div>
                      <div className="col-span-2 flex justify-center">STATUS</div>
                      <div className="col-span-3 flex justify-center">ACTIONS</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {(websites || []).map((website, idx) => {
                        return (
                          <div key={website.id || idx} className="grid grid-cols-20 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                            {/* Checkbox */}
                            <div className="col-span-1 flex justify-center">
                              {(website.status || 'pending') === 'pending' && (
                                <input 
                                  type="checkbox" 
                                  checked={(selectedWebsites || []).includes(website.id)}
                                  onChange={() => toggleWebsiteSelection(website.id)}
                                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                                />
                              )}
                            </div>
                            
                            {/* Website Info */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                {website.image ? (
                                  <Image
                                    src={website.image}
                                    alt="website thumbnail"
                                    width={40}
                                    height={40}
                                    className="rounded-lg object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                    {(website.title || 'W').charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{website.title || 'Untitled'}</div>
                                  <div className="text-xs text-gray-500 truncate max-w-[200px]" title={website.url || ''}>
                                    {(website.url || '').length > 40 ? `${(website.url || '').substring(0, 40)}...` : (website.url || '')}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">
                                {website.priceCents ? `$${(website.priceCents / 100).toFixed(2)}` : 
                                 website.price ? `$${website.price.toFixed(2)}` : '$0.00'}
                              </div>
                            </div>
                            
                            {/* DA */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{website.DA || 0}</div>
                            </div>
                            
                            {/* DR */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{website.DR || 0}</div>
                            </div>
                            
                            {/* Organic Traffic */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{website.OrganicTraffic || 0}</div>
                            </div>
                            
                            {/* Spam */}
                            <div className="col-span-1 flex justify-center">
                              <div className="text-sm font-medium text-gray-900">{website.Spam || 0}</div>
                            </div>
                            
                            {/* Owner */}
                            <div className="col-span-2 flex justify-center">
                              <div className="text-sm text-gray-900 truncate max-w-[120px]" title={website.ownerId || ''}>
                                {(website.ownerId || '').length > 15 ? `${(website.ownerId || '').substring(0, 15)}...` : (website.ownerId || '')}
                              </div>
                            </div>
                            
                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                (website.status || 'pending') === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : (website.status || 'pending') === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {(website.status || 'pending').toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-3 flex justify-center">
                              <div className="flex space-x-2">
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-500 hover:text-gray-700 p-1"
                                  title="Visit Website"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                                
                                {(website.status || 'pending') === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateWebsiteStatus(website.id, "approved")}
                                      className="text-green-600 hover:text-green-800 p-1"
                                      title="Approve Website"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => openRejectModal(website)}
                                      className="text-red-600 hover:text-red-800 p-1"
                                      title="Reject Website"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
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

                            {/* Show rejection reason if rejected */}
                            {(website.status || 'pending') === 'rejected' && website.rejectionReason && (
                              <div className="col-span-20 px-6 py-2 bg-red-50 border-l-4 border-red-400">
                                <p className="text-sm text-red-700">
                                  <strong>Rejection Reason:</strong> {website.rejectionReason}
                                </p>
                              </div>
                            )}
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
        
        {/* Rejection Modal */}
        {showRejectModal && selectedWebsite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 lg:p-5 rounded-xl w-full max-w-sm lg:max-w-md shadow-lg border border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold mb-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Reject Website
              </h3>
              <p className="text-gray-600 text-xs lg:text-sm mb-3">
                Please provide a reason for rejecting &quot;{(selectedWebsite?.title || 'this website')}&quot;:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border rounded-lg h-20 lg:h-24 resize-none text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-xs lg:text-sm hover:bg-gray-300 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateWebsiteStatus(selectedWebsite?.id || '', "rejected", rejectionReason)}
                  className="px-3 py-2 bg-red-500 text-white rounded text-xs lg:text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto"
                  disabled={!rejectionReason.trim()}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    );
  }