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

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setLoading(true);
    fetch("/api/websites?owner=me")
      .then((r) => r.json())
      .then((sitesData) => {
        const rawSites = sitesData.websites || sitesData || [];
        const normalizedSites = Array.isArray(rawSites)
          ? rawSites.map((s: any) => ({
              ...s,
              priceCents:
                typeof s.priceCents === "number" &&
                !Number.isNaN(s.priceCents)
                  ? s.priceCents
                  : typeof s.price === "number" &&
                    !Number.isNaN(s.price)
                  ? Math.round(s.price * 100)
                  : 0,
            }))
          : [];
        setMySites(normalizedSites);
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
      const res = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          url: form.url,
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
        alert("Error: " + (err.error || JSON.stringify(err)));
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred. Please try again.");
    }
  }

  async function removeSite(id: string) {
    if (!confirm("Are you sure you want to delete this website?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/websites/${id}`, { method: "DELETE" });
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
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Publisher Dashboard
        </h1>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-3 font-medium ${
            activeTab === "add"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Add New Website
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-6 py-3 font-medium ${
            activeTab === "list"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          My Websites ({mySites.length})
        </button>
      </div>

      {/* Add Website Form */}
      {activeTab === "add" && (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Add New Website
          </h2>
          <form
            onSubmit={createSite}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="Website Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                URL
              </label>
              <input
                type="url"
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) =>
                  setForm({ ...form, url: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="0.00"
                value={
                  form.priceCents
                    ? (form.priceCents / 100).toFixed(2)
                    : ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    priceCents: Math.round(
                      parseFloat(e.target.value || "0") * 100
                    ),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
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
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="tag1, tag2"
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="Describe your website..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* New SEO / Metrics Fields */}
            <div>
              <label className="block text-sm font-medium mb-2">
                DA (Domain Authority)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.DA}
                onChange={(e) =>
                  setForm({ ...form, DA: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                PA (Page Authority)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.PA}
                onChange={(e) =>
                  setForm({ ...form, PA: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Spam Score
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.Spam}
                onChange={(e) =>
                  setForm({ ...form, Spam: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Organic Traffic
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.OrganicTraffic}
                onChange={(e) =>
                  setForm({
                    ...form,
                    OrganicTraffic: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                DR (Domain Rating)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-4 py-2.5"
                value={form.DR}
                onChange={(e) =>
                  setForm({ ...form, DR: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                RD (Referring Domain URL)
              </label>
              <input
                type="url"
                className="w-full border rounded-lg px-4 py-2.5"
                placeholder="https://example.com"
                value={form.RD}
                onChange={(e) =>
                  setForm({ ...form, RD: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              >
                Submit for Approval
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Websites List */}
      {activeTab === "list" && (
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            My Websites ({mySites.length})
          </h2>
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
              <p className="mt-4 text-lg">
                No {statusFilter} websites found.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredSites.map((site, index) => (
                <div
                  key={site._id || index}
                  className="border p-6 rounded-lg"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {site.title}
                      </h3>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {site.url}
                      </a>
                      <p className="text-gray-600">
                        {site.description}
                      </p>
                      <div>
                        {getStatusBadge(
                          site.status,
                          site.rejectionReason
                        )}
                      </div>
                    </div>
                    <div className="text-green-600 font-bold">
                      {formatPrice(site.priceCents)}
                    </div>
                  </div>

                  {/* Show SEO/Metrics */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                    {site.DA !== undefined && <div>DA: {site.DA}</div>}
                    {site.PA !== undefined && <div>PA: {site.PA}</div>}
                    {site.Spam !== undefined && (
                      <div>Spam: {site.Spam}</div>
                    )}
                    {site.OrganicTraffic !== undefined && (
                      <div>Organic Traffic: {site.OrganicTraffic}</div>
                    )}
                    {site.DR !== undefined && <div>DR: {site.DR}</div>}
                    {site.RD && (
                      <div>
                        RD:{" "}
                        <a
                          href={site.RD}
                          className="text-blue-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {site.RD}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    Added: {formatDate(site.createdAt)}
                  </div>
                  {site.status === "pending" && (
                    <button
                      onClick={() => removeSite(site._id)}
                      disabled={deleteLoading === site._id}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      {deleteLoading === site._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
