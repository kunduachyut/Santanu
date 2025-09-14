"use client";

import { useState } from "react";

export default function AccessRequestForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    country: "",
    traffic: "",
    numberOfWebsites: "",
    message: "",
    status: "pending" // Default status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ 
          email: "", 
          phone: "", 
          password: "",
          country: "",
          traffic: "",
          numberOfWebsites: "",
          message: "",
          status: "pending"
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mt-4 border-t pt-3 text-center">
        <p className="text-sm text-gray-600">
          Don't have access yet?{" "}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-medium hover:underline"
          >
            Request to become a Consumer
          </button>
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Request Consumer Access
              </h3>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <select
                  name="traffic"
                  value={formData.traffic}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Monthly Traffic</option>
                  <option value="0-10k">0 - 10,000 visitors</option>
                  <option value="10k-50k">10,000 - 50,000 visitors</option>
                  <option value="50k-100k">50,000 - 100,000 visitors</option>
                  <option value="100k-500k">100,000 - 500,000 visitors</option>
                  <option value="500k+">500,000+ visitors</option>
                </select>
              </div>

              <div>
                <select
                  name="numberOfWebsites"
                  value={formData.numberOfWebsites}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Number of Websites</option>
                  <option value="1">1</option>
                  <option value="2-5">2-5</option>
                  <option value="6-10">6-10</option>
                  <option value="10+">10+</option>
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Additional Information"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  Request submitted successfully!
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  Error submitting request. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}