import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "Marketplace",
  description: "Publish and buy websites",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
        >
          {/* Header */}
          <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
            {/* Nav */}
            <nav className="flex items-center gap-8">
              <a className="text-xl font-bold" href="/">
                Name
              </a>
              <a href="/dashboard/consumer" className="text-gray-700">
                Consumer
              </a>
              <a href="/dashboard/publisher" className="text-gray-700">
                Publisher
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
