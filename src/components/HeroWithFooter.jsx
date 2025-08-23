import Link from "next/link";

export default function HeroWithFooter() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Gradient circle behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 opacity-30 blur-3xl" />
        </div>

        {/* Headline */}
        <h1 className="relative text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
          Build outside the box <br />
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            with Name
          </span>
        </h1>

        {/* Sub text buttons */}
        <div className="relative flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-300">
          <span className="px-4 py-1 rounded-full border border-gray-700">
            NO CREDIT CARD NEEDED
          </span>
          <span className="px-4 py-1 rounded-full border border-gray-700">
            UNLIMITED TIME ON FREE PLAN
          </span>
        </div>

        {/* CTA Button */}
        <div className="relative mt-8">
          <button className="px-8 py-3 rounded-full bg-white text-black font-medium hover:opacity-90 transition">
            Get started
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative border-t border-gray-800 px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto text-sm text-gray-400">
          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Integrations</Link></li>
              <li><Link href="#">Figma plugin</Link></li>
              <li><Link href="#">Templates</Link></li>
              <li><Link href="#">Changelog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#">Documentation</Link></li>
              <li><Link href="#">Github</Link></li>
              <li><Link href="#">Community Forum</Link></li>
              <li><Link href="#">Slack Community</Link></li>
              <li><Link href="#">Name Experts</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Customer Stories</Link></li>
              <li><Link href="#">Affiliates</Link></li>
              <li><Link href="#">Twitter</Link></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="font-semibold text-white mb-4">Use Cases</h3>
            <ul className="space-y-2">
              <li><Link href="#">CMS</Link></li>
              <li><Link href="#">Web app</Link></li>
              <li><Link href="#">Business apps</Link></li>
              <li><Link href="#">Internal tools</Link></li>
              <li><Link href="#">Admin panels</Link></li>
              <li><Link href="#">React app builder</Link></li>
              <li><Link href="#">All use cases</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 text-gray-500 text-xs max-w-6xl mx-auto">
          <p>Copyright © 2025 name, Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#"><i className="fab fa-x-twitter" /></Link>
            <Link href="#"><i className="fab fa-linkedin" /></Link>
            <Link href="#"><i className="fab fa-youtube" /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
