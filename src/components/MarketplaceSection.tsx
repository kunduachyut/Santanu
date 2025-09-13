import { useState } from "react";
import { useCart } from "../app/context/CartContext";

// Country flag mapping function
const getCountryFlag = (countryName: string | undefined): string => {
  if (!countryName) return '🌐';
  
  const countryFlags: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'Russia': '🇷🇺',
    'Other': '🌐'
  };
  
  return countryFlags[countryName] || '🌐';
};

type Website = {
  _id?: string;
  id?: string;
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
  category?: string | string[];
  primaryCountry?: string;
};

export default function MarketplaceSection({ 
  websites, 
  loading, 
  error, 
  refreshWebsites,
  selectedItems,
  setSelectedItems,
  selectAll,
  setSelectAll,
  searchQuery,
  setSearchQuery,
  paidSiteIds
}: {
  websites: Website[];
  loading: boolean;
  error: string;
  refreshWebsites: () => void;
  selectedItems: Record<string, boolean>;
  setSelectedItems: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  selectAll: boolean;
  setSelectAll: (selectAll: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  paidSiteIds: Set<string>;
}) {
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minDA: '',
    maxDA: '',
    minDR: '',
    maxDR: '',
    minOrganicTraffic: '',
    maxOrganicTraffic: '',
    category: '',
    country: '',
  });

  // Get unique categories and countries from websites
  const uniqueCategories = Array.from(
    new Set(websites.flatMap(w => Array.isArray(w.category) ? w.category : w.category ? [w.category] : []))
  ).filter(Boolean) as string[];

  const uniqueCountries = Array.from(
    new Set(websites.map(w => w.primaryCountry).filter(Boolean))
  ).filter(Boolean) as string[];

  // Apply filters to websites
  const filteredWebsites = websites.filter(w => {
    // Search filter
    if (searchQuery) {
      const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           w.url.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Price filters
    if (filters.minPrice && w.priceCents < parseFloat(filters.minPrice) * 100) return false;
    if (filters.maxPrice && w.priceCents > parseFloat(filters.maxPrice) * 100) return false;

    // DA filters
    if (filters.minDA && (w.DA || 0) < parseInt(filters.minDA)) return false;
    if (filters.maxDA && (w.DA || 0) > parseInt(filters.maxDA)) return false;

    // DR filters
    if (filters.minDR && (w.DR || 0) < parseInt(filters.minDR)) return false;
    if (filters.maxDR && (w.DR || 0) > parseInt(filters.maxDR)) return false;

    // Organic Traffic filters
    if (filters.minOrganicTraffic && (w.OrganicTraffic || 0) < parseInt(filters.minOrganicTraffic)) return false;
    if (filters.maxOrganicTraffic && (w.OrganicTraffic || 0) > parseInt(filters.maxOrganicTraffic)) return false;

    // Category filter
    if (filters.category) {
      const websiteCategories = Array.isArray(w.category) ? w.category : w.category ? [w.category] : [];
      if (!websiteCategories.includes(filters.category)) return false;
    }

    // Country filter
    if (filters.country && w.primaryCountry !== filters.country) return false;

    return true;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minDA: '',
      maxDA: '',
      minDR: '',
      maxDR: '',
      minOrganicTraffic: '',
      maxOrganicTraffic: '',
      category: '',
      country: '',
    });
  };

  return (
    <div>
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={refreshWebsites}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-500">{filteredWebsites.length} websites available</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const selectedCount = Object.values(selectedItems).filter(Boolean).length;
              if (selectedCount === 0) {
                alert("Please select at least one website");
                return;
              }
              
              // Add selected websites to cart
              websites.forEach(w => {
                const id = w._id || w.id || `${w.title}-${w.url}`;
                if (selectedItems[id]) {
                  addToCart({
                    _id: id,
                    title: w.title,
                    priceCents: w.priceCents,
                  });
                }
              });
              
              // Reset selection
              setSelectedItems(prev => ({}));
              setSelectAll(false);
              
              alert(`${selectedCount} website(s) added to cart!`);
            }}
            disabled={Object.values(selectedItems).filter(Boolean).length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add Selected to Cart
          </button>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
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
            {(filters.minPrice || filters.maxPrice || filters.minDA || filters.maxDA || 
              filters.minDR || filters.maxDR || filters.minOrganicTraffic || filters.maxOrganicTraffic || 
              filters.category || filters.country) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* DA Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DA Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minDA"
                  placeholder="Min"
                  value={filters.minDA}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  name="maxDA"
                  placeholder="Max"
                  value={filters.maxDA}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* DR Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DR Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minDR"
                  placeholder="Min"
                  value={filters.minDR}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  name="maxDR"
                  placeholder="Max"
                  value={filters.maxDR}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Organic Traffic Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organic Traffic Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minOrganicTraffic"
                  placeholder="Min"
                  value={filters.minOrganicTraffic}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  name="maxOrganicTraffic"
                  placeholder="Max"
                  value={filters.maxOrganicTraffic}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading marketplace...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Marketplace</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshWebsites}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredWebsites.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Websites Found</h3>
              <p className="text-gray-600">
                {websites.length > 0 
                  ? "Try adjusting your filters to see more results" 
                  : "Check back later for new digital assets"}
              </p>
              {websites.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-24 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-1 flex justify-center">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectAll(isChecked);
                      const newSelectedItems: Record<string, boolean> = {};
                      websites.forEach(w => {
                        const id = w._id || w.id || `${w.title}-${w.url}`;
                        newSelectedItems[id] = isChecked;
                      });
                      setSelectedItems(prev => newSelectedItems);
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4 flex items-center">WEBSITE NAME</div>
                <div className="col-span-2 flex justify-center">PRICE</div>
                <div className="col-span-1 flex justify-center">DA</div>
                <div className="col-span-1 flex justify-center">DR</div>
                <div className="col-span-2 flex justify-center">ORGANIC TRAFFIC</div>
                <div className="col-span-1 flex justify-center">SPAM</div>
                <div className="col-span-2 flex justify-center">RD LINK</div>
                <div className="col-span-1 flex justify-center">COUNTRY</div>
                <div className="col-span-2 flex justify-center">CATEGORY</div>
                <div className="col-span-2 flex justify-center">DESCRIPTION</div>
                <div className="col-span-2 flex justify-center">STATUS</div>
                <div className="col-span-2 flex justify-center">ACTIONS</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredWebsites
                  .map((w) => {
                  const stableId = w._id || w.id || `${w.title}-${w.url}`;
                  const isPurchased = paidSiteIds.has(stableId);
                  
                  return (
                    <div key={stableId} className="grid grid-cols-24 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                      {/* Checkbox */}
                      <div className="col-span-1 flex justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedItems[stableId] || false}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedItems((prev) => ({
                              ...prev,
                              [stableId]: isChecked
                            }));
                            const allSelected = Object.keys(selectedItems).length === websites.length - 1 && isChecked;
                            setSelectAll(allSelected);
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        />
                      </div>
                      
                      {/* Website Title */}
                      <div className="col-span-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {w.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{w.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[150px]" title={w.url}>
                              {w.url.length > 30 ? `${w.url.substring(0, 30)}...` : w.url}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 flex justify-center">
                        <div className="text-sm font-medium text-green-600">${(w.priceCents / 100).toFixed(2)}</div>
                      </div>
                      
                      {/* DA */}
                      <div className="col-span-1 flex justify-center">
                        <div className="text-sm font-medium text-gray-900">{w.DA || 0}</div>
                      </div>
                      
                      {/* DR */}
                      <div className="col-span-1 flex justify-center">
                        <div className="text-sm font-medium text-gray-900">{w.DR || 0}</div>
                      </div>
                      
                      {/* Organic Traffic */}
                      <div className="col-span-2 flex justify-center">
                        <div className="text-sm font-medium text-gray-900">{w.OrganicTraffic || 0}</div>
                      </div>
                      
                      {/* Spam */}
                      <div className="col-span-1 flex justify-center">
                        <div className="text-sm font-medium text-gray-900">{w.Spam || 0}</div>
                      </div>
                      
                      {/* RD */}
                      <div className="col-span-2 flex justify-center">
                        {w.RD ? (
                          <a 
                            href={w.RD} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800"
                            title="Open RD Link"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">0</span>
                        )}
                      </div>
                      
                      {/* Country */}
                      <div className="col-span-1 flex justify-center">
                        {w.primaryCountry ? (
                          <div className="relative group">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold cursor-help">
                              {getCountryFlag(w.primaryCountry)}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              {w.primaryCountry}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">-</span>
                        )}
                      </div>
                      
                      {/* Category */}
                      <div className="col-span-2 flex justify-center">
                        {w.category ? (
                          <div className="relative group">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold cursor-help">
                              C
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              {Array.isArray(w.category) ? w.category.join(', ') : w.category}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">-</span>
                        )}
                      </div>
                      
                      {/* Description */}
                      <div className="col-span-2 flex justify-center">
                        {w.description ? (
                          <div className="relative group">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold cursor-help">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 max-w-xs">
                              <div className="max-h-20 overflow-y-auto">
                                {w.description}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">-</span>
                        )}
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-2 flex justify-center">
                        {isPurchased ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Purchased
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Available
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex space-x-2">
                          <a
                            href={w.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="Visit Website"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          
                          <button
                            onClick={() => addToCart({
                              _id: stableId,
                              title: w.title,
                              priceCents: typeof w.priceCents === 'number' ? w.priceCents : Math.round((w.priceCents || 0) * 100),
                            })}
                            disabled={isPurchased}
                            className={`p-1 ${isPurchased ? 'text-green-500 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                            title={isPurchased ? 'Already Purchased' : 'Add to Cart'}
                          >
                            {isPurchased ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* More Options */}
                      <div className="col-span-1 flex justify-end">
                        <button className="text-gray-400 hover:text-gray-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{websites.length}</span> of{" "}
                      <span className="font-medium">{websites.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        aria-current="page"
                        className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </a>
                      <a
                        href="#"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}