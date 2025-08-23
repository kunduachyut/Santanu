export default function TrustedBySection() {
  return (
    <section className="w-full px-6 py-16 flex flex-col items-center text-center">
      {/* Logos */}
      <p className="text-gray-500 mb-10">Loved by teams around the world</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center max-w-5xl">
        <img src="/logos/envato.svg" alt="Envato" className="h-8 mx-auto" />
        <img src="/logos/scale.svg" alt="Scale" className="h-8 mx-auto" />
        <img src="/logos/intuit.svg" alt="Intuit" className="h-8 mx-auto" />
        <img src="/logos/guidewire.svg" alt="Guidewire" className="h-8 mx-auto" />
        <img src="/logos/mymusclechef.svg" alt="My Muscle Chef" className="h-8 mx-auto" />
        <img src="/logos/abnormal.svg" alt="Abnormal" className="h-8 mx-auto" />
        <img src="/logos/kilohealth.svg" alt="Kilo Health" className="h-8 mx-auto" />
        <img src="/logos/aroundhome.svg" alt="Aroundhome" className="h-8 mx-auto" />
        <img src="/logos/playvs.svg" alt="PlayVS" className="h-8 mx-auto" />
        <img src="/logos/blink.svg" alt="Blink" className="h-8 mx-auto" />
        <img src="/logos/linearb.svg" alt="LinearB" className="h-8 mx-auto" />
        <img src="/logos/yours.svg" alt="Yours" className="h-8 mx-auto" />
        <img src="/logos/orderful.svg" alt="Orderful" className="h-8 mx-auto col-span-2 md:col-span-6" />
      </div>

      {/* How it works */}
      <div className="mt-20">
        <span className="px-4 py-1 text-xs font-medium uppercase text-purple-600 bg-purple-100 rounded-full">
          How it works
        </span>
        <h2 className="mt-6 text-4xl md:text-5xl font-bold">
          Promote Your Sites{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            blazingly fast
          </span>
        </h2>
        <p className="mt-6 text-lg max-w-2xl text-gray-600 mx-auto">
          Share your entire digital presence with a single link — from social
          profiles to projects, all in one place.
        </p>
      </div>
    </section>
  );
}
