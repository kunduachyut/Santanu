"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import AccessRequestForm from "./AccessRequestForm";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "var(--base-primary)" }}
    >
      {/* Hero Card */}
      <div className="hero-section text-center">
        <h1
          className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto"
          style={{ color: "var(--secondary-primary)" }}
        >
          The{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Publisher
          </span>{" "}
          for your Content & Links
        </h1>

        <p
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: "var(--secondary-lighter)" }}
        >
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
                backgroundColor: "var(--accent-primary)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--accent-hover)";
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--accent-primary)";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              Get started as Publisher
            </button>
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl px-6 py-3 transition"
            style={{
              backgroundColor: "var(--secondary-primary)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--secondary-light)";
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--secondary-primary)";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            Get started as Consumer
          </button>
        </div>

        {/* Placeholder for Hero Image */}
        <div
          className="mt-12 w-full max-w-4xl mx-auto h-64 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "var(--base-secondary)" }}
        >
          <span style={{ color: "var(--secondary-lighter)" }}>
            Platform Preview Image
          </span>
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
                backgroundColor: "var(--base-secondary)",
                color: "var(--secondary-lighter)",
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
          style={{ backgroundColor: "rgba(13, 17, 23, 0.5)" }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn"
            style={{ backgroundColor: "var(--base-primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 transition-colors"
              style={{ color: "var(--secondary-lighter)" }}
              onMouseEnter={(e) =>
                (e.target.style.color = "var(--secondary-primary)")
              }
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--secondary-lighter)")
              }
            >
              <FaTimes size={22} />
            </button>

            {/* Tabs */}
            <div
              className="flex mb-4"
              style={{ borderBottom: "1px solid var(--base-tertiary)" }}
            >
              <button
                className="flex-1 py-2 font-medium"
                style={{
                  color: !isSignup
                    ? "var(--accent-primary)"
                    : "var(--secondary-lighter)",
                  borderBottom: !isSignup
                    ? "2px solid var(--accent-primary)"
                    : "none",
                }}
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
            </div>

            {/* Forms */}
            <LoginForm isSignup={isSignup} />
            <AccessRequestForm />
          </div>
        </div>
      )}
    </div>
  );
}
