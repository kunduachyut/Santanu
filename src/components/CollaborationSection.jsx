export default function CollaborationSection() {
  return (
    <section className="w-full px-6 py-20 flex flex-col items-center text-center">
      {/* Top Badge */}
      <span className="px-4 py-1 text-xs font-medium uppercase text-indigo-600 bg-indigo-100 rounded-full">
        Collaboration
      </span>

      {/* Heading */}
      <h2 className="mt-6 text-4xl md:text-5xl font-bold max-w-4xl">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Bridge the gap
        </span>{" "}
        between Websites
      </h2>

      {/* Subheading */}
      <p className="mt-6 text-lg max-w-2xl text-gray-600">
        NAME makes the publishing process more collaborative, so everyone can
        publish better experiences together.
      </p>

      {/* Features row */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-5xl w-full">
        {/* Left Feature */}
        <div className="text-left flex flex-col gap-3">
          <h3 className="text-2xl font-semibold">
            Empower{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              new websites
            </span>
          </h3>
          <p className="text-gray-600">
            Empower marketing, content, design, and product teams to build and
            publish. Developers can register custom components as building
            blocks that other team members can use.
          </p>
        </div>

        {/* Right Feature */}
        <div className="text-left flex flex-col gap-3">
          <h3 className="text-2xl font-semibold">
            Collaborate{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              famous sites
            </span>
          </h3>
          <p className="text-gray-600">
            Go from silos and endless backlogs to streamlined workflows between
            development and business teams. Let everyone focus on what they do
            best with branching and multiplayer mode.
          </p>
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="mt-16 w-full max-w-5xl h-72 bg-gray-200 rounded-xl shadow-inner" />
    </section>
  );
}
