// app/cart/page.tsx (updated)
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CartPage() {
  const { cart, removeFromCart: originalRemoveFromCart, clearCart: originalClearCart, totalCents } = useCart();
  
  // Wrap removeFromCart to also clear selected option
  const removeFromCart = (itemId: string) => {
    // Clear the selected option for this item
    setSelectedOptions(prev => {
      const newOptions = {...prev};
      delete newOptions[itemId];
      return newOptions;
    });
    // Call the original removeFromCart function
    originalRemoveFromCart(itemId);
  };
  
  // Wrap clearCart to also clear all selected options
  const clearCart = () => {
    // Clear all selected options
    setSelectedOptions({});
    // Call the original clearCart function
    originalClearCart();
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId, isSignedIn } = useAuth();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestTopic, setRequestTopic] = useState("");
  const [wordCount, setWordCount] = useState(500);
  const [uploading, setUploading] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadsByWebsite, setUploadsByWebsite] = useState<Record<string, number>>({});
  const [modalKey, setModalKey] = useState(0); // Add key to force re-render
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}); // Track which option is selected for each item
  
  // Create ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state for the content request form
  const [contentRequestData, setContentRequestData] = useState({
    titleSuggestion: '',
    keywords: '',
    anchorText: '',
    targetAudience: '',
    wordCount: '',
    category: '',
    referenceLink: '',
    landingPageUrl: '',
    briefNote: ''
  });

  useEffect(() => {
    if (!isSignedIn) { setUploadsByWebsite({}); return; }
    fetch("/api/my-content")
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        const items: any[] = data.items || [];
        const map: Record<string, number> = {};
        for (const it of items) {
          const wid = it.websiteId || "";
          if (!wid) continue;
          map[wid] = (map[wid] || 0) + 1;
        }
        setUploadsByWebsite(map);
      })
      .catch(() => setUploadsByWebsite({}));
  }, [isSignedIn, cart.length]);

  // Reset file input when modal opens/closes
  useEffect(() => {
    if (showContentModal) {
      // Reset file input when modal opens
      setTimeout(() => {
        resetFileInput();
      }, 50);
    } else {
      // Reset file input when modal closes
      resetFileInput();
    }
  }, [showContentModal]);

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("Please sign in to proceed with checkout");
      return;
    }

    setIsProcessing(true);
    try {
      // Send purchase requests to super admin
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: cart.map(item => ({
            websiteId: item._id,
            title: item.title,
            priceCents: item.priceCents
          })),
          customerId: userId,
          customerEmail: "user@example.com" // In a real app, get from user profile
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      // Clear cart and reset all states for fresh experience
      clearCart();
      
      // Clear cached upload data
      setUploadsByWebsite({});
      setMyUploads([]);
      
      // Reset modal states
      setShowContentModal(false);
      setShowRequestModal(false);
      setShowConfirmModal(false);
      
      // Reset form data
      setContentRequestData({
        titleSuggestion: '',
        keywords: '',
        anchorText: '',
        targetAudience: '',
        wordCount: '',
        category: '',
        referenceLink: '',
        landingPageUrl: '',
        briefNote: ''
      });
      
      // Reset file input
      resetFileInput();
      
      alert("Purchase request sent! The administrator will review your order.");
      
    } catch (err) {
      console.error("Failed to complete purchase:", err);
      alert("Failed to complete purchase. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openContentModal = (item: any) => {
    setSelectedItem(item);
    setShowContentModal(true);
    setModalKey(prev => prev + 1); // Increment key to force fresh render
    // Set this item's selected option to 'content'
    setSelectedOptions(prev => ({
      ...prev,
      [item._id]: 'content'
    }));
    // Reset file input for fresh start - use setTimeout to ensure modal is rendered
    setTimeout(() => {
      resetFileInput();
    }, 100);
    // preload existing uploads for this website
    fetch(`/api/my-content?websiteId=${encodeURIComponent(item._id)}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => {
        setMyUploads(data.items ?? []);
        // Update the uploadsByWebsite count for this item
        if (data.items && data.items.length > 0) {
          setUploadsByWebsite(prev => ({
            ...prev,
            [item._id]: data.items.length
          }));
        }
      })
      .catch(() => setMyUploads([]));
  };

  const openRequestModal = (item: any) => {
    setSelectedItem(item);
    setShowRequestModal(true);
    // Set this item's selected option to 'request'
    setSelectedOptions(prev => ({
      ...prev,
      [item._id]: 'request'
    }));
    // Reset form data when opening modal
    setContentRequestData({
      titleSuggestion: '',
      keywords: '',
      anchorText: '',
      targetAudience: '',
      wordCount: '',
      category: '',
      referenceLink: '',
      landingPageUrl: '',
      briefNote: ''
    });
  };

  const handleContentRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentRequestData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleContentRequest = async () => {
    // Validate required fields
    if (!contentRequestData.keywords.trim()) {
      alert("Please provide keywords");
      return;
    }
    if (!contentRequestData.anchorText.trim()) {
      alert("Please provide anchor text");
      return;
    }
    if (!contentRequestData.targetAudience) {
      alert("Please select target audience");
      return;
    }
    if (!contentRequestData.wordCount) {
      alert("Please select word count");
      return;
    }
    if (!contentRequestData.category) {
      alert("Please select category");
      return;
    }
    if (!contentRequestData.landingPageUrl.trim()) {
      alert("Please provide landing page URL");
      return;
    }

    try {
      // Send content request to the server
      const res = await fetch("/api/content-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: selectedItem._id,
          websiteTitle: selectedItem.title,
          topic: contentRequestData.keywords, // Using keywords as topic
          wordCount: parseInt(contentRequestData.wordCount),
          customerId: userId,
          customerEmail: "user@example.com", // In a real app, get from user profile
          contentRequest: contentRequestData // Include the full request data
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      alert("Content request submitted successfully!");
      setShowRequestModal(false);
      
    } catch (err: any) {
      console.error("Failed to submit content request:", err);
      alert(`Failed to submit content request: ${err.message || "Please try again."}`);
    }
  };

  const resetFileInput = () => {
    // Reset file state
    setPdfFile(null);
    setRequirements("");
    
    // Reset file input using ref - with additional safety checks
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      // Force a re-render by triggering a change event
      fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Also try to reset any other file inputs that might exist
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    allFileInputs.forEach((input: any) => {
      if (input.accept === "application/pdf") {
        input.value = "";
      }
    });
  };

  const handleClearCart = () => {
    // Ask for confirmation before clearing
    if (!confirm("Are you sure you want to clear your cart? This action cannot be undone.")) {
      return;
    }
    
    // Clear cart
    clearCart();
    
    // Clear cached upload data
    setUploadsByWebsite({});
    setMyUploads([]);
    
    // Reset modal states
    setShowContentModal(false);
    setShowRequestModal(false);
    setShowConfirmModal(false);
    
    // Reset form data
    setContentRequestData({
      titleSuggestion: '',
      keywords: '',
      anchorText: '',
      targetAudience: '',
      wordCount: '',
      category: '',
      referenceLink: '',
      landingPageUrl: '',
      briefNote: ''
    });
    
    // Reset file input
    resetFileInput();
    
    alert("Cart cleared successfully!");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6" style={{backgroundColor: 'var(--base-primary)'}}>
        <div className="rounded-lg shadow-sm p-8 text-center" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{backgroundColor: 'var(--base-secondary)'}}>
            <svg
              className="w-8 h-8"
              style={{color: 'var(--secondary-lighter)'}}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2" style={{color: 'var(--secondary-primary)'}}>Your cart is empty</h3>
          <p className="mb-6" style={{color: 'var(--secondary-lighter)'}}>Add some websites to your cart to get started.</p>
          <Link
            href="/dashboard/consumer"
            className="px-4 py-2 rounded-md transition-colors font-medium text-sm"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-primary)'}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6" style={{backgroundColor: 'var(--base-primary)'}}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{color: 'var(--secondary-primary)'}}>Shopping Cart</h1>
        <Link
          href="/dashboard/consumer"
          className="flex items-center transition-colors"
          style={{color: 'var(--accent-primary)'}}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-hover)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--accent-primary)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="rounded-lg shadow-sm overflow-hidden" style={{backgroundColor: 'var(--base-primary)', border: '1px solid var(--base-tertiary)'}}>
        <div className="p-6" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
          <div className="grid grid-cols-12 gap-4 font-semibold uppercase tracking-wider text-xs pb-4" style={{color: 'var(--secondary-lighter)'}}>
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Content Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {cart.map((item, idx) => (
            <div key={item._id ?? idx} className="grid grid-cols-12 gap-4 py-4 border-b hover:bg-gray-50 items-center">
              <div className="col-span-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {item.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <div className="text-sm font-medium text-gray-900">${(item.priceCents / 100).toFixed(2)}</div>
              </div>
              <div className="col-span-2 text-center">
                {selectedOptions[item._id] === 'content' && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-blue-600 font-medium">My Content</span>
                    <button 
                      onClick={() => openContentModal(item)}
                      className="mt-1 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
                      title="View uploaded documents"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {uploadsByWebsite[item._id] > 0 && (
                        <span className="ml-1 text-xs font-medium">{uploadsByWebsite[item._id]}</span>
                      )}
                    </button>
                  </div>
                )}
                {selectedOptions[item._id] === 'request' && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-green-600 font-medium">Request Content</span>
                    <button 
                      onClick={() => openRequestModal(item)}
                      className="mt-1 p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors flex items-center justify-center"
                      title="View request details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                )}
                {!selectedOptions[item._id] && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 font-medium">Not Selected</span>
                  </div>
                )}
              </div>
              <div className="col-span-3 flex items-center justify-end gap-1">
                <button
                  onClick={() => {
                    openContentModal(item);
                    // Set this item's selected option to 'content'
                    setSelectedOptions(prev => ({
                      ...prev,
                      [item._id]: 'content'
                    }));
                  }}
                  disabled={selectedOptions[item._id] === 'request'}
                  className={`px-2 py-0.5 text-white rounded text-xs transition-colors font-medium ${selectedOptions[item._id] === 'request' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  My Content
                </button>
                <button
                  onClick={() => {
                    openRequestModal(item);
                    // Set this item's selected option to 'request'
                    setSelectedOptions(prev => ({
                      ...prev,
                      [item._id]: 'request'
                    }));
                  }}
                  disabled={selectedOptions[item._id] === 'content'}
                  className={`px-2 py-0.5 text-white rounded text-xs transition-colors font-medium ${selectedOptions[item._id] === 'content' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  Request
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-200">
          <button
            onClick={() => {
              handleClearCart();
              // Clear all selected options
              setSelectedOptions({});
            }}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 flex items-center hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>

          <div className="text-right">
            <div className="text-xl font-bold text-gray-900 mb-3">
              Total: ${(totalCents / 100).toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !isSignedIn}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </button>
            {!isSignedIn && (
              <p className="text-sm text-red-600 mt-2">Please sign in to checkout</p>
            )}
          </div>
        </div>
      </div>

      {/* My Content Modal */}
      {showContentModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Content for {selectedItem.title}</h3>
                             <button
                 onClick={() => {
                   setShowContentModal(false);
                   resetFileInput();
                   // Reset the selected option for this item if user closes without completing
                   if (selectedItem) {
                     setSelectedOptions(prev => {
                       const newOptions = {...prev};
                       delete newOptions[selectedItem._id];
                       return newOptions;
                     });
                   }
                 }}
                 className="text-gray-500 hover:text-gray-700"
               >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Upload form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!isSignedIn) { alert("Please sign in first"); return; }
                if (!pdfFile) { alert("Please select a PDF file"); return; }
                if (!requirements.trim()) { alert("Enter requirements"); return; }
                setShowConfirmModal(true);
              }}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Document</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  {!pdfFile ? (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">Drag and drop your PDF here, or</p>
                      <div className="mt-2">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Browse Files
                          <input
                            key={`file-input-${selectedItem?._id}-${modalKey}`}
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                              if (f && f.size > 10 * 1024 * 1024) { alert("File must be <= 10MB"); e.currentTarget.value = ""; setPdfFile(null); return; }
                              if (f && f.type !== "application/pdf") { alert("Only PDF files are allowed"); e.currentTarget.value = ""; setPdfFile(null); return; }
                              setPdfFile(f);
                            }}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">PDF files only, up to 10MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                          <p className="text-xs text-gray-500">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Enter your requirements"
                  className="w-full p-2 border rounded-md h-28"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                                 <button
                   type="button"
                   onClick={() => {
                     setShowContentModal(false);
                     resetFileInput();
                     // Reset the selected option for this item if user closes without completing
                     if (selectedItem) {
                       setSelectedOptions(prev => {
                         const newOptions = {...prev};
                         delete newOptions[selectedItem._id];
                         return newOptions;
                       });
                     }
                   }}
                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                 >
                   Close
                 </button>
                <button
                  type="submit"
                  disabled={!pdfFile || !requirements.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </form>

            {/* List of previous uploads */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-4 text-lg text-gray-800">Your Uploaded Documents</h4>
              {myUploads.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-600">No documents uploaded yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {myUploads.map((u, i) => (
                    <li key={i} className="border border-gray-200 rounded-md p-4 flex justify-between items-center text-sm hover:bg-blue-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-xs">{u.pdf?.filename ?? "PDF Document"}</div>
                          <div className="text-gray-600 mt-1">{u.requirements?.slice(0, 80)}{u.requirements && u.requirements.length > 80 ? "…" : ""}</div>
                        </div>
                      </div>
                      <div className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{u.pdf?.size ? `${Math.round(u.pdf.size / 1024)} KB` : ""}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Content Modal - Updated with the form from screenshot */}
      {showRequestModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Request Content for {selectedItem.title}</h3>
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  // Reset the selected option for this item if user closes without completing
                  if (selectedItem) {
                    setSelectedOptions(prev => {
                      const newOptions = {...prev};
                      delete newOptions[selectedItem._id];
                      return newOptions;
                    });
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-bold text-lg mb-2">Language*</h4>
              <div className="mb-2">
                <h5 className="font-semibold">English</h5>
                <p className="text-sm text-gray-600">Note: The publisher only accepts content in English</p>
              </div>
            </div>

            <form className="space-y-6">
              {/* Title Suggestion & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title Suggestion
                  </label>
                  <input
                    type="text"
                    name="titleSuggestion"
                    value={contentRequestData.titleSuggestion}
                    onChange={handleContentRequestChange}
                    placeholder="Suggest Title"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 required">
                    Keywords*
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={contentRequestData.keywords}
                    onChange={handleContentRequestChange}
                    placeholder="Provide Keywords; Separated by comma"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Anchor Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  Anchor Text*
                  </label>
                <input
                  type="text"
                  name="anchorText"
                  value={contentRequestData.anchorText}
                  onChange={handleContentRequestChange}
                  placeholder="Enter Anchor text"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  Target Audience is from (Country)*
                </label>
                <select
                  name="targetAudience"
                  value={contentRequestData.targetAudience}
                  onChange={handleContentRequestChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Target Audience</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="in">India</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="jp">Japan</option>
                  <option value="br">Brazil</option>
                </select>
              </div>

              <hr className="my-4" />

              {/* Word Count & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 required">
                    Word Count*
                  </label>
                  <select
                    name="wordCount"
                    value={contentRequestData.wordCount}
                    onChange={handleContentRequestChange}
                    className="w-full p-2 border rounded-md"
                    required
                >
                  <option value="">Select Word Count</option>
                  <option value="500">500 words</option>
                  <option value="1000">1000 words</option>
                  <option value="1500">1500 words</option>
                  <option value="2000">2000 words</option>
                  <option value="2500">2500+ words</option>
                </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 required">
                    Category*
                  </label>
                  <select
                    name="category"
                    value={contentRequestData.category}
                    onChange={handleContentRequestChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="technology">Technology</option>
                    <option value="health">Health & Wellness</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="travel">Travel</option>
                    <option value="food">Food & Cooking</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              {/* Reference Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Link
                </label>
                <input
                  type="url"
                  name="referenceLink"
                  value={contentRequestData.referenceLink}
                  onChange={handleContentRequestChange}
                  placeholder="eg. https://example.com"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Landing Page URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 required">
                  Landing Page URL*
                </label>
                <input
                  type="url"
                  name="landingPageUrl"
                  value={contentRequestData.landingPageUrl}
                  onChange={handleContentRequestChange}
                  placeholder="Enter Landing Page URL"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Brief Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brief Note
                </label>
                <textarea
                  name="briefNote"
                  value={contentRequestData.briefNote}
                  onChange={handleContentRequestChange}
                  placeholder="Brief Note: Any additional notes required can be specified here in detail."
                  className="w-full p-2 border rounded-md h-24"
                  rows={4}
                />
              </div>
            </form>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  // Reset the selected option for this item if user closes without completing
                  if (selectedItem) {
                    setSelectedOptions(prev => {
                      const newOptions = {...prev};
                      delete newOptions[selectedItem._id];
                      return newOptions;
                    });
                  }
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleContentRequest}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {showConfirmModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Upload</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-3">Please confirm your upload details:</p>
              <div className="space-y-2 text-sm">
                <div><strong>Website:</strong> {selectedItem.title}</div>
                <div><strong>File:</strong> {pdfFile?.name}</div>
                <div><strong>Size:</strong> {pdfFile ? `${(pdfFile.size / 1024).toFixed(1)} KB` : ""}</div>
                <div><strong>Requirements:</strong> {requirements}</div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setUploading(true);
                    setShowConfirmModal(false);
                    const fd = new FormData();
                    fd.append("pdfFile", pdfFile!);
                    fd.append("requirements", requirements);
                    fd.append("websiteId", selectedItem._id);
                    const res = await fetch("/api/my-content", { method: "POST", body: fd });
                    if (!res.ok) {
                      let msg = `HTTP ${res.status}`;
                      try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
                      throw new Error(msg);
                    }
                    // refresh list
                    const listRes = await fetch(`/api/my-content?websiteId=${encodeURIComponent(selectedItem._id)}`);
                    const list = await listRes.json();
                    setMyUploads(list.items ?? []);
                    // refresh counts across cart
                    try {
                      const allRes = await fetch("/api/my-content");
                      if (allRes.ok) {
                        const all = await allRes.json();
                        const items: any[] = all.items || [];
                        const map: Record<string, number> = {};
                        for (const it of items) {
                          const wid = it.websiteId || "";
                          if (!wid) continue;
                          map[wid] = (map[wid] || 0) + 1;
                        }
                        setUploadsByWebsite(map);
                        
                        // Ensure the selected option is set to 'content' for this item
                        if (selectedItem && selectedItem._id) {
                          setSelectedOptions(prev => ({
                            ...prev,
                            [selectedItem._id]: 'content'
                          }));
                        }
                      }
                    } catch {}
                                         setRequirements("");
                     setPdfFile(null);
                     if (fileInputRef.current) {
                       fileInputRef.current.value = "";
                     }
                     alert("Uploaded successfully");
                  } catch (err: any) {
                    alert(`Upload failed: ${err?.message ?? "Unknown error"}`);
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Confirm Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}