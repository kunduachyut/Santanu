"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ isSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || password.trim() === "") {
      setError("Please enter a valid email and password");
      setIsLoading(false);
      return;
    }

    try {
      // Check if user exists and is approved
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.approved) {
          // User is approved, redirect to dashboard
          router.push("/dashboard/consumer");
        } else {
          // User exists but is not approved
          setError("Your account is pending approval. Please wait for administrator approval.");
        }
      } else {
        // Invalid credentials
        setError(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignup) return null;

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label
          className="block mb-1 font-medium"
          style={{ color: "var(--secondary-primary)" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
          style={{
            backgroundColor: "var(--base-secondary)",
            border: "1px solid var(--base-tertiary)",
            color: "var(--secondary-primary)",
          }}
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block mb-1 font-medium"
          style={{ color: "var(--secondary-primary)" }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
          style={{
            backgroundColor: "var(--base-secondary)",
            border: "1px solid var(--base-tertiary)",
            color: "var(--secondary-primary)",
          }}
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-red-600 bg-red-100 border border-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 rounded-lg transition disabled:opacity-70"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "white",
        }}
      >
        {isLoading ? "Checking..." : "Login"}
      </button>
    </form>
  );
}