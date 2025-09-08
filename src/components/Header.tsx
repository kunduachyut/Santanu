"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 shadow w-full" style={{backgroundColor: 'var(--base-primary)', borderBottom: '1px solid var(--base-tertiary)'}}>
      {/* Nav */}
      <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8">
        <a className="text-lg sm:text-xl font-bold" href="/" style={{color: 'var(--secondary-primary)'}}>
          Name
        </a>
        <a href="/dashboard/consumer" className="text-sm sm:text-base hidden sm:block transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'}>
          Advertiser
        </a>
        <a href="/dashboard/publisher" className="text-sm sm:text-base hidden sm:block transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'}>
          Publisher
        </a>
        <a href="/dashboard/superadmin" className="text-sm sm:text-base hidden sm:block transition-colors" style={{color: 'var(--secondary-lighter)'}} onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--accent-primary)'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--secondary-lighter)'}>
          Super Admin
        </a>
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2 sm:gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="rounded-full font-medium text-xs sm:text-sm lg:text-base h-8 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-5 cursor-pointer transition-colors" style={{backgroundColor: 'var(--accent-primary)', color: 'white'}} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'var(--accent-primary)'}>
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}