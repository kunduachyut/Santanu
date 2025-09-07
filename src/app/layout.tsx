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
import { CartProvider } from "../app/context/CartContext";

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
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
            rel="stylesheet"
          />
          <style>{`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
          `}</style>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full antialiased`}
        >
          <CartProvider>
            <div className="w-full min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-white shadow w-full">
              {/* Nav */}
              <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                <a className="text-lg sm:text-xl font-bold" href="/">
                  Name
                </a>
                <a href="/dashboard/consumer" className="text-gray-700 text-sm sm:text-base hidden sm:block">
                  Advertiser
                </a>
                <a href="/dashboard/publisher" className="text-gray-700 text-sm sm:text-base hidden sm:block">
                  Publisher
                </a>
                <a href="/dashboard/superadmin" className="text-gray-700 text-sm sm:text-base hidden sm:block">
                  Super Admin
                </a>
              </nav>

              {/* Auth Buttons */}
              <div className="flex items-center gap-2 sm:gap-4">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-xs sm:text-sm lg:text-base h-8 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-5 cursor-pointer">
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
            <main className="w-full">{children}</main>
            </div>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
