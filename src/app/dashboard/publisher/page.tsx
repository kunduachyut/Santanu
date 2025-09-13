"use client";

import { useEffect, useState } from "react";
import PublisherSidebar from "@/components/PublisherSidebar";
import PublisherDashboardSection from "@/components/PublisherDashboardSection";
import PublisherWebsitesSection from "@/components/PublisherWebsitesSection";
import PublisherAddWebsiteSection from "@/components/PublisherAddWebsiteSection";
import PublisherComingSoonSection from "@/components/PublisherComingSoonSection";

// Define the categories as requested with mapping to backend enum values
const CATEGORIES = [
  { id: 1, name: "Finance, Insurance & Investment" },
  { id: 2, name: "Crypto, Blockchain, Bitcoin & Digital Assets", backendValue: "business" },
  { id: 3, name: "Health, Wellness, Fitness & Personal Care", backendValue: "buiness" },
  { id: 4, name: "Software, SaaS, Technology & IT Solutions", backendValue: "business" },
  { id: 5, name: "Business, Marketing, PR & Communication", backendValue: "business" },
  { id: 6, name: "Travel, Tourism, Adventure & Hospitality", backendValue: "business" },
  { id: 7, name: "Law, Legal Services, Attorneys & Compliance", backendValue: "business" },
  { id: 8, name: "Automotive, Cars, Bikes & Electric Vehicles (EVs)", backendValue: "business" },
  { id: 9, name: "iGaming, Casino, Betting, Gambling & Adult Niches", backendValue: "entertainment" },
  { id: 10, name: "Education, E-Learning, Training & Career Development", backendValue: "educational" },
  { id: 11, name: "Real Estate, Property, Home Improvement & Garden", backendValue: "business" },
  { id: 12, name: "Food, Recipes, Cooking & Culinary Lifestyle", backendValue: "business" },
  { id: 13, name: "Sports, Fitness, Training & Active Lifestyle", backendValue: "entertainment" },
  { id: 14, name: "Clothing, Fashion, Style & Apparel", backendValue: "business" },
  { id: 15, name: "Beauty, Cosmetics, Skincare & Personal Style", backendValue: "business" },
  { id: 16, name: "Parenting, Family, Kids & Childcare", backendValue: "business" },
  { id: 17, name: "Wedding, Events, Parties & Celebrations", backendValue: "business" },
  { id: 18, name: "Lifestyle, General Interest & Multi-Niche Blogs", backendValue: "blog" },
  { id: 19, name: "Photography, Visual Arts & Creative Media", backendValue: "entertainment" },
  { id: 20, name: "Hobbies, Leisure, Crafts & Entertainment", backendValue: "entertainment" },
  { id: 21, name: "Women's Lifestyle, Fashion & Inspiration", backendValue: "business" },
  { id: 22, name: "Men's Lifestyle, Fashion & Grooming", backendValue: "business" },
  { id: 23, name: "Media, Publishing, Literature & Books", backendValue: "blog" },
  { id: 24, name: "Music, Movies, Film & Entertainment", backendValue: "entertainment" },
  { id: 25, name: "Gadgets, Electronics, Hardware & Consumer Tech", backendValue: "business" },
  { id: 26, name: "Social Media, Influencers & Digital Trends", backendValue: "blog" },
  { id: 27, name: "News, Blogs, Magazines & Current Affairs", backendValue: "blog" },
  { id: 28, name: "Promotional Products, Gifts & Corporate Merchandise", backendValue: "business" },
  { id: 29, name: "Catering, Food Services & Hospitality Industry", backendValue: "business" },
  { id: 30, name: "Animals, Pets, Wildlife & Veterinary Care", backendValue: "business" },
  { id: 31, name: "Construction, Architecture, Engineering & Building", backendValue: "business" },
  { id: 32, name: "Sustainability, Eco-Friendly & Green Living", backendValue: "business" },
  { id: 33, name: "Games, Toys, Kids & Children's Products", backendValue: "entertainment" },
  { id: 34, name: "Private SEO Blog Networks (PSBN)", backendValue: "blog" }
];

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
  category?: string; // Keep as string to match the backend value
  tags?: string;
  primaryCountry?: string; // Add primaryCountry field
};



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
    category: '', // This will now be a comma-separated string of category IDs
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

  // Function to convert comma-separated category IDs to selected IDs array
  function getCategoryIdsFromString(categoryString: string): number[] {
    if (!categoryString) return [];
    return categoryString.split(',').map(Number).filter(Boolean);
  }

  // Function to handle editing a website with multiple categories
  function editWebsite(website: Website) {
    setEditingWebsite(website);
    
    // Convert the backend category value to our category IDs
    // This is a simplified approach - in a real implementation, you might want to store
    // the original category IDs in a separate field
    let categoryIds: number[] = [];
    if (website.category) {
      // Find categories that map to this backend value
      const matchingCategories = CATEGORIES.filter(cat => cat.backendValue === website.category)
        .map(cat => cat.id);
      categoryIds = matchingCategories;
    }
    
    setFormData({
      title: website.title,
      url: website.url,
      description: website.description,
      category: website.category || '', // Keep the backend value for submission
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--accent-primary)'}}></div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen" style={{backgroundColor: 'var(--base-primary)'}}>
      <PublisherSidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
      
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>
              {activeTab === "dashboard" && "Publisher Dashboard"}
              {activeTab === "websites" && "My Websites"}
              {activeTab === "add-website" && "Add New Website"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "earnings" && "Earnings"}
              {activeTab === "settings" && "Settings"}
            </h1>
            {activeTab === "websites" && (
              <p className="mt-1" style={{color: 'var(--secondary-lighter)'}}>Manage your websites and track their approval status</p>
            )}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <PublisherDashboardSection 
              stats={stats}
              mySites={mySites}
              setActiveTab={setActiveTab}
              getStatusBadge={getStatusBadge}
              formatPrice={formatPrice}
            />
          )}

          {/* Websites Tab */}
          {activeTab === "websites" && (
            <PublisherWebsitesSection
              mySites={mySites}
              refresh={refresh}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              editWebsite={editWebsite}
              removeSite={removeSite}
              deleteLoading={deleteLoading}
              getStatusBadge={getStatusBadge}
              formatPrice={formatPrice}
            />
          )}

          {/* Add Website Tab */}
          {activeTab === "add-website" && (
            <PublisherAddWebsiteSection
              editingWebsite={editingWebsite}
              formData={formData}
              handleFormChange={handleFormChange}
              handleSubmit={handleSubmit}
              formLoading={formLoading}
              resetForm={resetForm}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Other tabs with coming soon messages */}
          {(activeTab === "analytics" || activeTab === "earnings" || activeTab === "settings") && (
            <PublisherComingSoonSection activeTab={activeTab} />
          )}
        </div>
      </main>
    </div>
  );
}

