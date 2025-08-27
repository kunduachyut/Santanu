// app/dashboard/superadmin/page.tsx (updated with active tabs)
"use client";

import { useEffect, useState } from "react";

type Website = {
  id: string;
  ownerId: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
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
};

type PurchaseRequest = {
  id: string;
  websiteId: string;
  websiteTitle: string;
  quantity: number;
  priceCents: number;
  totalCents: number;
  customerId: string;
  customerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
};

type FilterType = "all" | "pending" | "approved" | "rejected";

export default function SuperAdminDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [purchaseFilter, setPurchaseFilter] = useState<FilterType>("pending");
  const [loading, setLoading] = useState({ 
    websites: true, 
    purchases: true 
  });
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
  const [activeTab, setActiveTab] = useState<"websites" | "purchases">("websites");

  useEffect(() => {
    refresh();
    refreshPurchaseRequests();
  }, [filter, purchaseFilter]);

  function refresh() {
    setLoading(prev => ({ ...prev, websites: true }));
    // Fetch websites with status filter
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
    // Fetch purchase requests
    fetch("/api/purchases")
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

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  function formatCurrency(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredPurchaseRequests = purchaseRequests.filter(request => {
    if (purchaseFilter === "all") return true;
    return request.status === purchaseFilter;
  });

  if (loading.websites && loading.purchases) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={activeTab === "websites" ? refresh : refreshPurchaseRequests}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("websites")}
          className={`px-6 py-3 font-medium ${
            activeTab === "websites"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Website Moderation
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`px-6 py-3 font-medium ${
            activeTab === "purchases"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Purchase Requests ({purchaseStats.total})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "purchases" ? (
        /* Purchase Requests Section */
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Requests</h2>
          
          {/* Purchase Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Total Requests</h3>
              <p className="text-3xl font-bold text-gray-900">{purchaseStats.total}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
              <p className="text-3xl font-bold text-yellow-900">{purchaseStats.pending}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-lg font-semibold text-green-700">Approved</h3>
              <p className="text-3xl font-bold text-green-900">{purchaseStats.approved}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
              <h3 className="text-lg font-semibold text-red-700">Rejected</h3>
              <p className="text-3xl font-bold text-red-900">{purchaseStats.rejected}</p>
            </div>
          </div>

          {/* Purchase Filter Tabs */}
          <div className="flex space-x-2 border-b mb-6">
            {(["all", "pending", "approved", "rejected"] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setPurchaseFilter(tab)}
                className={`px-4 py-2 rounded-t-md transition-colors ${
                  purchaseFilter === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "pending" && purchaseStats.pending > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {purchaseStats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Purchase Requests List */}
          {filteredPurchaseRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No purchase requests found with status: {purchaseFilter}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPurchaseRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {request.websiteTitle}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Quantity:</strong> {request.quantity}</p>
                          <p><strong>Price:</strong> {formatCurrency(request.priceCents)} each</p>
                          <p><strong>Total:</strong> {formatCurrency(request.totalCents)}</p>
                        </div>
                        <div>
                          <p><strong>Customer:</strong> {request.customerEmail}</p>
                          <p><strong>Requested:</strong> {formatDate(request.createdAt)}</p>
                          <p>
                            <strong>Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
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
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <button
                          onClick={() => updatePurchaseStatus(request.id, "approved")}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Approve Purchase
                        </button>
                        <button
                          onClick={() => updatePurchaseStatus(request.id, "rejected")}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Reject Purchase
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
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Moderation</h2>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Total Websites</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-lg font-semibold text-green-700">Approved</h3>
              <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
              <h3 className="text-lg font-semibold text-red-700">Rejected</h3>
              <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 border-b mb-6">
            {(["all", "pending", "approved", "rejected"] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-t-md transition-colors ${
                  filter === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "pending" && stats.pending > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Websites List */}
          {websites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No websites found with status: {filter}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {websites.map((website, idx) => (
                <div key={website.id || idx} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Website Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {website.image && (
                          <img
                            src={website.image}
                            alt={website.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {website.title}
                          </h3>
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            {website.url}
                          </a>
                          <p className="text-gray-600 mt-2">{website.description}</p>
                          
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            <span>Owner: {website.ownerId}</span>
                            {website.category && (
                              <span>Category: {website.category}</span>
                            )}
                            <span>Created: {formatDate(website.createdAt)}</span>
                            {website.views !== undefined && (
                              <span>Views: {website.views}</span>
                            )}
                          </div>
                          
                          {website.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-red-700 text-sm">
                                <strong>Rejection Reason:</strong> {website.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-col items-end gap-3 min-w-[200px]">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          ${(website.priceCents / 100).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateWebsiteStatus(website.id, "approved")}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(website)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Additional info for approved/rejected websites */}
                      {website.status === 'approved' && website.approvedAt && (
                        <p className="text-sm text-green-600">
                          Approved on {formatDate(website.approvedAt)}
                        </p>
                      )}
                      {website.status === 'rejected' && website.rejectedAt && (
                        <p className="text-sm text-red-600">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Website</h3>
            <p className="text-gray-600 mb-2">
              Please provide a reason for rejecting "{selectedWebsite.title}":
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border rounded-md h-24 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => updateWebsiteStatus(selectedWebsite.id, "rejected", rejectionReason)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={!rejectionReason.trim()}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}