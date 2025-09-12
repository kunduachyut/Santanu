import React, { useState } from "react";

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

// Define the categories as requested with mapping to backend enum values
const CATEGORIES = [
  { id: 1, name: "Finance, Insurance & Investment", backendValue: "business" },
  { id: 2, name: "Crypto, Blockchain, Bitcoin & Digital Assets", backendValue: "business" },
  { id: 3, name: "Health, Wellness, Fitness & Personal Care", backendValue: "business" },
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

export default function PublisherAddWebsiteSection({ 
  editingWebsite,
  formData,
  handleFormChange,
  handleSubmit,
  formLoading,
  resetForm,
  setActiveTab
}: {
  editingWebsite: Website | null;
  formData: {
    title: string;
    url: string;
    description: string;
    category: string;
    price: string;
    DA: string;
    PA: string;
    Spam: string;
    OrganicTraffic: string;
    DR: string;
    RD: string;
    tags: string;
  };
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  formLoading: boolean;
  resetForm: () => void;
  setActiveTab: (tab: "dashboard" | "websites" | "add-website" | "analytics" | "earnings" | "settings") => void;
}) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    formData.category ? formData.category.split(',').map(Number).filter(Boolean) : []
  );

  // Function to handle category selection
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  // Function to save selected categories
  const saveCategories = () => {
    // For now, we'll use the backend value of the first selected category
    // In a more sophisticated implementation, we might want to handle multiple categories differently
    if (selectedCategories.length > 0) {
      const firstCategory = CATEGORIES.find(cat => cat.id === selectedCategories[0]);
      if (firstCategory) {
        // Update the form data with the backend enum value
        handleFormChange({
          target: {
            name: 'category',
            value: firstCategory.backendValue
          }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
    
    setShowCategoryModal(false);
  };

  // Function to clear all selected categories
  const clearCategories = () => {
    setSelectedCategories([]);
    handleFormChange({
      target: {
        name: 'category',
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-left bg-white"
            >
              {selectedCategories.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.slice(0, 3).map(id => {
                    const category = CATEGORIES.find(cat => cat.id === id);
                    return category ? (
                      <span key={id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {category.name}
                      </span>
                    ) : null;
                  })}
                  {selectedCategories.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      + {selectedCategories.length - 3} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">Select categories</span>
              )}
            </button>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={clearCategories}
                className="mt-1 text-xs text-red-600 hover:text-red-800"
              >
                Clear selection
              </button>
            )}
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
            disabled={formLoading || selectedCategories.length === 0}
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

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Select Categories</h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-gray-500 mt-1">Select one or more categories for your website</p>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${
                        selectedCategories.includes(category.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedCategories.includes(category.id) && (
                          <span className="material-symbols-outlined text-white text-sm">check</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.id}. {category.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Backend: {category.backendValue}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <div className="text-sm text-gray-500">
                {selectedCategories.length} category{selectedCategories.length !== 1 ? 's' : ''} selected
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCategories}
                  disabled={selectedCategories.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  Save Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}