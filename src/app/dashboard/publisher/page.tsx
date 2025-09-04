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
};

export default function PublisherDashboard() {
  const [mySites, setMySites] = useState<Website[]>([]);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    priceCents: 0,
    category: "",
    tags: "",
    DA: "",
    PA: "",
    Spam: "",
    OrganicTraffic: "",
    DR: "",
    RD: "",
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"add" | "list">("list");
  const [editingSite, setEditingSite] = useState<Website | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    url: "",
    description: "",
    priceCents: 0,
    category: "",
    tags: "",
    DA: "",
    PA: "",
    Spam: "",
    OrganicTraffic: "",
    DR: "",
    RD: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  // Debug function to log website data
  useEffect(() => {
    if (mySites.length > 0) {
      console.log('Website data:', mySites);
      console.log('First website ID:', mySites[0]._id);
    }
  }, [mySites]);

  function refresh() {
    setLoading(true);
    fetch("/api/websites?owner=me")
      .then((r) => r.json())
      .then((sitesData) => {
        const rawSites = sitesData.websites || sitesData || [];
        
        // Log the raw data structure to understand what we're working with
        console.log('Raw API response:', JSON.stringify(sitesData, null, 2));
        
        // Process and normalize the sites data
        const normalizedSites = Array.isArray(rawSites)
          ? rawSites
              .map((s: any) => {
                // Extract the MongoDB ID from the response
                let siteId = null;
                
                // Handle different ID formats
                if (s._id) {
                  if (typeof s._id === 'string') {
                    siteId = s._id;
                  } else if (typeof s._id === 'object') {
                    // Handle MongoDB ObjectId format {$oid: "..."}
                    if (s._id.$oid) {
                      siteId = s._id.$oid;
                    } else if (s._id.toString) {
                      // Try using toString() method if available
                      siteId = s._id.toString();
                    }
                  }
                } else if (s.id) {
                  siteId = s.id;
                }
                
                console.log(`Site ${s.title || 'unknown'} - Raw ID:`, s._id);
                console.log(`Site ${s.title || 'unknown'} - Extracted ID:`, siteId);
                
                if (!siteId) {
                  console.error('Warning: Site is missing ID:', JSON.stringify(s));
                  return null; // Will be filtered out below
                }
                
                return {
                  ...s,
                  _id: siteId, // Ensure _id is set
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
              .filter(Boolean) // Remove null entries (sites without valid IDs)
          : [];
        setMySites(normalizedSites.filter(site => site._id));
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        alert("Failed to load data");
      })
      .finally(() => setLoading(false));
  }

  async function createSite(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Ensure URL has a protocol
      let formattedUrl = form.url;
      if (formattedUrl && !formattedUrl.match(/^https?:\/\//)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          url: formattedUrl,
          description: form.description,
          priceCents: Number(form.priceCents),
          category: form.category,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          DA: form.DA ? Number(form.DA) : undefined,
          PA: form.PA ? Number(form.PA) : undefined,
          Spam: form.Spam ? Number(form.Spam) : undefined,
          OrganicTraffic: form.OrganicTraffic
            ? Number(form.OrganicTraffic)
            : undefined,
          DR: form.DR ? Number(form.DR) : undefined,
          RD: form.RD || undefined,
        }),
      });

      if (res.ok) {
        setForm({
          title: "",
          url: "",
          description: "",
          priceCents: 0,
          category: "",
          tags: "",
          DA: "",
          PA: "",
          Spam: "",
          OrganicTraffic: "",
          DR: "",
          RD: "",
        });
        refresh();
        setActiveTab("list");
        alert("Website submitted for approval!");
      } else {
        const err = await res.json();
        console.error("Create site error:", err);
        let errorMessage = "Error: ";
        
        if (err.error && typeof err.error === 'object') {
          // Handle Zod validation errors
          if (err.error.fieldErrors) {
            const fieldErrors = Object.entries(err.error.fieldErrors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('\n');
            errorMessage += `Validation failed:\n${fieldErrors}`;
          } else {
            errorMessage += JSON.stringify(err.error);
          }
        } else {
          errorMessage += (err.error || JSON.stringify(err));
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please try again.");
    }
  }

  async function removeSite(id: string) {
    console.log('removeSite function received ID:', id);
    
    // Validate ID before proceeding
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid ID provided to removeSite:', id);
      alert('Cannot delete: Invalid website ID');
      return;
    }
    
    // Ensure ID is a valid MongoDB ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectId) {
      console.error('ID is not a valid MongoDB ObjectId format:', id);
      alert('Cannot delete: Invalid website ID format');
      return;
    }
    
    if (!confirm("Are you sure you want to delete this website?")) return;
    setDeleteLoading(id);
    try {
      const deleteUrl = `/api/websites/${id}`;
      console.log('Sending DELETE request to:', deleteUrl);
      const res = await fetch(deleteUrl, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMySites((prevSites) =>
          prevSites.filter((site) => site._id !== id)
        );
        alert("Website deleted successfully!");
      } else {
        console.error("Delete error:", data);
        if (res.status === 401) alert("Please log in to delete websites");
        else if (res.status === 403)
          alert("You don't have permission to delete this website");
        else if (res.status === 404) {
          alert("Website not found");
          setMySites((prevSites) =>
            prevSites.filter((site) => site._id !== id)
          );
        } else
          alert(
            "Failed to delete website: " + (data.error || "Unknown error")
          );
      }
    } catch (error) {
      console.error("Network error during delete:", error);
      alert(
        "Network error occurred. Please check your connection and try again."
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  function handleEditSite(site: Website) {
    setEditingSite(site);
    setEditForm({
      title: site.title || "",
      url: site.url || "",
      description: site.description || "",
      priceCents: site.priceCents || 0,
      category: site.category || "",
      tags: Array.isArray(site.tags) ? site.tags.join(", ") : "",
      DA: site.DA?.toString() || "",
      PA: site.PA?.toString() || "",
      Spam: site.Spam?.toString() || "",
      OrganicTraffic: site.OrganicTraffic?.toString() || "",
      DR: site.DR?.toString() || "",
      RD: site.RD || "",
    });
    setIsEditModalOpen(true);
  }

  async function updateSite(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSite?._id) {
      console.error('Cannot update site: Missing ID');
      return;
    }

    setUpdateLoading(true);
    try {
      // Ensure URL has a protocol
      let formattedUrl = editForm.url;
      if (formattedUrl && !formattedUrl.match(/^https?:\/\//)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const res = await fetch(`/api/websites/${editingSite._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          url: formattedUrl,
          category: editForm.category,
          status: "pending", // Set status to pending for admin approval
          priceCents: editForm.priceCents,
          tags: editForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          DA: editForm.DA ? Number(editForm.DA) : undefined,
          PA: editForm.PA ? Number(editForm.PA) : undefined,
          Spam: editForm.Spam ? Number(editForm.Spam) : undefined,
          OrganicTraffic: editForm.OrganicTraffic
            ? Number(editForm.OrganicTraffic)
            : undefined,
          DR: editForm.DR ? Number(editForm.DR) : undefined,
          RD: editForm.RD || undefined,
          _forceStatusUpdate: true, // Add a flag to force status update
        }),
      });

      if (res.ok) {
        // Close modal and refresh the list
        setIsEditModalOpen(false);
        setEditingSite(null);
        alert("Website updated successfully! It will be reviewed by an admin.");
        // Force a complete page refresh to ensure we get the latest data
        window.location.reload();
      } else {
        const error = await res.json();
        console.error("Update error:", error);
        alert(`Failed to update: ${error.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Update network error:", err);
      alert("Network error occurred. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  }

  function getStatusBadge(status: string, rejectionReason?: string) {
    const baseClass =
      "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "approved":
        return (
          <span
            className={`${baseClass} bg-green-100 text-green-800 border border-green-200`}
          >
            Approved
          </span>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2">
            <span
              className={`${baseClass} bg-red-100 text-red-800 border border-red-200`}
            >
              Rejected
            </span>
            {rejectionReason && (
              <div className="group relative">
                <span className="text-red-500 cursor-help text-sm bg-red-50 rounded-full w-5 h-5 flex items-center justify-center">
                  ?
                </span>
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">
                  <strong>Reason:</strong> {rejectionReason}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <span
            className={`${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-200`}
          >
            Pending Review
          </span>
        );
    }
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  }

  function formatPrice(cents?: number) {
    if (!cents || isNaN(cents)) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  }

  const filteredSites =
    statusFilter === "all"
      ? mySites
      : mySites.filter((site) => site.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Edit Website</h2>
                    <p className="text-sm text-yellow-600 mt-1">
                      <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      After editing, your website will require admin approval again.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={updateSite} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        URL
                      </label>
                      <input
                        type="url"
                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="https://example.com"
                        value={editForm.url}
                        onChange={(e) =>
                          setEditForm({ ...editForm, url: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={editForm.priceCents / 100}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priceCents: Math.round(
                              parseFloat(e.target.value) * 100
                            ),
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Category
                      </label>
                      <select
                        className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="blog">Blog</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="business">Business</option>
                        <option value="educational">Educational</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Description
                    </label>
                    <textarea
                      className="w-full border rounded-lg px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="blog, news, tech"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">SEO Metrics (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">DA</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={editForm.DA}
                          onChange={(e) =>
                            setEditForm({ ...editForm, DA: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">PA</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={editForm.PA}
                          onChange={(e) =>
                            setEditForm({ ...editForm, PA: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Spam Score</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={editForm.Spam}
                          onChange={(e) =>
                            setEditForm({ ...editForm, Spam: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Organic Traffic</label>
                        <input
                          type="number"
                          min="0"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={editForm.OrganicTraffic}
                          onChange={(e) =>
                            setEditForm({ ...editForm, OrganicTraffic: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">DR</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          value={editForm.DR}
                          onChange={(e) =>
                            setEditForm({ ...editForm, DR: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">RD Link</label>
                        <input
                          type="url"
                          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="https://example.com/rd"
                          value={editForm.RD}
                          onChange={(e) =>
                            setEditForm({ ...editForm, RD: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center gap-2"
                    >
                      {updateLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Website"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Publisher Dashboard
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              <button
                onClick={() => setActiveTab("list")}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "list" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>My Sites</span>
                  {mySites.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                      {mySites.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${activeTab === "add" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add New Site</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* My Sites Tab */}
        {activeTab === "list" && (
          <div>
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
                <span className="text-sm font-medium text-gray-500">{mySites.length} websites</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "pending" | "approved" | "rejected"
                    )
                  }
                  className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">Loading your sites...</p>
                </div>
              </div>
            ) : mySites.length === 0 ? (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Found</h3>
                <p className="text-gray-600 mb-4">You haven't added any websites yet. Get started by adding your first website!</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Website
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-14">
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
                        <p className="text-gray-600 mt-2 text-sm">
                          {site.description}
                        </p>
                        <div className="mt-3">
                          {getStatusBadge(
                            site.status,
                            site.rejectionReason
                          )}
                        </div>
                      </div>
                      <div className="text-green-600 font-bold text-lg">
                        {formatPrice(site.priceCents)}
                      </div>
                    </div>

                    {/* Show SEO/Metrics */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {site.DA !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">DA:</span> {site.DA}
                        </div>
                      )}
                      {site.PA !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">PA:</span> {site.PA}
                        </div>
                      )}
                      {site.Spam !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Spam:</span> {site.Spam}
                        </div>
                      )}
                      {site.OrganicTraffic !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Organic Traffic:</span> {site.OrganicTraffic}
                        </div>
                      )}
                      {site.DR !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">DR:</span> {site.DR}
                        </div>
                      )}
                      {site.RD && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">RD:</span>{" "}
                          <a
                            href={site.RD}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {site.RD}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditSite(site)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // Ensure we have a valid ID before proceeding
                          if (!site._id) {
                            console.error('Delete failed: Site has no _id property', site);
                            alert('Cannot delete: Site ID is missing');
                            return;
                          }
                          
                          // Log detailed information for debugging
                          console.log('Deleting site:', {
                            title: site.title,
                            id: site._id,
                            idType: typeof site._id,
                            fullSite: site
                          });
                          
                          // The _id should already be normalized in the refresh function
                          // But we'll double-check it's a string here
                          const siteId = String(site._id);
                          
                          if (siteId && siteId !== 'undefined') {
                            console.log('Calling removeSite with ID:', siteId);
                            removeSite(siteId);
                          } else {
                            console.error('Cannot delete: Invalid ID format:', siteId);
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

        {/* Add New Site Tab */}
        {activeTab === "add" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Website</h2>
            <form onSubmit={createSite} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    URL
                  </label>
                  <input
                    type="url"
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://example.com"
                    value={form.url}
                    onChange={(e) =>
                      setForm({ ...form, url: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid URL (e.g., example.com or https://example.com)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.priceCents / 100}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priceCents: Math.round(
                          parseFloat(e.target.value) * 100
                        ),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="blog">Blog</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="business">Business</option>
                    <option value="educational">Educational</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2.5 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="blog, news, tech"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-800">SEO Metrics (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">DA</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.DA}
                      onChange={(e) =>
                        setForm({ ...form, DA: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">PA</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.PA}
                      onChange={(e) =>
                        setForm({ ...form, PA: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Spam Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.Spam}
                      onChange={(e) =>
                        setForm({ ...form, Spam: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Organic Traffic</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.OrganicTraffic}
                      onChange={(e) =>
                        setForm({ ...form, OrganicTraffic: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">DR</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.DR}
                      onChange={(e) =>
                        setForm({ ...form, DR: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">RD</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={form.RD}
                      onChange={(e) =>
                        setForm({ ...form, RD: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit Website
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
