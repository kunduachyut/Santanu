"use client";

import React, { useState, useEffect } from "react";

// Type definitions
type UserContent = {
  _id: string;
  userId: string;
  userEmail?: string;
  websiteId?: string;
  websiteTitle?: string;
  requirements: string;
  pdf?: {
    filename: string;
    size: number;
  };
  createdAt: string;
};

type SuperAdminUserContentSectionProps = {
  userContent: UserContent[];
  userContentLoading: boolean;
  formatDate: (dateString?: string) => string;
};

const SuperAdminUserContentSection: React.FC<SuperAdminUserContentSectionProps> = ({
  userContent,
  userContentLoading,
  formatDate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredContent, setFilteredContent] = useState<UserContent[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Filter content based on search and date range by calling the API
  const applyFilters = async () => {
    setIsFiltering(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }
      
      const response = await fetch(`/api/admin/user-content?${params.toString()}`);
      const data = await response.json();
      
      if (data.items) {
        setFilteredContent(data.items);
      } else {
        setFilteredContent([]);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredContent(userContent || []);
    } finally {
      setIsFiltering(false);
    }
  };

  // Apply filters when search or date range changes
  useEffect(() => {
    if (searchQuery || startDate || endDate) {
      const timeoutId = setTimeout(() => {
        applyFilters();
      }, 500); // Debounce filter application
      
      return () => clearTimeout(timeoutId);
    } else {
      // If no filters, show all content
      setFilteredContent(userContent || []);
    }
  }, [searchQuery, startDate, endDate]);

  // Initialize filtered content with all user content
  useEffect(() => {
    setFilteredContent(userContent || []);
  }, [userContent]);

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = () => {
    return searchQuery !== "" || startDate !== "" || endDate !== "";
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            User Uploads
          </span>
        </h2>
        
        {/* Search and Filter Bar - Matching Marketplace design */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">{filteredContent.length} uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by website or user..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {/* Filter indicator dot */}
              {hasActiveFilters() && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel - Matching Marketplace design */}
        {showFilters && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Date Range Filter</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
        
        {userContentLoading || isFiltering ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-sm">{isFiltering ? "Applying filters..." : "Loading user uploads..."}</p>
            </div>
          </div>
        ) : (filteredContent || []).length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No User Uploads Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {hasActiveFilters() 
                ? "No uploads match your search criteria. Try adjusting your filters." 
                : "There are currently no user uploads to display. Users will see their uploads appear here once submitted."}
            </p>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredContent || []).map((content) => (
              <div key={content._id} className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[150px]" title={content.websiteTitle || 'Untitled'}>
                          {content.websiteTitle || 'Untitled'}
                        </h3>
                        <p className="text-xs text-gray-500">{content.userEmail || content.userId || 'Unknown user'}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Uploaded
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Requirements</h4>
                    <p className="text-sm text-gray-700 line-clamp-2" title={content.requirements}>
                      {content.requirements || 'No requirements specified'}
                    </p>
                  </div>
                  
                  {content.pdf && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]" title={content.pdf.filename}>
                            {content.pdf.filename}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {content.pdf.size ? `${(content.pdf.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {formatDate(content.createdAt)}
                    </span>
                    <a
                      href={`/api/admin/pdf/${content._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 hover:border-blue-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SuperAdminUserContentSection;