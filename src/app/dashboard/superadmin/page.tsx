"use client";

import { useEffect, useState } from "react";

type Website = {
  id: string;
  ownerId: string;
  title: string;
  url: string;
  description: string;
  priceCents?: number;
  price?: number;
  status: "pending" | "approved" | "rejected";
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
  contentRequest?: any; // Additional content request data
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

type ConsumerRequest = {
  _id : string;
  customerEmail?: string;
}

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function SuperAdminDashboard() {
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

  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [activeTab, setActiveTab] = useState<"websites" | "purchases" | "contentRequests" | "userContent">("websites");

  useEffect(() => {
    refresh();
    refreshPurchaseRequests();
    fetchContentRequests();
    fetchUserContent();
  }, [filter, purchaseFilter]);

  function refresh() {
    setLoading(prev => ({ ...prev, websites: true }));
    fetch(`/api/websites?status=${filter}&role=superadmin`)
      .then(r => r.json())
      .then(data => {
        setWebsites(data.websites || data);
        calculateStats(data.websites || data);
      })
      .catch(err => {
        console.error("Failed to fetch websites:", err);
        alert("Failed to load websites");
      })
      .finally(() => setLoading(prev => ({ ...prev, websites: false })));
  }

  function refreshPurchaseRequests() {
    setLoading(prev => ({ ...prev, purchases: true }));
    fetch("/api/purchases?role=superadmin")
      .then(r => r.json())
      .then(data => {
        setPurchaseRequests(data);
        calculatePurchaseStats(data);
      })
      .catch(err => {
        console.error("Failed to fetch purchase requests:", err);
        alert("Failed to load purchase requests");
      })
      .finally(() => setLoading(prev => ({ ...prev, purchases: false })));
  }

  async function fetchContentRequests() {
    setContentLoading(true);
    try {
      const res = await fetch("/api/content-requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.items);
      }
    } catch (err) {
      console.error("Error fetching content requests:", err);
    } finally {
      setContentLoading(false);
    }
  }

  async function fetchUserContent() {
    setUserContentLoading(true);
    try {
      const res = await fetch("/api/admin/user-content");
      const data = await res.json();
      if (data.items) {
        setUserContent(data.items);
      }
    } catch (err) {
      console.error("Error fetching user content:", err);
    } finally {
      setUserContentLoading(false);
    }
  }

  function calculateStats(websites: Website[]) {
    const stats = {
      pending: websites.filter(w => w.status === "pending").length,
      approved: websites.filter(w => w.status === "approved").length,
      rejected: websites.filter(w => w.status === "rejected").length,
      total: websites.length
    };
    setStats(stats);
  }

  function calculatePurchaseStats(requests: PurchaseRequest[]) {
    const stats = {
      pending: requests.filter(r => r.status === "pending").length,
      approved: requests.filter(r => r.status === "approved").length,
      rejected: requests.filter(r => r.status === "rejected").length,
      total: requests.length
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
  return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
}

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredPurchaseRequests = purchaseRequests.filter(request => {
    if (purchaseFilter === "all") return true;
    return request.status === purchaseFilter;
  });

  if (loading.websites && loading.purchases && contentLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage websites, purchases, and content requests</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={activeTab === "websites" ? refresh : activeTab === "purchases" ? refreshPurchaseRequests : fetchContentRequests}
                className="px-3.5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1.5 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b mt-5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("websites")}
              className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === "websites"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website Moderation ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === "purchases"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Purchase Requests ({purchaseStats.total})
            </button>
            <button
              onClick={() => setActiveTab("contentRequests")}
              className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === "contentRequests"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Content Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab("userContent")}
              className={`px-4 py-2.5 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === "userContent"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              User Uploads ({userContent.length})
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "userContent" ? (
          <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              User Uploaded Content
            </h2>
            {userContentLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : userContent.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 mt-2">No user content uploads found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">User Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Website</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">PDF Filename</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">File Size</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Requirements</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Uploaded At</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Content Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userContent.map(content => (
                      <tr key={content._id} className="hover:bg-gray-50 even:bg-gray-50/50">
                        <td className="px-4 py-3 border-b">{content.userEmail || content.userId}</td>
                        <td className="px-4 py-3 border-b">{content.websiteTitle || content.websiteId || "-"}</td>
                        <td className="px-4 py-3 border-b">
                          <a 
                            href={`/api/admin/pdf/${content._id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {content.pdf?.filename || "PDF Document"}
                          </a>
                        </td>
                        <td className="px-4 py-3 border-b">{content.pdf?.size ? `${(content.pdf.size / 1024).toFixed(1)} KB` : "-"}</td>
                        <td className="px-4 py-3 border-b">
                          <div className="max-w-xs truncate">{content.requirements}</div>
                        </td>
                        <td className="px-4 py-3 border-b">{new Date(content.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 border-b">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            My Content
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : activeTab === "contentRequests" ? (
          <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Content Requests
            </h2>
            {contentLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mt-2">No content requests found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Website</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Topic</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Word Count</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Customer</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Created At</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 border-b">Content Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req._id} className="hover:bg-gray-50 even:bg-gray-50/50">
                        <td className="px-4 py-3 border-b">{req.websiteTitle || req.websiteId}</td>
                        <td className="px-4 py-3 border-b">{req.topic}</td>
                        <td className="px-4 py-3 border-b">{req.wordCount || "-"}</td>
                        <td className="px-4 py-3 border-b">{req.customerId}</td>
                        <td className="px-4 py-3 border-b">{req.customerEmail || "-"}</td>
                        <td className="px-4 py-3 border-b">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            req.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            req.status === "approved" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b">{new Date(req.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 border-b">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Request Content
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : activeTab === "purchases" ? (
          /* Purchase Requests Section */
          <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Purchase Requests
            </h2>
            
            {/* Purchase Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
                <p className="text-xl font-bold text-gray-800">{purchaseStats.total}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
                <p className="text-xl font-bold text-yellow-800">{purchaseStats.pending}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                <h3 className="text-sm font-medium text-green-700">Approved</h3>
                <p className="text-xl font-bold text-green-800">{purchaseStats.approved}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
                <h3 className="text-sm font-medium text-red-700">Rejected</h3>
                <p className="text-xl font-bold text-red-800">{purchaseStats.rejected}</p>
              </div>
            </div>

            {/* Purchase Filter Tabs */}
            <div className="flex space-x-1 border-b mb-4 overflow-x-auto">
              {(["all", "pending", "approved", "rejected"] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPurchaseFilter(tab)}
                  className={`px-3 py-2 rounded-t text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    purchaseFilter === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "pending" && purchaseStats.pending > 0 && (
                    <span className="bg-white text-blue-500 text-xs px-1.5 py-0.5 rounded-full">
                      {purchaseStats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Purchase Requests List */}
            {filteredPurchaseRequests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 mt-2">No purchase requests found with status: {purchaseFilter}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPurchaseRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {request.websiteTitle}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="space-y-1">
                            <p><span className="font-medium">Price:</span> {formatCurrency(request.priceCents)}</p>
                            <p><span className="font-medium">Total:</span> {formatCurrency(request.totalCents)}</p>
                          </div>
                          <div className="space-y-1">
                            <p><span className="font-medium">Customer:</span> {request.customerEmail}</p>
                            <p><span className="font-medium">Requested:</span> {formatDate(request.createdAt)}</p>
                            <p className="flex items-center gap-1.5">
                              <span className="font-medium">Status:</span> 
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {request.status.toUpperCase()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <button
                            onClick={() => updatePurchaseStatus(request.id, "approved")}
                            className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => updatePurchaseStatus(request.id, "rejected")}
                            className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Website Moderation Section */
          <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website Moderation
            </h2>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-600">Total Websites</h3>
                <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
                <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                <h3 className="text-sm font-medium text-green-700">Approved</h3>
                <p className="text-xl font-bold text-green-800">{stats.approved}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
                <h3 className="text-sm font-medium text-red-700">Rejected</h3>
                <p className="text-xl font-bold text-red-800">{stats.rejected}</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 border-b mb-4 overflow-x-auto">
              {(["all", "pending", "approved", "rejected"] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-2 rounded-t text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                    filter === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "pending" && stats.pending > 0 && (
                    <span className="bg-white text-blue-500 text-xs px-1.5 py-0.5 rounded-full">
                      {stats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Websites List */}
            {websites.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <p className="text-gray-500 mt-2">No websites found with status: {filter}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {websites.map((website, idx) => (
                  <div key={website.id || idx} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-3">
                      {/* Website Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {website.image && (
                            <img
                              src={website.image}
                              alt={website.title}
                              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                              {website.title}
                            </h3>
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-xs truncate block"
                            >
                              {website.url}
                            </a>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{website.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                              <span className="truncate">Owner: {website.ownerId}</span>
                              {website.category && (
                                <span>Category: {website.category}</span>
                              )}
                              <span>Created: {formatDate(website.createdAt)}</span>
                              {website.views !== undefined && (
                                <span>Views: {website.views}</span>
                              )}
                            </div>
                            
                            {website.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-xs">
                                <p className="text-red-700">
                                  <strong>Rejection Reason:</strong> {website.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions and Status */}
                      <div className="flex flex-col items-end gap-2 min-w-[140px]">
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            ${website.priceCents ? (website.priceCents / 100).toFixed(2) : website.price ? website.price.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            website.status === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : website.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {website.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        {website.status === 'pending' && (
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => updateWebsiteStatus(website.id, "approved")}
                              className="px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(website)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Additional info for approved/rejected websites */}
                        {website.status === 'approved' && website.approvedAt && (
                          <p className="text-xs text-green-600">
                            Approved on {formatDate(website.approvedAt)}
                          </p>
                        )}
                        {website.status === 'rejected' && website.rejectedAt && (
                          <p className="text-xs text-red-600">
                            Rejected on {formatDate(website.rejectedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Rejection Modal */}
        {showRejectModal && selectedWebsite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Reject Website
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Please provide a reason for rejecting "{selectedWebsite.title}":
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border rounded-lg h-24 resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateWebsiteStatus(selectedWebsite.id, "rejected", rejectionReason)}
                  className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-sm"
                  disabled={!rejectionReason.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}