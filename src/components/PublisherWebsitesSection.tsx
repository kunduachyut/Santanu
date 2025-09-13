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
            onClick={() => {
              const addWebsiteButton = document.querySelector('[data-tab="add-website"]') as HTMLButtonElement;
              if (addWebsiteButton) {
                addWebsiteButton.click();
              }
            }}
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
                  
                  {/* Display categories */}
                  {site.category && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(Array.isArray(site.category) ? site.category : site.category.split(',')).map((cat, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
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
  );
}