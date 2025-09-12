"use client";

import React from "react";

// Type definitions
type Website = {
  id: string;
  ownerId: string;
  userId?: string;
  title: string;
  url: string;
  description: string;
  priceCents?: number;
  price?: number;
  status: "pending" | "approved" | "rejected" | "priceConflict";
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
  conflictsWith?: string;
  conflictGroup?: string;
  isOriginal?: boolean;
};

type FilterType = "all" | "pending" | "approved" | "rejected";

type SuperAdminWebsitesSectionProps = {
  websites: Website[];
  loading: {
    websites: boolean;
    purchases: boolean;
  };
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  selectedWebsites: string[];
  isAllWebsitesSelected: boolean;
  toggleSelectAllWebsites: () => void;
  toggleWebsiteSelection: (id: string) => void;
  approveSelectedWebsites: () => void;
  updateWebsiteStatus: (id: string, status: "approved" | "rejected", reason?: string) => void;
  openRejectModal: (website: Website) => void;
  refresh: () => void;
};

const SuperAdminWebsitesSection: React.FC<SuperAdminWebsitesSectionProps> = ({
  websites,
  loading,
  filter,
  setFilter,
  stats,
  selectedWebsites,
  isAllWebsitesSelected,
  toggleSelectAllWebsites,
  toggleWebsiteSelection,
  approveSelectedWebsites,
  updateWebsiteStatus,
  openRejectModal,
  refresh
}) => {
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-violet-600/5"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-gray-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Website Moderation
          </span>
        </h2>
        
        {/* Action Bar */}
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
            <span className="text-sm font-medium text-gray-500">{(websites || []).length} websites found</span>
          </div>
          <div className="flex items-center gap-4">
            {filter === "pending" && (websites || []).length > 0 && (selectedWebsites || []).length > 0 && (
              <button
                onClick={approveSelectedWebsites}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Selected ({(selectedWebsites || []).length})
              </button>
            )}
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Total Websites</p>
                <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--accent-light)'}}>
                <svg className="w-6 h-6" style={{color: 'var(--accent-primary)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Pending</p>
                <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--warning)'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Approved</p>
                <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.approved}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--success)'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg p-4 lg:p-6 shadow-sm" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{color: 'var(--secondary-lighter)'}}>Rejected</p>
                <p className="text-2xl lg:text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'var(--error)'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading.websites ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600 text-sm">Loading websites...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {(websites || []).length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Found</h3>
                <p className="text-gray-600">No websites found with status: {filter}</p>
              </div>
            ) : (
              <div>
                {/* Table Header */}
                <div className="grid grid-cols-20 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-1 flex justify-center">
                    {filter === "pending" && (
                      <input 
                        type="checkbox" 
                        checked={isAllWebsitesSelected}
                        onChange={toggleSelectAllWebsites}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                  <div className="col-span-4 flex items-center">WEBSITE NAME</div>
                  <div className="col-span-2 flex justify-center">PRICE</div>
                  <div className="col-span-1 flex justify-center">DA</div>
                  <div className="col-span-1 flex justify-center">DR</div>
                  <div className="col-span-2 flex justify-center">ORGANIC TRAFFIC</div>
                  <div className="col-span-1 flex justify-center">SPAM</div>
                  <div className="col-span-2 flex justify-center">OWNER</div>
                  <div className="col-span-2 flex justify-center">STATUS</div>
                  <div className="col-span-3 flex justify-center">ACTIONS</div>
                  <div className="col-span-1"></div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {(websites || []).map((website, idx) => {
                    return (
                      <div key={website.id || idx} className="grid grid-cols-20 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                        {/* Checkbox */}
                        <div className="col-span-1 flex justify-center">
                          {(website.status || 'pending') === 'pending' && (
                            <input 
                              type="checkbox" 
                              checked={(selectedWebsites || []).includes(website.id)}
                              onChange={() => toggleWebsiteSelection(website.id)}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" 
                            />
                          )}
                        </div>
                        
                        {/* Website Info */}
                        <div className="col-span-4">
                          <div className="flex items-center">
                            {website.image ? (
                              <img
                                src={website.image}
                                alt="website thumbnail"
                                width={40}
                                height={40}
                                className="rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {(website.title || 'W').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{website.title || 'Untitled'}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]" title={website.url || ''}>
                                {(website.url || '').length > 40 ? `${(website.url || '').substring(0, 40)}...` : (website.url || '')}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">
                            {website.priceCents ? `$${(website.priceCents / 100).toFixed(2)}` : 
                             website.price ? `$${website.price.toFixed(2)}` : '$0.00'}
                          </div>
                        </div>
                        
                        {/* DA */}
                        <div className="col-span-1 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">{website.DA || 0}</div>
                        </div>
                        
                        {/* DR */}
                        <div className="col-span-1 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">{website.DR || 0}</div>
                        </div>
                        
                        {/* Organic Traffic */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">{website.OrganicTraffic || 0}</div>
                        </div>
                        
                        {/* Spam */}
                        <div className="col-span-1 flex justify-center">
                          <div className="text-sm font-medium text-gray-900">{website.Spam || 0}</div>
                        </div>
                        
                        {/* Owner */}
                        <div className="col-span-2 flex justify-center">
                          <div className="text-sm text-gray-900 truncate max-w-[120px]" title={website.ownerId || ''}>
                            {(website.ownerId || '').length > 15 ? `${(website.ownerId || '').substring(0, 15)}...` : (website.ownerId || '')}
                          </div>
                        </div>
                        
                        {/* Status */}
                        <div className="col-span-2 flex justify-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (website.status || 'pending') === 'approved' 
                              ? 'bg-green-100 text-green-800'
                              : (website.status || 'pending') === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(website.status || 'pending').toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-3 flex justify-center">
                          <div className="flex space-x-2">
                            <a
                              href={website.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                              title="Visit website"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                            {(website.status || 'pending') === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateWebsiteStatus(website.id, "approved")}
                                  className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                  title="Approve website"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => openRejectModal(website)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  title="Reject website"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            )}
                            {(website.status || 'pending') === 'approved' && (
                              <button
                                onClick={() => openRejectModal(website)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                title="Reject website"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            {(website.status || 'pending') === 'rejected' && (
                              <button
                                onClick={() => updateWebsiteStatus(website.id, "approved")}
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                title="Approve website"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Expand */}
                        <div className="col-span-1 flex justify-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SuperAdminWebsitesSection;