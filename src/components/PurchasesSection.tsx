import { useEffect, useState } from "react";

export default function PurchasesSection({ 
  purchases, 
  loading, 
  error, 
  refreshPurchases,
  messages,
  setMessages
}: {
  purchases: any[];
  loading: boolean;
  error: string;
  refreshPurchases: () => void;
  messages: { [key: string]: string };
  setMessages: (updater: (prev: { [key: string]: string }) => { [key: string]: string }) => void;
}) {
  const [contentUploads, setContentUploads] = useState<Record<string, any[]>>({});
  const [loadingUploads, setLoadingUploads] = useState<Record<string, boolean>>({});

  // Fetch content uploads for each purchase
  useEffect(() => {
    const fetchContentUploads = async () => {
      if (purchases.length === 0) return;
      
      // Create a map of purchaseId to websiteId for lookup
      const purchaseToWebsiteMap: Record<string, string> = {};
      purchases.forEach(purchase => {
        const websiteId = getWebsiteId(purchase);
        if (websiteId) {
          purchaseToWebsiteMap[purchase._id] = websiteId;
        }
      });
      
      // Fetch uploads for each purchase
      Object.keys(purchaseToWebsiteMap).forEach(async (purchaseId) => {
        const websiteId = purchaseToWebsiteMap[purchaseId];
        if (!websiteId) return;
        
        setLoadingUploads(prev => ({ ...prev, [purchaseId]: true }));
        try {
          const res = await fetch(`/api/my-content?purchaseId=${purchaseId}`);
          if (res.ok) {
            const data = await res.json();
            setContentUploads(prev => ({
              ...prev,
              [purchaseId]: data.items || []
            }));
          }
        } catch (err) {
          console.error("Failed to fetch content uploads:", err);
        } finally {
          setLoadingUploads(prev => ({ ...prev, [purchaseId]: false }));
        }
      });
    };
    
    fetchContentUploads();
  }, [purchases]);

  const getWebsiteId = (purchase: any): string => {
    if (typeof purchase.websiteId === "string") {
      return purchase.websiteId;
    }
    if (purchase.websiteId?._id) {
      return purchase.websiteId._id;
    }
    return purchase.websiteId || "";
  };

  const getWebsiteTitle = (purchase: any): string => {
    if (purchase.websiteTitle) {
      return purchase.websiteTitle;
    }
    if (typeof purchase.websiteId === "object" && purchase.websiteId?.title) {
      return purchase.websiteId.title;
    }
    return "Unknown Website";
  };

  const getWebsiteUrl = (purchase: any): string => {
    if (purchase.websiteUrl) {
      return purchase.websiteUrl;
    }
    if (typeof purchase.websiteId === "object" && purchase.websiteId?.url) {
      return purchase.websiteId.url;
    }
    return "#";
  };

  const getAmountCents = (purchase: any): number => {
    if (typeof purchase.amountCents === "number" && !isNaN(purchase.amountCents)) {
      return purchase.amountCents;
    }
    if (typeof purchase.totalCents === "number" && !isNaN(purchase.totalCents)) {
      return purchase.totalCents;
    }
    if (typeof purchase.priceCents === "number" && !isNaN(purchase.priceCents)) {
      return purchase.priceCents;
    }
    return 0;
  };

  const updateMessage = (purchaseId: string, message: string) => {
    setMessages(prev => ({ ...prev, [purchaseId]: message }));
  };

  const requestAd = async (websiteId: string, purchaseId: string) => {
    const message = messages[purchaseId] || "";

    if (!message.trim()) {
      alert("Write a short message for the publisher.");
      return;
    }

    try {
      const res = await fetch("/api/ad-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, message, purchaseId }),
      });

      if (res.ok) {
        alert("Ad request sent!");
        setMessages(prev => ({ ...prev, [purchaseId]: "" }));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to send ad request");
      }
    } catch (err) {
      console.error("Failed to send ad request:", err);
      alert("Failed to send ad request. Please try again.");
    }
  };

  return (
    <div>
      {/* Table Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={refreshPurchases}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-500">{purchases.length} purchases found</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading purchases...</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Purchases</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshPurchases}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {purchases.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchases Yet</h3>
              <p className="text-gray-600 mb-4">Browse the marketplace to purchase digital assets</p>
              <button
                onClick={() => {
                  // This would need to be handled by the parent component
                  // For now, we'll just show an alert
                  alert("Please navigate to the marketplace tab to browse websites");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="grid grid-cols-16 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-5 flex items-center">WEBSITE NAME</div>
                <div className="col-span-3 flex justify-center">PURCHASE DATE</div>
                <div className="col-span-2 flex justify-center">AMOUNT</div>
                <div className="col-span-2 flex justify-center">STATUS</div>
                <div className="col-span-3 flex justify-center">ACTIONS</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {purchases.map((purchase, index) => {
                  const websiteTitle = getWebsiteTitle(purchase);
                  const websiteUrl = getWebsiteUrl(purchase);
                  const amountCents = getAmountCents(purchase);
                  const websiteId = getWebsiteId(purchase);
                  const uploads = contentUploads[purchase._id] || [];
                  const isLoadingUploads = loadingUploads[purchase._id] || false;
                  
                  return (
                    <div key={purchase._id || index} className="grid grid-cols-16 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                      {/* Website Info */}
                      <div className="col-span-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                            {websiteTitle.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{websiteTitle}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]" title={websiteUrl}>
                              {websiteUrl.length > 40 ? `${websiteUrl.substring(0, 40)}...` : websiteUrl}
                            </div>
                            {/* Show content uploads count */}
                            {uploads.length > 0 && (
                              <div className="mt-1 text-xs text-blue-600">
                                {uploads.length} content upload{uploads.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Purchase Date */}
                      <div className="col-span-3 flex justify-center">
                        <div className="text-sm text-gray-900">
                          {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="col-span-2 flex justify-center">
                        <div className="text-sm font-medium text-gray-900">${(amountCents / 100).toFixed(2)}</div>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-2 flex justify-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === 'paid' || purchase.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {purchase.status || 'Unknown'}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-3 flex justify-center">
                        <div className="flex space-x-2">
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="Visit Website"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          
                          {/* Ad Request Button */}
                          {(purchase.status === 'paid' || purchase.status === 'completed') && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Message for publisher"
                                value={messages[purchase._id] || ""}
                                onChange={(e) => updateMessage(purchase._id, e.target.value)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
                              />
                              <button
                                onClick={() => requestAd(websiteId, purchase._id)}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Request Ad Placement"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                                </svg>
                              </button>
                            </div>
                          )}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}