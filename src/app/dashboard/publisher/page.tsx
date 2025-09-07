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
  DA?: number;
  PA?: number;
  Spam?: number;
  OrganicTraffic?: number;
  DR?: number;
  RD?: string;
  category?: string;
  tags?: string;
};

// Sidebar component
function Sidebar({ activeTab, setActiveTab, stats }: {
  activeTab: string;
  setActiveTab: (tab: "dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings") => void;
  stats: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <aside className={`${sidebarOpen ? 'w-56 lg:w-64' : 'w-14 lg:w-16'} flex-shrink-0 flex flex-col bg-white transition-all duration-300 min-h-screen shadow-lg sticky top-0 h-screen overflow-y-auto`}>
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 h-14 sm:h-16 lg:h-[6.25rem] flex-shrink-0">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} text-xl lg:text-2xl font-bold text-gray-900`}>
          Publisher
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
        <div className="space-y-1 lg:space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "dashboard"
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">dashboard</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Dashboard</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-gray-100 space-y-1 lg:space-y-2">
          <button
            onClick={() => setActiveTab("websites")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "websites"
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">web</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>My Websites</span>
            {sidebarOpen && stats.total > 0 && (
              <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                {stats.total}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("add-website")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "add-website"
                ? 'text-purple-700 bg-purple-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">add</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Add Website</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-gray-100 space-y-1 lg:space-y-2">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "analytics"
                ? 'text-indigo-700 bg-indigo-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">analytics</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab("earnings")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "earnings"
                ? 'text-orange-700 bg-orange-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">monetization_on</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Earnings</span>
          </button>
        </div>

        <div className="pt-3 lg:pt-4 mt-3 lg:mt-4 border-t border-gray-100 space-y-1 lg:space-y-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg transition-colors text-sm lg:text-base ${
              activeTab === "settings"
                ? 'text-gray-700 bg-gray-50' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined mr-2 lg:mr-3 text-lg lg:text-xl">settings</span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
          </button>
        </div>
      </nav>

      <div className="p-3 lg:p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm lg:text-base">
            P
          </div>
          <div className={`${sidebarOpen ? 'block' : 'hidden'} ml-2 lg:ml-3`}>
            <p className="text-xs lg:text-sm font-semibold text-gray-800">Publisher</p>
            <a className="text-xs lg:text-sm text-gray-500 hover:text-green-600" href="#">View profile</a>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function PublisherDashboard() {
  const [mySites, setMySites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings">("websites");
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    price: '',
    DA: '',
    PA: '',
    Spam: '',
    OrganicTraffic: '',
    DR: '',
    RD: '',
    tags: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const newStats = {
      total: mySites.length,
      pending: mySites.filter(site => site.status === 'pending').length,
      approved: mySites.filter(site => site.status === 'approved').length,
      rejected: mySites.filter(site => site.status === 'rejected').length
    };
    setStats(newStats);
  }, [mySites]);

  // Reset form when switching away from add-website tab
  useEffect(() => {
    if (activeTab !== 'add-website') {
      resetForm();
    }
  }, [activeTab]);

  function refresh() {
    setLoading(true);
    fetch("/api/websites?owner=me")
      .then((r) => r.json())
      .then((sitesData) => {
        const rawSites = sitesData.websites || sitesData || [];
        const normalizedSites = Array.isArray(rawSites)
          ? rawSites
            .map((s: any) => {
              let siteId = null;
              if (s._id) {
                if (typeof s._id === 'string') {
                  siteId = s._id;
                } else if (typeof s._id === 'object') {
                  if (s._id.$oid) {
                    siteId = s._id.$oid;
                  } else if (s._id.toString) {
                    siteId = s._id.toString();
                  }
                }
              } else if (s.id) {
                siteId = s.id;
              }

              if (!siteId) {
                console.error('Warning: Site is missing ID:', JSON.stringify(s));
                return null;
              }

              return {
                ...s,
                _id: siteId,
                priceCents:
                  typeof s.priceCents === "number" &&
                    !Number.isNaN(s.priceCents)
                    ? s.priceCents
                    : typeof s.price === "number" &&
                      !Number.isNaN(s.price)
                      ? Math.round(s.price * 100)
                      : 0,
              };
            })
            .filter(Boolean)
          : [];
        setMySites(normalizedSites.filter(site => site._id));
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        alert("Failed to load data");
      })
      .finally(() => setLoading(false));
  }

  async function removeSite(id: string) {
    if (!id || id === 'undefined' || id === 'null') {
      alert('Cannot delete: Invalid website ID');
      return;
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      alert('Cannot delete: Invalid website ID format');
      return;
    }

    if (!confirm("Are you sure you want to delete this website?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/websites/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMySites((prevSites) => prevSites.filter((site) => site._id !== id));
        alert("Website deleted successfully!");
      } else {
        if (res.status === 401) alert("Please log in to delete websites");
        else if (res.status === 403) alert("You don't have permission to delete this website");
        else if (res.status === 404) {
          alert("Website not found");
          setMySites((prevSites) => prevSites.filter((site) => site._id !== id));
        } else alert("Failed to delete website: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Network error occurred. Please check your connection and try again.");
    } finally {
      setDeleteLoading(null);
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      url: '',
      description: '',
      category: '',
      price: '',
      DA: '',
      PA: '',
      Spam: '',
      OrganicTraffic: '',
      DR: '',
      RD: '',
      tags: ''
    });
    setEditingWebsite(null);
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function editWebsite(website: Website) {
    setEditingWebsite(website);
    setFormData({
      title: website.title,
      url: website.url,
      description: website.description,
      category: website.category || '',
      price: (website.priceCents / 100).toString(),
      DA: website.DA?.toString() || '',
      PA: website.PA?.toString() || '',
      Spam: website.Spam?.toString() || '',
      OrganicTraffic: website.OrganicTraffic?.toString() || '',
      DR: website.DR?.toString() || '',
      RD: website.RD || '',
      tags: website.tags || ''
    });
    setActiveTab('add-website');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        priceCents: Math.round(parseFloat(formData.price) * 100),
        DA: formData.DA ? parseInt(formData.DA) : undefined,
        PA: formData.PA ? parseInt(formData.PA) : undefined,
        Spam: formData.Spam ? parseInt(formData.Spam) : undefined,
        OrganicTraffic: formData.OrganicTraffic ? parseInt(formData.OrganicTraffic) : undefined,
        DR: formData.DR ? parseInt(formData.DR) : undefined
      };

      let res;
      if (editingWebsite) {
        // Update existing website
        res = await fetch(`/api/websites/${editingWebsite._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      } else {
        // Create new website
        res = await fetch('/api/websites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      }

      if (res.ok) {
        alert(editingWebsite ? 'Website updated successfully!' : 'Website submitted for approval!');
        resetForm();
        setActiveTab('websites');
        refresh();
      } else {
        const error = await res.json();
        alert('Error: ' + (error.error || 'Failed to save website'));
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  function getStatusBadge(status: string, rejectionReason?: string) {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "approved":
        return <span className={`${baseClass} bg-green-100 text-green-800 border border-green-200`}>Approved</span>;
      case "rejected":
        return (
          <div className="flex items-center gap-2">
            <span className={`${baseClass} bg-red-100 text-red-800 border border-red-200`}>Rejected</span>
            {rejectionReason && (
              <div className="group relative">
                <span className="text-red-500 cursor-help text-sm bg-red-50 rounded-full w-5 h-5 flex items-center justify-center">?</span>
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                  <strong>Reason:</strong> {rejectionReason}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-200`}>Pending Review</span>;
    }
  }

  function formatPrice(cents?: number) {
    if (!cents || isNaN(cents)) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredSites = statusFilter === "all" ? mySites : mySites.filter((site) => site.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
      
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {activeTab === "dashboard" && "Publisher Dashboard"}
              {activeTab === "websites" && "My Websites"}
              {activeTab === "add-website" && "Add New Website"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "earnings" && "Earnings"}
              {activeTab === "settings" && "Settings"}
            </h1>
            {activeTab === "websites" && (
              <p className="text-gray-600 mt-1">Manage your websites and track their approval status</p>
            )}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600">web</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Websites</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Approved</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-yellow-600">pending</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600">cancel</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Rejected</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("add-website")}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-blue-600 mr-3">add</span>
                    <div>
                      <p className="font-medium text-gray-900">Add Website</p>
                      <p className="text-sm text-gray-500">Submit a new website for approval</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("websites")}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-green-600 mr-3">web</span>
                    <div>
                      <p className="font-medium text-gray-900">Manage Websites</p>
                      <p className="text-sm text-gray-500">View and edit your websites</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-purple-600 mr-3">analytics</span>
                    <div>
                      <p className="font-medium text-gray-900">View Analytics</p>
                      <p className="text-sm text-gray-500">Track performance metrics</p>
                    </div>
                  </button>
                </div>
              </div>

              {mySites.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Websites</h3>
                  <div className="space-y-4">
                    {mySites.slice(0, 3).map((site) => (
                      <div key={site._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{site.title}</h4>
                          <p className="text-sm text-gray-500">{site.url}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(site.status, site.rejectionReason)}
                          <span className="text-sm font-medium text-green-600">
                            {formatPrice(site.priceCents)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {mySites.length > 3 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setActiveTab("websites")}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View all websites →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Websites Tab */}
          {activeTab === "websites" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={refresh}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                  </button>
                  <span className="text-sm font-medium text-gray-500">{mySites.length} websites</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected")}
                    className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {filteredSites.length === 0 ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-blue-600 text-2xl">web</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Found</h3>
                  <p className="text-gray-600 mb-4">You haven't added any websites yet. Get started by adding your first website!</p>
                  <button
                    onClick={() => setActiveTab("add-website")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm inline-flex items-center"
                  >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Add Website
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredSites.map((site) => (
                    <div
                      key={site._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-gray-900">{site.title}</h3>
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm inline-block mt-1"
                          >
                            {site.url}
                          </a>
                          <p className="text-gray-600 mt-2 text-sm">{site.description}</p>
                          
                          {/* SEO Metrics */}
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {site.DA && (
                              <div className="bg-blue-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-blue-600 font-medium">DA</p>
                                <p className="text-sm font-bold text-blue-800">{site.DA}</p>
                              </div>
                            )}
                            {site.DR && (
                              <div className="bg-green-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-green-600 font-medium">DR</p>
                                <p className="text-sm font-bold text-green-800">{site.DR}</p>
                              </div>
                            )}
                            {site.PA && (
                              <div className="bg-purple-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-purple-600 font-medium">PA</p>
                                <p className="text-sm font-bold text-purple-800">{site.PA}</p>
                              </div>
                            )}
                            {site.Spam !== undefined && (
                              <div className="bg-red-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-red-600 font-medium">Spam</p>
                                <p className="text-sm font-bold text-red-800">{site.Spam}</p>
                              </div>
                            )}
                            {site.OrganicTraffic && (
                              <div className="bg-orange-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-orange-600 font-medium">Traffic</p>
                                <p className="text-sm font-bold text-orange-800">{site.OrganicTraffic}</p>
                              </div>
                            )}
                            {site.RD && (
                              <div className="bg-indigo-50 rounded-lg p-2 text-center">
                                <p className="text-xs text-indigo-600 font-medium">RD</p>
                                <a
                                  href={site.RD}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-indigo-800 hover:underline"
                                  title="Open RD Link"
                                >
                                  Link
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            {getStatusBadge(site.status, site.rejectionReason)}
                          </div>
                        </div>
                        <div className="text-green-600 font-bold text-lg">
                          {formatPrice(site.priceCents)}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => editWebsite(site)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (!site._id) {
                              alert('Cannot delete: Site ID is missing');
                              return;
                            }
                            const siteId = String(site._id);
                            if (siteId && siteId !== 'undefined') {
                              removeSite(siteId);
                            } else {
                              alert('Cannot delete: Site ID is invalid');
                            }
                          }}
                          disabled={deleteLoading === site._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          {deleteLoading === site._id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Website Tab */}
          {activeTab === "add-website" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingWebsite ? 'Edit Website' : 'Add New Website'}
                </h2>
                {editingWebsite && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Website Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter website title"
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your website..."
                  />
                </div>

                {/* SEO Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Metrics (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <label htmlFor="DA" className="block text-sm font-medium text-gray-700 mb-1">
                        DA
                      </label>
                      <input
                        type="number"
                        id="DA"
                        name="DA"
                        value={formData.DA}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="PA" className="block text-sm font-medium text-gray-700 mb-1">
                        PA
                      </label>
                      <input
                        type="number"
                        id="PA"
                        name="PA"
                        value={formData.PA}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="DR" className="block text-sm font-medium text-gray-700 mb-1">
                        DR
                      </label>
                      <input
                        type="number"
                        id="DR"
                        name="DR"
                        value={formData.DR}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="Spam" className="block text-sm font-medium text-gray-700 mb-1">
                        Spam
                      </label>
                      <input
                        type="number"
                        id="Spam"
                        name="Spam"
                        value={formData.Spam}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="OrganicTraffic" className="block text-sm font-medium text-gray-700 mb-1">
                        Organic Traffic
                      </label>
                      <input
                        type="number"
                        id="OrganicTraffic"
                        name="OrganicTraffic"
                        value={formData.OrganicTraffic}
                        onChange={handleFormChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="RD" className="block text-sm font-medium text-gray-700 mb-1">
                        RD Link
                      </label>
                      <input
                        type="url"
                        id="RD"
                        name="RD"
                        value={formData.RD}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., technology, blog, business"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('websites');
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium transition-colors flex items-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        {editingWebsite ? 'Updating...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">
                          {editingWebsite ? 'save' : 'add'}
                        </span>
                        {editingWebsite ? 'Update Website' : 'Submit for Approval'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Other tabs with coming soon messages */}
          {(activeTab === "analytics" || activeTab === "earnings" || activeTab === "settings") && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                {activeTab === "analytics" && "Analytics Overview"}
                {activeTab === "earnings" && "Earnings Report"}
                {activeTab === "settings" && "Publisher Settings"}
              </h2>
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                  {activeTab === "analytics" && "analytics"}
                  {activeTab === "earnings" && "monetization_on"}
                  {activeTab === "settings" && "settings"}
                </span>
                <p className="text-gray-500">
                  {activeTab === "analytics" && "Analytics features coming soon..."}
                  {activeTab === "earnings" && "Earnings tracking coming soon..."}
                  {activeTab === "settings" && "Settings panel coming soon..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}