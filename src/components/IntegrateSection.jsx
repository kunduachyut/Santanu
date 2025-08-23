export default function IntegrateSection() {
  return (
    <section className="w-full px-6 py-20 flex flex-col items-center text-center">
      {/* Top Badge */}
      <span className="px-4 py-1 text-xs font-medium uppercase text-pink-600 bg-pink-100 rounded-full">
        Power
      </span>

      {/* Heading */}
      <h2 className="mt-6 text-4xl md:text-5xl font-bold max-w-3xl">
        Integrate with any{" "}
        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Listed website
        </span>
      </h2>
      <p className="mt-6 text-lg max-w-2xl text-gray-600">
        Seamlessly integrate with your favorite platforms and share all your
        links through one smart, customizable page.
      </p>

      {/* Two-column features */}
      <div className="grid md:grid-cols-2 gap-16 mt-20 max-w-6xl w-full items-center">
        {/* Left: Publisher */}
        <div className="text-left flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src="/Div [ρeukSl].png" alt="Publisher Icon" className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold">
            Be the Best{" "}
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Publisher
            </span>
          </h3>
          <p className="text-gray-600">
            Be the best publisher of your digital world — share, organize, and
            showcase everything in one powerful link.
          </p>
          <img
            src="Image [__wab_img]-5.png"
            alt="Publisher Preview"
            className="rounded-xl shadow-md mt-4"
          />
        </div>

        {/* Right: Advertiser */}
        <div className="text-left flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src="Div [ρcqUym].png" alt="Advertiser Icon" className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold">
            Be the Best{" "}
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Advertiser
            </span>
          </h3>
          <p className="text-gray-600">
            Reach engaged audiences by placing your brand inside the link hubs
            they visit every day — smart, seamless, and built for results.
          </p>
          <img
            src="/Image [__wab_img]-4.png"
            
            alt="Advertiser Preview"
            className="rounded-xl shadow-md mt-4"
          />
        </div>
      </div>
    </section>
  );
}
