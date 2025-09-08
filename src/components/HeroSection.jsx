"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--base-primary)'}}>
      {/* Hero Card */}
      <div className="hero-section text-center">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto" style={{color: 'var(--secondary-primary)'}}>
          The{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Publisher
          </span>{" "}
          for your Content & Links
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto" style={{color: 'var(--secondary-lighter)'}}>
          Create a central hub for all your important links – publish, organize,
          and share them with your audience in one beautiful, easy-to-manage
          platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <a href="/dashboard/publisher">
            <button 
              className="rounded-2xl px-6 py-3 transition"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--accent-hover)';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--accent-primary)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Get started as Publisher
            </button>
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl px-6 py-3 transition"
            style={{
              backgroundColor: 'var(--secondary-primary)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--secondary-light)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--secondary-primary)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Get started as Consumer
          </button>
        </div>

        {/* Placeholder for Hero Image */}
        <div className="mt-12 w-full max-w-4xl mx-auto h-64 rounded-xl flex items-center justify-center" style={{backgroundColor: 'var(--base-secondary)'}}>
          <span style={{color: 'var(--secondary-lighter)'}}>Platform Preview Image</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-8 justify-center">
          {[
            "Internal tools",
            "Customer portals",
            "SaaS apps",
            "Content",
            "Websites",
            "Content management",
          ].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1 rounded-full text-sm"
              style={{
                backgroundColor: 'var(--base-secondary)',
                color: 'var(--secondary-lighter)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{backgroundColor: 'rgba(13, 17, 23, 0.5)'}}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn"
            style={{backgroundColor: 'var(--base-primary)'}}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 transition-colors"
              style={{color: 'var(--secondary-lighter)'}}
              onMouseEnter={(e) => e.target.style.color = 'var(--secondary-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--secondary-lighter)'}
            >
              <FaTimes size={22} />
            </button>

            {/* Tabs */}
            <div className="flex mb-4" style={{borderBottom: '1px solid var(--base-tertiary)'}}>
              <button
                className={`flex-1 py-2 font-medium ${
                  !isSignup
                    ? ""
                    : ""
                }`}
                style={{
                  color: !isSignup ? 'var(--accent-primary)' : 'var(--secondary-lighter)',
                  borderBottom: !isSignup ? '2px solid var(--accent-primary)' : 'none'
                }}
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
            </div>

            {/* Form */}
            <LoginForm isSignup={isSignup} />

            {/* Request Access */}
            <AccessRequestForm />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Login Form Component ---------- */
function LoginForm({ isSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email) && password.trim() !== "") {
      router.push("/dashboard/consumer");
    } else {
      alert("Enter a valid email and password");
    }
  };

  return (
    <>
      {!isSignup ? (
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 font-medium" style={{color: 'var(--secondary-primary)'}}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
              style={{
                backgroundColor: 'var(--base-secondary)',
                border: '1px solid var(--base-tertiary)',
                color: 'var(--secondary-primary)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--base-tertiary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium" style={{color: 'var(--secondary-primary)'}}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
              style={{
                backgroundColor: 'var(--base-secondary)',
                border: '1px solid var(--base-tertiary)',
                color: 'var(--secondary-primary)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 2px var(--accent-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--base-tertiary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg transition"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-primary)'}
          >
            Login
          </button>
        </form>
      ) : null}
    </>
  );
}

/* ---------- Access Request Form Component ---------- */
function AccessRequestForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED handleSubmit (calls API)
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
        setFormData({ email: "", phone: "", message: "" });
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

      {/* Request Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Request Consumer Access
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the form below to request consumer access
              </p>
            </div>

            {/* Success / Error / Form */}
            {submitStatus === "success" ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-1">
                  Request Submitted
                </h4>
                <p className="text-gray-600">
                  Your request has been sent successfully. We'll contact you
                  shortly.
                </p>
              </div>
            ) : submitStatus === "error" ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-1">
                  Submission Failed
                </h4>
                <p className="text-gray-600">
                  There was an error submitting your request. Please try again.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Additional Information (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Tell us why you need consumer access..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
