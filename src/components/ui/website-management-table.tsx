"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Eye, Edit, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import { MinimalToggle } from "@/components/ui/toggle";

// Import the country flag emoji function
import { getCountryFlagEmoji } from "@/components/MarketplaceSection";

interface Website {
  _id: string;
  title: string;
  url: string;
  description: string;
  priceCents: number;
  status: "pending" | "approved" | "rejected";
  available: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  views?: number;
  clicks?: number;
  DA?: number;
  PA?: number;
  Spam?: number;
  OrganicTraffic?: number;
  DR?: number;
  RD?: string;
  category?: string;
  tags?: string[];
  primaryCountry?: string;
  trafficValue?: number;
  locationTraffic?: number;
  greyNicheAccepted?: boolean;
  specialNotes?: string;
  primeTrafficCountries?: string[];
}

export type { Website };

interface WebsiteManagementTableProps {
  title?: string;
  websites?: Website[];
  onEditWebsite?: (website: Website) => void;
  onDeleteWebsite?: (id: string) => void;
  onRefresh?: () => void;
  onAvailabilityChange?: (id: string, available: boolean) => void;
  className?: string;
}

const defaultWebsites: Website[] = [
  {
    _id: "1",
    title: "Example Website",
    url: "https://example.com",
    description: "An example website for demonstration",
    priceCents: 5000,
    status: "approved",
    available: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    // Sample SEO metrics for testing
    DA: 50,
    PA: 45,
    Spam: 2,
    OrganicTraffic: 10000,
    DR: 60,
    RD: "1500",
    trafficValue: 5000,
    locationTraffic: 8000,
    greyNicheAccepted: true,
    specialNotes: "High quality website with great content",
    primaryCountry: "United States",
    category: "Technology"
  }
];

export function WebsiteManagementTable({
  title = "My Websites",
  websites: initialWebsites = defaultWebsites,
  onEditWebsite,
  onDeleteWebsite,
  onRefresh,
  onAvailabilityChange,
  className = ""
}: WebsiteManagementTableProps = {}) {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [hoveredWebsite, setHoveredWebsite] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Update websites when initialWebsites change
  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

  const openWebsiteModal = (website: Website) => {
    setSelectedWebsite(website);
  };

  const closeWebsiteModal = () => {
    setSelectedWebsite(null);
  };

  // Update selected website when websites change (for real-time updates)
  useEffect(() => {
    if (selectedWebsite) {
      const updatedWebsite = websites.find(w => w._id === selectedWebsite._id);
      if (updatedWebsite) {
        setSelectedWebsite(updatedWebsite);
      }
    }
  }, [websites, selectedWebsite]);

  const getStatusBadge = (status: Website["status"], rejectionReason?: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400 text-sm font-medium">Approved</span>
          </div>
        );
      case "pending":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-yellow-400 text-sm font-medium">Pending</span>
          </div>
        );
      case "rejected":
        return (
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-400 text-sm font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/30 flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Unknown</span>
          </div>
        );
    }
  };

  const getActions = (website: Website) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onEditWebsite) {
              onEditWebsite(website);
            }
          }}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Edit website"
        >
          <Edit className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onDeleteWebsite) {
              onDeleteWebsite(website._id);
            }
          }}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Delete website"
        >
          <Trash2 className="w-4 h-4 text-foreground" />
        </button>
      </div>
    );
  };

  const formatPrice = (cents?: number) => {
    if (cents === undefined) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-10 gap-4 p-4 text-sm font-medium text-muted-foreground border-b">
          <div className="col-span-1">No.</div>
          <div className="col-span-4">Website</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Available</div>
          <div className="col-span-1">Actions</div>
        </div>
        <div className="divide-y">
          {websites.map((website, index) => (
            <motion.div
              key={website._id}
              className="grid grid-cols-10 gap-4 p-4 items-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => openWebsiteModal(website)}
              onHoverStart={() => setHoveredWebsite(website._id)}
              onHoverEnd={() => setHoveredWebsite(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="col-span-1">
                <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="col-span-4">
                <div className="font-medium">{website.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Site
                  </a>
                </div>
              </div>
              <div className="col-span-1 font-medium">
                {formatPrice(website.priceCents)}
              </div>
              <div className="col-span-1">
                {getStatusBadge(website.status, website.rejectionReason)}
              </div>
              <div className="col-span-2 flex items-center justify-center">
                {/* Show availability toggle only for approved websites */}
                {website.status === "approved" ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    <MinimalToggle
                      checked={website.available}
                      onChange={(e) => {
                        if (onAvailabilityChange) {
                          onAvailabilityChange(website._id, e.target.checked);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    N/A
                  </div>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                {hoveredWebsite === website._id ? (
                  getActions(website)
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openWebsiteModal(website);
                    }}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    aria-label="View details"
                  >
                    <Eye className="w-4 h-4 text-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedWebsite && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedWebsite.title}</h2>
                    <p className="text-muted-foreground">Website Details</p>
                  </div>
                  <button
                    onClick={closeWebsiteModal}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Website Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">URL</p>
                        <p className="font-mono text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(selectedWebsite.url, '_blank')}>
                          {selectedWebsite.url}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p>{selectedWebsite.description || "No description provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{formatPrice(selectedWebsite.priceCents)}</p>
                      </div>
                      {selectedWebsite.primeTrafficCountries && selectedWebsite.primeTrafficCountries.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Prime Traffic Countries</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedWebsite.primeTrafficCountries.map((country: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-muted rounded-full text-sm flex items-center gap-1">
                                <span>{getCountryFlagEmoji(country)}</span>
                                <span>{country}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Status & Dates</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1">
                          {getStatusBadge(selectedWebsite.status, selectedWebsite.rejectionReason)}
                        </div>
                        {selectedWebsite.rejectionReason && (
                          <p className="text-sm text-red-500 mt-1">Reason: {selectedWebsite.rejectionReason}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p>{formatDate(selectedWebsite.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p>{formatDate(selectedWebsite.updatedAt)}</p>
                      </div>
                      {selectedWebsite.approvedAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Approved</p>
                          <p>{formatDate(selectedWebsite.approvedAt)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Availability</p>
                        {selectedWebsite.status === "approved" ? (
                          <div className="flex items-center gap-2">
                            {/* Prevent click event from bubbling up to parent */}
                            <div onClick={(e) => e.stopPropagation()}>
                              <MinimalToggle
                                checked={selectedWebsite.available}
                                onChange={(e) => {
                                  if (onAvailabilityChange) {
                                    onAvailabilityChange(selectedWebsite._id, e.target.checked);
                                  }
                                }}
                              />
                            </div>
                            <span>{selectedWebsite.available ? "Available" : "Not Available"}</span>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            Only available for approved websites
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4">SEO Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Domain Authority</p>
                        <p className="text-lg font-bold">{selectedWebsite.DA || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Page Authority</p>
                        <p className="text-lg font-bold">{selectedWebsite.PA || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Organic Traffic</p>
                        <p className="text-lg font-bold">{selectedWebsite.OrganicTraffic || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Spam Score</p>
                        <p className="text-lg font-bold">{selectedWebsite.Spam || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Domain Rating</p>
                        <p className="text-lg font-bold">{selectedWebsite.DR || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Referring Domains</p>
                        <p className="text-lg font-bold">{selectedWebsite.RD || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Traffic Value</p>
                        <p className="text-lg font-bold">{selectedWebsite.trafficValue || "N/A"}</p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">Location Traffic</p>
                        <p className="text-lg font-bold">{selectedWebsite.locationTraffic || "N/A"}</p>
                      </div>
                    </div>
                    {(selectedWebsite.greyNicheAccepted !== undefined || selectedWebsite.specialNotes) && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Additional Information</h4>
                        {selectedWebsite.greyNicheAccepted !== undefined && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Grey Niche Accepted: </span>
                            <span className={selectedWebsite.greyNicheAccepted ? "text-green-600" : "text-red-600"}>
                              {selectedWebsite.greyNicheAccepted ? "Yes" : "No"}
                            </span>
                          </p>
                        )}
                        {selectedWebsite.specialNotes && (
                          <p className="text-sm mt-1">
                            <span className="text-muted-foreground">Special Notes: </span>
                            <span>{selectedWebsite.specialNotes}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2 flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={closeWebsiteModal}
                      className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                    >
                      Close
                    </button>
                    {onEditWebsite && (
                      <button
                        onClick={() => {
                          if (onEditWebsite) {
                            onEditWebsite(selectedWebsite);
                            closeWebsiteModal();
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}