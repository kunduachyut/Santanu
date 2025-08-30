// app/cart/page.tsx (updated)
"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalCents } = useCart();
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

      // Clear cart on successful purchase request
      clearCart();
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
    // preload existing uploads for this website
    fetch(`/api/my-content?websiteId=${encodeURIComponent(item._id)}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => setMyUploads(data.items ?? []))
      .catch(() => setMyUploads([]));
  };

  const openRequestModal = (item: any) => {
    setSelectedItem(item);
    setShowRequestModal(true);
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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some websites to your cart to get started.</p>
          <Link
            href="/dashboard/consumer"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Link
          href="/dashboard/consumer"
          className="text-blue-500 hover:text-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 pb-4">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          {cart.map((item, idx) => (
            <div key={item._id ?? idx} className="grid grid-cols-12 gap-4 py-4 border-b items-center">
              <div className="col-span-6">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
              </div>
              <div className="col-span-2 text-center text-gray-700">
                ${(item.priceCents / 100).toFixed(2)}
              </div>
              <div className="col-span-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => openContentModal(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  My Content
                </button>
                {uploadsByWebsite[item._id] > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                    {uploadsByWebsite[item._id]} doc{uploadsByWebsite[item._id] > 1 ? "s" : ""}
                  </span>
                )}
                <button
                  onClick={() => openRequestModal(item)}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Request Content
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <button
            onClick={clearCart}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Cart
          </button>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              Total: ${(totalCents / 100).toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || !isSignedIn}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
                onClick={() => setShowContentModal(false)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                <div className="flex items-center gap-2">
                  <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                      if (f && f.size > 10 * 1024 * 1024) { alert("File must be <= 10MB"); e.currentTarget.value = ""; setPdfFile(null); return; }
                      if (f && f.type !== "application/pdf") { alert("Only PDF files are allowed"); e.currentTarget.value = ""; setPdfFile(null); return; }
                      setPdfFile(f);
                    }}
                    className="flex-1"
                  />
                  {pdfFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        (document.getElementById("pdf-input") as HTMLInputElement).value = "";
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {pdfFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
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
                  onClick={() => setShowContentModal(false)}
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
            <div>
              <h4 className="font-medium mb-2">Your uploads</h4>
              {myUploads.length === 0 ? (
                <p className="text-sm text-gray-600">No uploads yet.</p>
              ) : (
                <ul className="space-y-2">
                  {myUploads.map((u, i) => (
                    <li key={i} className="border rounded p-3 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium truncate max-w-xs">{u.pdf?.filename ?? "PDF"}</div>
                        <div className="text-gray-600">{u.requirements?.slice(0, 80)}{u.requirements && u.requirements.length > 80 ? "…" : ""}</div>
                      </div>
                      <div className="text-gray-500">{u.pdf?.size ? `${Math.round(u.pdf.size / 1024)} KB` : ""}</div>
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
                onClick={() => setShowRequestModal(false)}
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
                onClick={() => setShowRequestModal(false)}
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
                      }
                    } catch {}
                    setRequirements("");
                    setPdfFile(null);
                    (document.getElementById("pdf-input") as HTMLInputElement | null)?.value && ((document.getElementById("pdf-input") as HTMLInputElement).value = "");
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