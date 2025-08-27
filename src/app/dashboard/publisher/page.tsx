"use client";

import { useEffect, useState } from "react";

type Website = {
  _id: string;
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
};

type AdRequest = {
  _id: string;
  websiteId: Website;
  message: string;
  status: string;
  createdAt: string;
};

export default function PublisherDashboard() {
  const [mySites, setMySites] = useState<Website[]>([]);
  const [adRequests, setAdRequests] = useState<AdRequest[]>([]);
  const [form, setForm] = useState({ 
    title: "", 
    url: "", 
    description: "", 
    priceCents: 0,
    category: "",
    tags: ""
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"websites" | "adRequests">("websites");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    Promise.all([
      fetch("/api/websites?owner=me").then(r => r.json()),
      fetch("/api/ad-requests?role=publisher").then(r => r.json())
    ])
    .then(([sitesData, adRequestsData]) => {
      const rawSites = sitesData.websites || sitesData || [];
      const normalizedSites = Array.isArray(rawSites)
        ? rawSites.map((s: any) => ({
            ...s,
            // Normalize priceCents from either priceCents or price (dollars)
            priceCents:
              typeof s.priceCents === "number" && !Number.isNaN(s.priceCents)
                ? s.priceCents
                : typeof s.price === "number" && !Number.isNaN(s.price)
                  ? Math.round(s.price * 100)
                  : 0,
          }))
        : [];
      setMySites(normalizedSites);
      setAdRequests(adRequestsData.adRequests || adRequestsData);
    })
    .catch(err => {
      console.error("Failed to fetch data:", err);
      alert("Failed to load data");
    })
    .finally(() => setLoading(false));
  }

  async function createSite(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);
    
    try {
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: form.title,
          url: form.url,
          description: form.description,
          priceCents: Number(form.priceCents),
          category: form.category,
          tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });
      
      if (res.ok) {
        setForm({ 
          title: "", 
          url: "", 
          description: "", 
          priceCents: 0, 
          category: "", 
          tags: "" 
        });
        refresh();
        alert("Website submitted for approval!");
      } else {
        const err = await res.json(); 
        console.error("Create site error:", err);
        alert("Error: " + (err.error || JSON.stringify(err)));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please try again.");
    }
  }

  async function removeSite(id: string) {
    if (!confirm("Are you sure you want to delete this website?")) return;
    
    setDeleteLoading(id); // Show loading state for this specific site
    
    try {
      const res = await fetch(`/api/websites/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Remove the site from local state immediately for better UX
        setMySites(prevSites => prevSites.filter(site => site._id !== id));
        alert("Website deleted successfully!");
      } else {
        console.error("Delete error:", data);
        if (res.status === 401) {
          alert("Please log in to delete websites");
        } else if (res.status === 403) {
          alert("You don't have permission to delete this website");
        } else if (res.status === 404) {
          alert("Website not found");
          // Remove from local state anyway since it doesn't exist
          setMySites(prevSites => prevSites.filter(site => site._id !== id));
        } else {
          alert("Failed to delete website: " + (data.error || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Network error during delete:", error);
      alert("Network error occurred. Please check your connection and try again.");
    } finally {
      setDeleteLoading(null); // Clear loading state
    }
  }

  function getStatusBadge(status: string, rejectionReason?: string) {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "approved":
        return <span className={`${baseClass} bg-green-100 text-green-800`}>Approved</span>;
      case "rejected":
        return (
          <div className="flex items-center gap-1">
            <span className={`${baseClass} bg-red-100 text-red-800`}>Rejected</span>
            {rejectionReason && (
              <div className="group relative">
                <span className="text-red-500 cursor-help">❓</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <strong>Reason:</strong> {rejectionReason}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>Pending Review</span>;
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  // ✅ Safe formatter to fix NaN issues
  function formatPrice(cents?: number) {
    if (!cents || isNaN(cents)) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredSites = statusFilter === "all" 
    ? mySites 
    : mySites.filter(site => site.status === statusFilter);

  if (loading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Publisher Dashboard</h1>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("websites")}
          className={`px-6 py-3 font-medium ${
            activeTab === "websites"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Websites
        </button>
        <button
          onClick={() => setActiveTab("adRequests")}
          className={`px-6 py-3 font-medium ${
            activeTab === "adRequests"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ad Requests ({adRequests.length})
        </button>
      </div>

      {activeTab === "websites" ? (
        <>
          {/* Add Website Form */}
          <section className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-2xl font-semibold mb-4">Add New Website</h2>
            <form onSubmit={createSite} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Website Title"
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                  type="url"
                  value={form.url} 
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number" 
                  placeholder="0.00"
                  step="0.01"
                  value={form.priceCents ? (form.priceCents / 100).toFixed(2) : ""}
                  onChange={e => setForm({ ...form, priceCents: Math.round(parseFloat(e.target.value || "0") * 100) })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="blog">Blog</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="business">Business</option>
                  <option value="educational">Educational</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3"
                  value={form.tags} 
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your website..."
                  rows={3}
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <button 
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  type="submit"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </section>

          {/* Websites List */}
          <section className="bg-white p-6 rounded-lg shadow border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">My Websites ({mySites.length})</h2>
              
              {/* Status Filter */}
              <div className="flex gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      statusFilter === filter
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredSites.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {statusFilter === "all" 
                  ? "You haven't added any websites yet."
                  : `No ${statusFilter} websites found.`
                }
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredSites.filter(Boolean).map((site, idx) => (
                  <div key={site._id || idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{site.title}</h3>
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              {site.url}
                            </a>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(site.priceCents)}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-3">{site.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                          {getStatusBadge(site.status, site.rejectionReason)}
                          {site.views !== undefined && (
                            <span>Views: {site.views}</span>
                          )}
                          {site.clicks !== undefined && (
                            <span>Clicks: {site.clicks}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        {site.status === "pending" && (
                          <button 
                            onClick={() => removeSite(site._id)}
                            disabled={deleteLoading === site._id}
                            className={`px-3 py-1 text-white rounded-md transition-colors text-sm ${
                              deleteLoading === site._id
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            {deleteLoading === site._id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                        {site.status === "approved" && (
                          <span className="text-green-600 text-sm">✓ Live on platform</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* Ad Requests Section */
        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-semibold mb-6">Ad Requests ({adRequests.length})</h2>
          
          {adRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No ad requests for your websites yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {adRequests.filter(Boolean).map((ar, idx) => (
                <div key={ar._id || idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">{ar.websiteId?.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      ar.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : ar.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ar.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{ar.message}</p>
                  
                  <div className="text-sm text-gray-500">
                    Received: {new Date(ar.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
