"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Card */}
      <div className="hero-section text-center">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto">
          The{" "}
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Publisher
          </span>{" "}
          for your Content & Links
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
          Create a central hub for all your important links – publish, organize,
          and share them with your audience in one beautiful, easy-to-manage
          platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <a href="/dashboard/publisher">
            <button className="rounded-2xl px-6 py-3 bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition">
              Get started as Publisher
            </button>
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl px-6 py-3 bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition"
          >
            Get started as Consumer
          </button>
        </div>

        {/* Placeholder for Hero Image */}
        <div className="mt-12 w-full max-w-4xl mx-auto h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-500">Platform Preview Image</span>
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
              className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={22} />
            </button>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 font-medium ${
                  !isSignup
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
            </div>

            {/* Form */}
            <LoginForm isSignup={isSignup} />

            {/* Request Access */}
            <div className="mt-4 border-t pt-3 text-center">
              <p className="text-sm text-gray-600">
                Don’t have access yet?{" "}
                <button
                  onClick={() =>
                    alert("Fuck you..................")
                  }
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Request to become a Consumer
                </button>
              </p>
            </div>
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
      router.push("/dashboard/consumer"); // ✅ redirect
    } else {
      alert("Enter a valid email and password");
    }
  };

  return (
    <>
      {!isSignup ? (
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      ) : null}
    </>
  );
}
