import { useState } from "react";
import React from "react";

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
  category?: string; // Updated to accept both string and array
  tags?: string;
  primaryCountry?: string; // Add primaryCountry field
};

export default function PublisherWebsitesSection({ 
  mySites,
  refresh,
  statusFilter,
  setStatusFilter,
  editWebsite,
  removeSite,
  deleteLoading,
  getStatusBadge,
  formatPrice
}: {
  mySites: Website[];
  refresh: () => void;
  statusFilter: "all" | "pending" | "approved" | "rejected";
  setStatusFilter: (filter: "all" | "pending" | "approved" | "rejected") => void;
  editWebsite: (website: Website) => void;
  removeSite: (id: string) => void;
  deleteLoading: string | null;
  getStatusBadge: (status: string, rejectionReason?: string) => React.ReactElement;
  formatPrice: (cents?: number) => string;
}) {
  const filteredSites = statusFilter === "all" ? mySites : mySites.filter((site) => site.status === statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <div>
            <span className="text-sm font-medium text-gray-700">{mySites.length} websites</span>
            {statusFilter !== "all" && (
              <span className="text-sm text-gray-500 ml-2">({filteredSites.length} filtered)</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "approved" | "rejected")}
            className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredSites.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-blue-600 text-3xl">web</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Websites Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">You haven't added any websites yet or no websites match your current filter. Get started by adding your first website!</p>
          <button
            onClick={() => {
              const event = new CustomEvent('switchTab', { detail: 'add-website' });
              window.dispatchEvent(event);
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredSites.map((site) => (
            <div
              key={site._id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all bg-white flex flex-col"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{site.title}</h3>
                  <div className="flex-shrink-0">
                    {getStatusBadge(site.status, site.rejectionReason)}
                  </div>
                </div>
                
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm inline-block mb-3 line-clamp-1"
                >
                  {site.url}
                </a>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{site.description}</p>
                
                {/* Display categories */}
                {site.category && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(site.category) ? site.category : site.category.split(',')).map((cat, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* SEO Metrics */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">SEO Metrics</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {site.DA !== undefined && site.DA !== null && (
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-600 font-medium">DA</p>
                        <p className="text-sm font-bold text-blue-800">{site.DA}</p>
                      </div>
                    )}
                    {site.DR !== undefined && site.DR !== null && (
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-green-600 font-medium">DR</p>
                        <p className="text-sm font-bold text-green-800">{site.DR}</p>
                      </div>
                    )}
                    {site.PA !== undefined && site.PA !== null && (
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-purple-600 font-medium">PA</p>
                        <p className="text-sm font-bold text-purple-800">{site.PA}</p>
                      </div>
                    )}
                    {site.Spam !== undefined && site.Spam !== null && (
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-red-600 font-medium">Spam</p>
                        <p className="text-sm font-bold text-red-800">{site.Spam}</p>
                      </div>
                    )}
                    {site.OrganicTraffic !== undefined && site.OrganicTraffic !== null && (
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-orange-600 font-medium">Traffic</p>
                        <p className="text-sm font-bold text-orange-800">{site.OrganicTraffic?.toLocaleString()}</p>
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
                </div>

                {/* Primary Country */}
                {site.primaryCountry && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Primary Traffic Country</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 px-2.5 py-1 rounded-full">
                        {site.primaryCountry}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Added: {new Date(site.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-green-600 font-bold text-lg">
                    {formatPrice(site.priceCents)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => editWebsite(site)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  {deleteLoading === site._id ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">delete</span>
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
  );
}