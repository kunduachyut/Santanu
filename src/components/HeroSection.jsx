export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-br ">
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
        The{" "}
        <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Publisher
        </span>{" "}
        for your Content & Links
      </h1>

      <p className="mt-6 text-lg md:text-xl max-w-2xl text-gray-700">
        Create a central hub for all your important links – publish, organize,
        and share them with your audience in one beautiful, easy-to-manage
        platform
      </p>

      {/* CTA Button */}
      <button className="mt-6 rounded-2xl px-6 py-3 bg-black text-white hover:bg-gray-800 transition">
        Get started free
      </button>

      {/* Placeholder for Hero Image */}
      <div className="mt-12 w-full max-w-5xl h-80 bg-gray-300 rounded-xl"></div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          Internal tools
        </span>
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          Customer portals
        </span>
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          SaaS apps
        </span>
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          Content
        </span>
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          Websites
        </span>
        <span className="px-4 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          Content management
        </span>
      </div>
    </section>
  );
}
